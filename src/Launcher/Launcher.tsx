import React, {useState, useRef, useMemo, useCallback, useEffect} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Keyboard,
  Animated,
  Dimensions,
  NativeModules,
  TouchableWithoutFeedback,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  StatusBar,
} from 'react-native';
import AppListModal from '../Components/templates/AppListModal/AppListModal';
import AppListItem from '../Components/molecules/AppListItem/AppListItem';
import SettingsModal from '../Components/organisms/SettingsPage/SettingsPage';
import DateAndTime from '../Components/molecules/DateAndTime/DateAndTime';
import {AppItemProps} from '../Type';
import useAppStore from '../Store/AppStore';
import {getAlignmentStyle} from '../helper/getAlignmentStyle';
import WallpaperBackground from '../Components/atoms/WallpaperBackground/WallpaperBackground';
import {fetchBingWallpaper, updateSystemWallpaper} from '../helper/wallpaperHelper';
// import {setAppListVisible} from '../Store/StoreActions';

const {AppList} = NativeModules;
const {height} = Dimensions.get('window');

const LauncherScreen = () => {
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
    console.log('Launching app:', item.label);
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
        console.log('Setting isAppListVisible to', open);
        // console.log('isAppModalVisible', isAppListVisible);
        // console.log('isAppModalVisible', isAppListVisible);
        setAppListVisible(open);
        if (open) setTimeout(() => Keyboard.dismiss(), 100);
      });
    },
    [height, setAppListVisible, translateY],
  );

  /** 🔹 PanResponder (swipe gestures) */
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (
        _: GestureResponderEvent,
        gesture: PanResponderGestureState,
      ) => {
        const {dx, dy} = gesture;
        if (dy < -50) return toggleModal(true);
        if (dy > 50) return toggleModal(false);
        if (dx < -50)
          return launchApp({
            label: 'Settings',
            packageName: 'com.android.settings',
            index: 1,
          });
        if (dx > 50)
          return launchApp({
            label: 'Play Store',
            packageName: 'com.android.vending',
            index: 2,
          });
      },
    }),
  ).current;

  /** 🔹 Select & Replace App on Home */
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

  /** 🔹 Settings Modal */
  const openSettings = () => setSettingsModalVisible(true);
  const closeSettings = () => setSettingsModalVisible(false);

  /** 🔹 Derived Values */
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
  
  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <WallpaperBackground />
      {/* Long press anywhere to open settings */}

      <TouchableWithoutFeedback onLongPress={openSettings} delayLongPress={600}>
        <View style={StyleSheet.absoluteFill} />
      </TouchableWithoutFeedback>
      <StatusBar hidden={!settingState.statusBarOnTop} />

      {/* Date & Time */}
      <View
        style={[
          styles.dateTimeContainer,
          dateTimeAlignment,
          {opacity: isAppListVisible ? 0 : 1},
        ]}>
        <DateAndTime />
      </View>

      {/* Home Apps */}
      <View
        style={[
          styles.bottomContainer,
          alignmentStyle,
          {opacity: isAppListVisible ? 0 : 1},
        ]}>
        <FlatList
          data={visibleHomeApps}
          keyExtractor={item => item.index.toString()}
          renderItem={({item, index}) => (
            <AppListItem
              item={item}
              index={index}
              onPress={launchApp}
              onLongPress={() => selectAppForHome(index)}
            />
          )}
        />
      </View>

      {/* App List Modal */}
      <AppListModal
        panResponder={panResponder}
        onAppSelect={replaceAppIndex !== null ? replaceAppHome : launchApp}
        closeModal={() => toggleModal(false)}
        isModalVisible={isLauncherAppModalVisible}
      />

      {/* Settings Modal */}
      <SettingsModal
        visible={isSettingsModalVisible}
        closeSettingsModal={closeSettings}
        panResponder={panResponder}
        onAppSelect={replaceAppHome}
        closeModal={() => toggleModal(false)}
        setSettingsModalVisible={setSettingsModalVisible}
        setIsLauncherAppModalVisible={setIsLauncherAppModalVisible}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  bottomContainer: {
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 20,
  },
  dateTimeContainer: {
    position: 'absolute',
    top: 20,
    zIndex: 10,
    flexDirection: 'row',
    marginHorizontal: 20,
  },
});

export default LauncherScreen;
