import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  GestureResponderEvent,
  Keyboard,
  NativeModules,
  PanResponder,
  PanResponderGestureState,
} from 'react-native';
import useAppStore from '../Store/AppStore';
import {AppItemProps} from '../Type';
import {getAlignmentStyle} from '../helper/getAlignmentStyle';
import {fetchBingWallpaper, updateSystemWallpaper} from '../helper/wallpaperHelper';

const {AppList} = NativeModules;
const {height} = Dimensions.get('window');

export const useLauncher = () => {
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
  const [isSettingsModalVisible, setSettingsModalVisible] = useState(false);
  const [replaceAppIndex, setReplaceAppIndex] = useState<number | null>(null);

  /** 🔹 Sync Bing Wallpaper */
  useEffect(() => {
    if (settingState.dailyNewWallpaper) {
      const syncWallpaper = async () => {
        const url = await fetchBingWallpaper();
        if (url && url !== settingState.wallpaperUrl) {
          useAppStore.getState().setSettingState({wallpaperUrl: url});
          updateSystemWallpaper(url);
        }
      };
      syncWallpaper();
    }
  }, [settingState.dailyNewWallpaper, settingState.wallpaperUrl]);

  /** 🔹 Launch App */
  const launchApp = useCallback((item: AppItemProps) => {
    if (!item?.packageName) return;
    AppList.launchApp(item.packageName);
  }, []);

  /** 🔹 Modal Controls */
  const toggleModal = useCallback(
    (open: boolean) => {
      Animated.timing(translateY, {
        toValue: open ? 0 : height,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsLauncherAppModalVisible(open);
        setAppListVisible(open);
        if (open) setTimeout(() => Keyboard.dismiss(), 100);
      });
    },
    [setAppListVisible, translateY],
  );

  /** 🔹 PanResponder (Configurable swipe gestures like Olauncher) */
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (
        _: GestureResponderEvent,
        gesture: PanResponderGestureState,
      ) => {
        const {dx, dy} = gesture;

        if (dy < -60) {
          if (settingState.swipeUp === 'AppDrawer' || !settingState.swipeUp) {
            return toggleModal(true);
          }
          return launchApp({
            label: 'Custom App',
            packageName: String(settingState.swipeUp),
            index: 0,
          });
        }

        if (dy > 60) {
          if (settingState.swipeDown === 'Notifications' || !settingState.swipeDown) {
            return AppList.expandNotifications();
          }
          return launchApp({
            label: 'Custom App',
            packageName: String(settingState.swipeDown),
            index: 0,
          });
        }

        if (dx < -60) {
          const pkg = settingState.swipeLeft || 'com.android.settings';
          return launchApp({
            label: 'Quick App Left',
            packageName: String(pkg),
            index: 1,
          });
        }

        if (dx > 60) {
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

  const alignmentStyle = useMemo(
    () =>
      getAlignmentStyle(
        settingState.appAlignmentHorizontal,
        settingState.appAlignmentVertical,
      ),
    [settingState.appAlignmentHorizontal, settingState.appAlignmentVertical],
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
    };
  }, [settingState.appAlignmentHorizontal]);

  return {
    homeApps,
    visibleHomeApps,
    settingState,
    isAppListVisible,
    isLauncherAppModalVisible,
    isSettingsModalVisible,
    replaceAppIndex,
    panResponder,
    alignmentStyle,
    dateTimeAlignment,
    launchApp,
    toggleModal,
    selectAppForHome,
    replaceAppHome,
    openSettings,
    closeSettings,
    setSettingsModalVisible,
    setIsLauncherAppModalVisible,
  };
};

