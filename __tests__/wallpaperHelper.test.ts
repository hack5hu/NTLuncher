import {NativeModules} from 'react-native';
import {
  BING_WALLPAPER_API_URL,
  fetchDailyWallpaper,
  fetchRandomDailyWallpaper,
  getOlauncherDayKey,
  getTodayDateKey,
  OLAUNCHER_WALLPAPER_GIST_URL,
  pickWallpaperFromGistData,
  resetWallpaperCache,
  updateSystemWallpaper,
} from '../src/helper/wallpaperHelper';

describe('wallpaperHelper - Daily Wallpaper & Edge Cases', () => {
  const sampleDate = new Date(2026, 10, 27); // Nov 27, 2026 -> month=10, day-1=26

  beforeEach(() => {
    jest.clearAllMocks();
    resetWallpaperCache();
    (globalThis as unknown as {fetch: jest.Mock}).fetch = jest.fn();
    NativeModules.AppList.setWallpaper = jest.fn(() => Promise.resolve(true));
  });

  it('formats date keys correctly', () => {
    expect(getTodayDateKey(sampleDate)).toBe('2026-11-27');
    expect(getOlauncherDayKey(sampleDate)).toBe('10_26');
  });

  it('picks light/dark wallpaper for exact month_day key and handles fallbacks', () => {
    const data = {
      '0_0': {light: 'https://example.com/first-light', dark: 'https://example.com/first-dark'},
      '0_26': {light: 'https://example.com/day-light', dark: 'https://example.com/day-dark'},
      '10_26': {light: 'https://example.com/nov27-light', dark: 'https://example.com/nov27-dark'},
    };

    expect(pickWallpaperFromGistData(data, false, sampleDate)).toBe(
      'https://example.com/nov27-light',
    );
    expect(pickWallpaperFromGistData(data, true, sampleDate)).toBe(
      'https://example.com/nov27-dark',
    );

    // Fallback to 0_<day> when month key is absent
    const fallbackDayData = {
      '0_0': data['0_0'],
      '0_26': data['0_26'],
    };
    expect(pickWallpaperFromGistData(fallbackDayData, true, sampleDate)).toBe(
      'https://example.com/day-dark',
    );

    // Fallback to first entry when neither key exists
    expect(pickWallpaperFromGistData({'0_0': data['0_0']}, false, sampleDate)).toBe(
      'https://example.com/first-light',
    );

    // Fallback to light when dark URL is missing
    expect(
      pickWallpaperFromGistData({'10_26': {light: 'https://example.com/only-light'}}, true, sampleDate),
    ).toBe('https://example.com/only-light');

    // Invalid/empty data returns null
    expect(pickWallpaperFromGistData(null, false, sampleDate)).toBeNull();
    expect(pickWallpaperFromGistData({}, false, sampleDate)).toBeNull();
  });

  it('fetches from Olauncher Gist URL first', async () => {
    const fetchMock = (globalThis as unknown as {fetch: jest.Mock}).fetch;
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        '10_26': {light: 'https://images.unsplash.com/light-today', dark: 'https://images.unsplash.com/dark-today'},
      }),
    });

    const url = await fetchDailyWallpaper(false, sampleDate);
    expect(fetchMock.mock.calls[0][0]).toBe(OLAUNCHER_WALLPAPER_GIST_URL);
    expect(url).toBe('https://images.unsplash.com/light-today');
  });

  it('falls back to Bing wallpaper API when Olauncher Gist fails', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const fetchMock = (globalThis as unknown as {fetch: jest.Mock}).fetch;
    fetchMock
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({images: [{url: '/th?id=OHR.Test.jpg'}]}),
      });

    const url = await fetchDailyWallpaper(false, sampleDate);
    expect(fetchMock.mock.calls[0][0]).toBe(OLAUNCHER_WALLPAPER_GIST_URL);
    expect(fetchMock.mock.calls[1][0]).toBe(BING_WALLPAPER_API_URL);
    expect(url).toBe('https://www.bing.com/th?id=OHR.Test.jpg');
    warnSpy.mockRestore();
  });

  it('returns null gracefully when both Gist and Bing fail', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const fetchMock = (globalThis as unknown as {fetch: jest.Mock}).fetch;
    fetchMock.mockRejectedValue(new Error('Offline'));

    const url = await fetchDailyWallpaper(true, sampleDate);
    expect(url).toBeNull();
    warnSpy.mockRestore();
  });

  it('updates system wallpaper via native module and guards empty URL', async () => {
    expect(await updateSystemWallpaper('')).toBe(false);
    expect(NativeModules.AppList.setWallpaper).not.toHaveBeenCalled();

    expect(await updateSystemWallpaper('https://example.com/wall.jpg')).toBe(true);
    expect(NativeModules.AppList.setWallpaper).toHaveBeenCalledWith(
      'https://example.com/wall.jpg',
    );
  });

  it('fetches a random wallpaper avoiding currentUrl when multiple exist', async () => {
    const fetchMock = (globalThis as unknown as {fetch: jest.Mock}).fetch;
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        '0_0': {light: 'https://example.com/a.jpg', dark: 'https://example.com/a-dark.jpg'},
        '0_1': {light: 'https://example.com/b.jpg', dark: 'https://example.com/b-dark.jpg'},
      }),
    });

    const url = await fetchRandomDailyWallpaper(false, 'https://example.com/a.jpg');
    expect(url).toBe('https://example.com/b.jpg');
  });
});

