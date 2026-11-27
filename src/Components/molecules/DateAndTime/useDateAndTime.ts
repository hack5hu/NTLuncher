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
  const use24Hour = settingState.clock24Hour !== false;

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
    let minuteTimeout: ReturnType<typeof setTimeout> | null = null;
    let minuteInterval: ReturnType<typeof setInterval> | null = null;
    let screenTimeInterval: ReturnType<typeof setInterval> | null = null;

    const updateTime = () => {
      const now = new Date();
      const nextTime = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: !use24Hour,
      });
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      };
      const nextDate = now.toLocaleDateString('en-US', options);

      setCurrentTime(prev => (prev === nextTime ? prev : nextTime));
      setCurrentDate(prev => (prev === nextDate ? prev : nextDate));
    };

    const stopTimers = () => {
      if (minuteTimeout) {
        clearTimeout(minuteTimeout);
        minuteTimeout = null;
      }
      if (minuteInterval) {
        clearInterval(minuteInterval);
        minuteInterval = null;
      }
      if (screenTimeInterval) {
        clearInterval(screenTimeInterval);
        screenTimeInterval = null;
      }
    };

    const startTimers = () => {
      stopTimers();
      updateTime();
      if (showScreenTime) {
        fetchScreenTime();
        screenTimeInterval = setInterval(fetchScreenTime, 60000);
      }

      // Align to the exact next minute boundary instead of polling every 1s
      const now = new Date();
      const msToNextMinute =
        (60 - now.getSeconds()) * 1000 - now.getMilliseconds() + 50;
      minuteTimeout = setTimeout(() => {
        updateTime();
        minuteInterval = setInterval(updateTime, 60000);
      }, msToNextMinute);
    };

    if (RNAppState.currentState === 'active') {
      startTimers();
    } else {
      updateTime();
    }

    const subscription = RNAppState.addEventListener('change', nextState => {
      if (nextState === 'active') {
        startTimers();
      } else {
        stopTimers();
      }
    });

    return () => {
      stopTimers();
      subscription.remove();
    };
  }, [fetchScreenTime, showScreenTime, use24Hour]);

  const openScreenTime = useCallback(() => {
    AppList.openDigitalWellbeingOrUsageSettings();
  }, []);

  const launchApp = useCallback((packageName: string) => {
    AppList?.launchApp?.(packageName);
  }, []);

  const openClock = useCallback(() => {
    if (AppList?.openClock) {
      AppList.openClock();
    } else {
      AppList?.launchApp?.('com.google.android.deskclock');
    }
  }, []);

  const openCalendar = useCallback(() => {
    if (AppList?.openCalendar) {
      AppList.openCalendar();
    } else {
      AppList?.launchApp?.('com.google.android.calendar');
    }
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
    openClock,
    openCalendar,
    openScreenTime,
  };
};

