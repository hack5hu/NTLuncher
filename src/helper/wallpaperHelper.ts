import {NativeModules} from 'react-native';

const {AppList} = NativeModules;

export const OLAUNCHER_WALLPAPER_GIST_URL =
  'https://gist.githubusercontent.com/tanujnotes/85e2d0343ace71e76615ac346fbff82b/raw';

export const BING_WALLPAPER_API_URL =
  'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US';

export interface WallpaperEntry {
  light?: string;
  dark?: string;
}

export const getTodayDateKey = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getOlauncherDayKey = (date: Date = new Date()): string =>
  `${date.getMonth()}_${date.getDate() - 1}`;

export const pickWallpaperFromGistData = (
  data: Record<string, WallpaperEntry> | null | undefined,
  isDark: boolean,
  date: Date = new Date(),
): string | null => {
  if (!data || typeof data !== 'object') return null;

  const dayIndex = date.getDate() - 1;
  const entry =
    data[getOlauncherDayKey(date)] ??
    data[`0_${dayIndex}`] ??
    Object.values(data)[0];

  if (!entry || typeof entry !== 'object') return null;
  const url = isDark
    ? entry.dark || entry.light
    : entry.light || entry.dark;

  return typeof url === 'string' && url.trim().length > 0 ? url : null;
};

const FETCH_TIMEOUT_MS = 6000;
let cachedGistData: Record<string, WallpaperEntry> | null = null;

export const resetWallpaperCache = () => {
  cachedGistData = null;
};

const fetchWithTimeout = async (url: string): Promise<Response> => {
  if (typeof AbortController === 'undefined') {
    return fetch(url);
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, {signal: controller.signal});
  } finally {
    clearTimeout(timer);
  }
};

const getGistData = async (): Promise<Record<string, WallpaperEntry> | null> => {
  if (cachedGistData) return cachedGistData;
  const response = await fetchWithTimeout(OLAUNCHER_WALLPAPER_GIST_URL);
  if (!response.ok) return null;
  const data = (await response.json()) as Record<string, WallpaperEntry>;
  if (data && typeof data === 'object' && Object.keys(data).length > 0) {
    cachedGistData = data;
    return data;
  }
  return null;
};

export const fetchBingWallpaper = async (): Promise<string | null> => {
  try {
    const response = await fetchWithTimeout(BING_WALLPAPER_API_URL);
    if (!response.ok) return null;
    const data = await response.json();
    if (data?.images && data.images.length > 0 && data.images[0]?.url) {
      return `https://www.bing.com${data.images[0].url}`;
    }
  } catch (error) {
    console.warn('Error fetching Bing wallpaper:', error);
  }
  return null;
};

export const fetchDailyWallpaper = async (
  isDark: boolean,
  date: Date = new Date(),
): Promise<string | null> => {
  try {
    const data = await getGistData();
    const gistUrl = pickWallpaperFromGistData(data, isDark, date);
    if (gistUrl) return gistUrl;
  } catch (error) {
    console.warn('Error fetching Olauncher daily wallpaper:', error);
  }

  return fetchBingWallpaper();
};

export const fetchRandomDailyWallpaper = async (
  isDark: boolean,
  currentUrl?: string,
): Promise<string | null> => {
  try {
    const data = await getGistData();
    const entries = Object.values(data || {});
    if (entries.length > 0) {
      const candidates = entries
        .map(e => (isDark ? e.dark || e.light : e.light || e.dark))
        .filter((u): u is string => typeof u === 'string' && u.length > 0);
      const filtered =
        candidates.length > 1 && currentUrl
          ? candidates.filter(u => u !== currentUrl)
          : candidates;
      if (filtered.length > 0) {
        const idx = Math.floor(Math.random() * filtered.length);
        return filtered[idx];
      }
    }
  } catch (error) {
    console.warn('Error fetching random wallpaper:', error);
  }
  return fetchDailyWallpaper(isDark);
};

export const updateSystemWallpaper = async (url: string): Promise<boolean> => {
  if (!url || !AppList?.setWallpaper) return false;
  try {
    await AppList.setWallpaper(url);
    return true;
  } catch (error) {
    console.warn('Error setting system wallpaper:', error);
    return false;
  }
};
