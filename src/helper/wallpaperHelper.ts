import { NativeModules } from 'react-native';

const { AppList } = NativeModules;

export const fetchBingWallpaper = async () => {
  try {
    const response = await fetch(
      'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US'
    );
    const data = await response.json();
    if (data.images && data.images.length > 0) {
      const url = `https://www.bing.com${data.images[0].url}`;
      return url;
    }
  } catch (error) {
    console.error('Error fetching Bing wallpaper:', error);
  }
  return null;
};

export const updateSystemWallpaper = async (url: string) => {
    try {
        await AppList.setWallpaper(url);
    } catch (error) {
        console.error('Error setting system wallpaper:', error);
    }
}
