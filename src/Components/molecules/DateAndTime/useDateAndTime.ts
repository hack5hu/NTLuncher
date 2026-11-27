import {useState, useEffect, useCallback} from 'react';
import {NativeModules, AppState as RNAppState} from 'react-native';
import useAppStore from '../../../Store/AppStore';
import {useThemeColors} from '../../../theme';

const {AppList} = NativeModules;

export const useDateAndTime = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [screenTime, setScreenTime] = useState<string>('');
  const [hasUsagePermission, setHasUsagePermission] = useState<boolean>(true);
  const {settingState} = useAppStore();

  const isAmoled = settingState.themeMode === 'Amoled';
  const isDark = settingState.themeMode === 'Dark' || isAmoled;
  const showScreenTime = Boolean(settingState.screenTime);

  const fetchScreenTime = useCallback(async () => {
    if (!showScreenTime || !AppList?.getScreenTime) return;
    try {
      const resultJson = await AppList.getScreenTime();
      const data = JSON.parse(resultJson);
      setHasUsagePermission(data.hasPermission);
      if (data.hasPermission && data.formattedTime) {
        setScreenTime(data.formattedTime);
      } else {
        setScreenTime('');
      }
    } catch (e) {
      console.log('Error fetching screen time:', e);
    }
  }, [showScreenTime]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
      );
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      };
      setCurrentDate(now.toLocaleDateString('en-US', options));
    };

    updateTime();
    fetchScreenTime();

    const interval = setInterval(() => {
      updateTime();
    }, 1000);

    const screenTimeInterval = setInterval(() => {
      fetchScreenTime();
    }, 60000);

    const subscription = RNAppState.addEventListener('change', nextState => {
      if (nextState === 'active') {
        updateTime();
        fetchScreenTime();
      }
    });

    return () => {
      clearInterval(interval);
      clearInterval(screenTimeInterval);
      subscription.remove();
    };
  }, [fetchScreenTime]);

  const openScreenTime = useCallback(() => {
    AppList.openDigitalWellbeingOrUsageSettings();
  }, []);

  const launchApp = useCallback((packageName: string) => {
    AppList.launchApp(packageName);
  }, []);

  const colors = useThemeColors();
  const textColor = colors.textOnWallpaper;

  return {
    currentTime,
    currentDate,
    screenTime,
    showScreenTime,
    hasUsagePermission,
    textColor,
    launchApp,
    openScreenTime,
  };
};

