import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  AppState,
  Dimensions,
  GestureResponderEvent,
  Keyboard,
  NativeModules,
  PanResponder,
  PanResponderGestureState,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useAppStore from '../Store/AppStore';
import {AppItemProps} from '../Type';
import {ThemeMode} from '../Constants/ConstantVar';
import {getAlignmentStyle} from '../helper/getAlignmentStyle';
import {
  fetchDailyWallpaper,
  getTodayDateKey,
  updateSystemWallpaper,
} from '../helper/wallpaperHelper';

const {AppList} = NativeModules;
const {height} = Dimensions.get('window');

export const useLauncher = () => {
  const insets = useSafeAreaInsets();
  const {
    homeApps,
    setHomeApp,
    settingState,
    isAppListVisible,
    setAppListVisible,
  } = useAppStore();

  const translateY = useRef(new Animated.Value(height)).current;
  const [isLauncherAppModalVisible, setIsLauncherAppModalVisible] =
    useState(false);

  // Synchronize isAppListVisible with modal state
  useEffect(() => {
    setAppListVisible(isLauncherAppModalVisible);
  }, [isLauncherAppModalVisible, setAppListVisible]);
  const [isSettingsModalVisible, setSettingsModalVisible] = useState(false);
  const [replaceAppIndex, setReplaceAppIndex] = useState<number | null>(null);
  const [gesturePickKey, setGesturePickKey] = useState<string | null>(null);
  const [openHiddenOnLaunch, setOpenHiddenOnLaunch] = useState<boolean>(false);
  const homePinchDistRef = useRef<number | null>(null);
  const isUnlockingHiddenHomeRef = useRef<boolean>(false);

  const isSyncingWallpaperRef = useRef(false);

  /** 🔹 Sync Daily Wallpaper (Olauncher Gist + Bing fallback) */
  const syncDailyWallpaper = useCallback(async () => {
    if (!settingState.dailyNewWallpaper || isSyncingWallpaperRef.current) return;

    const today = getTodayDateKey();
    const isDark =
      settingState.themeMode === ThemeMode.DARK ||
      settingState.themeMode === ThemeMode.AMOLED;
    const themeKey = isDark ? 'dark' : 'light';

    const alreadySyncedToday =
      settingState.lastWallpaperDate === today &&
      settingState.lastWallpaperTheme === themeKey &&
      Boolean(settingState.wallpaperUrl);

    if (alreadySyncedToday) return;

    isSyncingWallpaperRef.current = true;
    try {
      const url = await fetchDailyWallpaper(isDark);
      if (url) {
        useAppStore.getState().setSettingState({
          wallpaperUrl: url,
          lastWallpaperDate: today,
          lastWallpaperTheme: themeKey,
        });
        if (url !== settingState.wallpaperUrl) {
          await updateSystemWallpaper(url);
        }
      }
    } finally {
      isSyncingWallpaperRef.current = false;
    }
  }, [
    settingState.dailyNewWallpaper,
    settingState.lastWallpaperDate,
    settingState.lastWallpaperTheme,
    settingState.themeMode,
    settingState.wallpaperUrl,
  ]);

  useEffect(() => {
    syncDailyWallpaper();
    const sub = AppState.addEventListener('change', nextState => {
      if (nextState === 'active') {
        syncDailyWallpaper();
      }
    });
    return () => sub.remove();
  }, [syncDailyWallpaper]);

  /** 🔹 Sync Orientation Lock */
  useEffect(() => {
    AppList?.setPortraitLock?.(settingState.lockPortrait !== false);
  }, [settingState.lockPortrait]);

  /** 🔹 Double Tap to Lock Screen */
  const lastTapRef = useRef<number>(0);
  const handleHomeBackgroundPress = useCallback(() => {
    if (!settingState.doubleTapToLock) return;
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      lastTapRef.current = 0;
      AppList?.lockScreen?.();
    } else {
      lastTapRef.current = now;
    }
  }, [settingState.doubleTapToLock]);

  /** 🔹 Launch App */
  const launchApp = useCallback((item: AppItemProps) => {
    if (!item?.packageName) return;
    AppList.launchApp(item.packageName);
  }, []);

  /** 🔹 Modal Controls */
  const toggleModal = useCallback(
    (open: boolean) => {
      setIsLauncherAppModalVisible(open);
      setAppListVisible(open);
      if (open) {
        Keyboard.dismiss();
      }
    },
    [setAppListVisible],
  );

  const isModalOpenRef = useRef(false);
  isModalOpenRef.current = isLauncherAppModalVisible || isSettingsModalVisible;

  const unlockHiddenFromHome = useCallback(async () => {
    if (isUnlockingHiddenHomeRef.current || isModalOpenRef.current) return;
    isUnlockingHiddenHomeRef.current = true;
    try {
      const authFn = AppList?.authenticateUser;
      const verified = authFn
        ? await authFn('Hidden Apps', 'Unlock to view hidden apps')
        : true;
      if (verified) {
        setOpenHiddenOnLaunch(true);
        toggleModal(true);
      }
    } catch {
      // Ignore canceled auth
    } finally {
      isUnlockingHiddenHomeRef.current = false;
    }
  }, [toggleModal]);

  /** 🔹 PanResponder (Configurable swipe gestures + 2-finger spread for hidden apps) */
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: evt =>
        !isModalOpenRef.current && evt.nativeEvent.touches.length === 2,
      onStartShouldSetPanResponderCapture: evt =>
        !isModalOpenRef.current && evt.nativeEvent.touches.length === 2,
      onMoveShouldSetPanResponder: (evt, gesture) => {
        if (isModalOpenRef.current) return false;
        if (evt.nativeEvent.touches.length === 2) return true;
        // Only capture intentional vertical or horizontal swipes, allowing taps to pass through
        const {dx, dy} = gesture;
        return Math.abs(dy) > 15 || Math.abs(dx) > 30;
      },
      onMoveShouldSetPanResponderCapture: evt =>
        !isModalOpenRef.current && evt.nativeEvent.touches.length === 2,
      onPanResponderGrant: evt => {
        const touches = evt.nativeEvent.touches;
        if (touches.length === 2) {
          homePinchDistRef.current = Math.hypot(
            touches[0].pageX - touches[1].pageX,
            touches[0].pageY - touches[1].pageY,
          );
        } else {
          homePinchDistRef.current = null;
        }
      },
      onPanResponderMove: evt => {
        const touches = evt.nativeEvent.touches;
        if (touches.length === 2) {
          const dist = Math.hypot(
            touches[0].pageX - touches[1].pageX,
            touches[0].pageY - touches[1].pageY,
          );
          if (homePinchDistRef.current === null) {
            homePinchDistRef.current = dist;
          } else if (dist - homePinchDistRef.current > 40) {
            homePinchDistRef.current = null;
            unlockHiddenFromHome();
          }
        }
      },
      onPanResponderRelease: (
        evt: GestureResponderEvent,
        gesture: PanResponderGestureState,
      ) => {
        if (homePinchDistRef.current !== null || evt.nativeEvent.touches.length >= 2) {
          homePinchDistRef.current = null;
          return;
        }
        const {dx, dy} = gesture;

        // Swipe Up -> App Drawer
        if (dy < -40 && Math.abs(dy) > Math.abs(dx)) {
          if (settingState.swipeUp === 'AppDrawer' || !settingState.swipeUp) {
            return toggleModal(true);
          }
          return launchApp({
            label: 'Custom App',
            packageName: String(settingState.swipeUp),
            index: 0,
          });
        }

        // Swipe Down -> Notifications
        if (dy > 40 && Math.abs(dy) > Math.abs(dx)) {
          if (settingState.swipeDown === 'Notifications' || !settingState.swipeDown) {
            return AppList.expandNotifications();
          }
          return launchApp({
            label: 'Custom App',
            packageName: String(settingState.swipeDown),
            index: 0,
          });
        }

        // Swipe Left -> Quick App Left
        if (dx < -50 && Math.abs(dx) > Math.abs(dy)) {
          const pkg = settingState.swipeLeft || 'com.android.settings';
          return launchApp({
            label: 'Quick App Left',
            packageName: String(pkg),
            index: 1,
          });
        }

        // Swipe Right -> Quick App Right
        if (dx > 50 && Math.abs(dx) > Math.abs(dy)) {
          const pkg = settingState.swipeRight || 'com.android.vending';
          return launchApp({
            label: 'Quick App Right',
            packageName: String(pkg),
            index: 2,
          });
        }
      },
    }),
  ).current;

  const selectAppForHome = (index: number) => {
    if (settingState.lockHomeApps) return;
    setReplaceAppIndex(index);
    toggleModal(true);
  };

  const replaceAppHome = (item: AppItemProps) => {
    if (replaceAppIndex === null) return;

    const updatedApps = [...homeApps];
    updatedApps[replaceAppIndex] = {...item};
    setHomeApp(updatedApps);

    setReplaceAppIndex(null);
    toggleModal(false);
  };

  const openSettings = () => setSettingsModalVisible(true);
  const closeSettings = () => setSettingsModalVisible(false);

  const openGestureAppPicker = useCallback((key: string) => {
    setGesturePickKey(key);
    setSettingsModalVisible(false);
    toggleModal(true);
  }, [toggleModal]);

  const handleModalAppSelect = useCallback(
    (item: AppItemProps) => {
      if (gesturePickKey && item?.packageName) {
        useAppStore.getState().setSettingState({[gesturePickKey]: item.packageName});
        setGesturePickKey(null);
        toggleModal(false);
        setSettingsModalVisible(true);
        return;
      }
      if (replaceAppIndex !== null) {
        replaceAppHome(item);
        return;
      }
      launchApp(item);
    },
    [gesturePickKey, replaceAppIndex, launchApp, toggleModal],
  );

  const handleCloseAppModal = useCallback(() => {
    toggleModal(false);
    setOpenHiddenOnLaunch(false);
    if (gesturePickKey) {
      setGesturePickKey(null);
      setSettingsModalVisible(true);
    }
  }, [gesturePickKey, toggleModal]);

  const alignmentStyle = useMemo(
    () =>
      getAlignmentStyle(
        settingState.appAlignmentHorizontal,
        settingState.appAlignmentVertical,
        insets,
      ),
    [
      settingState.appAlignmentHorizontal,
      settingState.appAlignmentVertical,
      insets,
    ],
  );

  const visibleHomeApps = useMemo(() => {
    const count = Number(settingState?.appsOnHomeScreen) || 6;
    return homeApps.slice(0, count);
  }, [homeApps, settingState.appsOnHomeScreen]);

  const dateTimeAlignment = useMemo(() => {
    const map: Record<string, 'flex-start' | 'center' | 'flex-end'> = {
      Left: 'flex-start',
      Center: 'center',
      Right: 'flex-end',
    };
    return {
      alignSelf: map[settingState.appAlignmentHorizontal] ?? 'flex-start',
      top: insets.top ? insets.top + 8 : 36,
    };
  }, [settingState.appAlignmentHorizontal, insets.top]);

  return {
    insets,
    homeApps,
    visibleHomeApps,
    settingState,
    isAppListVisible,
    isLauncherAppModalVisible,
    isSettingsModalVisible,
    replaceAppIndex,
    gesturePickKey,
    openHiddenOnLaunch,
    panResponder,
    alignmentStyle,
    dateTimeAlignment,
    launchApp,
    toggleModal,
    selectAppForHome,
    replaceAppHome,
    openSettings,
    closeSettings,
    openGestureAppPicker,
    handleModalAppSelect,
    handleCloseAppModal,
    handleHomeBackgroundPress,
    setSettingsModalVisible,
    setIsLauncherAppModalVisible,
  };
};

