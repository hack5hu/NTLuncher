import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Keyboard,
  Animated,
  PanResponder,
  Dimensions,
  NativeModules,
  TouchableWithoutFeedback,
} from 'react-native';
import AppListModal from '../Components/organisms/AppListModal/AppListModal';
import AppListItem from '../Components/molecules/AppListItem/AppListItem';
import {AppItemProps} from '../Type';
import SettingsModal from '../Components/organisms/SettingsPage/SettingsPage';
import useAppStore from '../Store/AppStore';

const {AppList} = NativeModules;
const {height} = Dimensions.get('window');
const LauncherScreen = () => {
  // states
  const {apps, setApps, homeApps, setHomeApp, setAppListVisible} =
    useAppStore();
  const translateY = useRef(new Animated.Value(height)).current;
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSettingsModalVisible, setSettingsModalVisible] = useState(false);
  const [replaceApp, setReplaceApp] = useState<number | null>(null);

  //functions
  const launchApp = (item: AppItemProps) => {
    // AppList.launchApp(item.packageName);
    console.log('====================================');
    console.log('lunch appr', replaceApp);
    console.log('====================================');
  };
  const openModal = () => {
    setModalVisible(true);
    setAppListVisible(true);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setTimeout(() => Keyboard.dismiss(), 100));
  };

  const closeModal = () => {
    Animated.timing(translateY, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setAppListVisible(false);
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const {dx, dy} = gestureState;

        if (dy < -50) {
          openModal();
        } else if (dy > 50) {
          closeModal();
        } else if (dx < -50) {
          console.log('Swiped Left');
          launchApp({
            label: 'settings',
            packageName: 'com.android.settings',
            index: 5,
          });
        } else if (dx > 50) {
          console.log('Swiped Right');
          launchApp({
            label: 'play store',
            packageName: 'com.android.vending',
            index: 6,
          });
        }
      },
    }),
  ).current;

  const selectAppForHome = (index: number) => {
    setReplaceApp(index);
    openModal();
  };

  const replaceAppHome = (item: AppItemProps, index?: number) => {
    if (replaceApp === null) {
      return;
    }
    const updatedApps = [...homeApps];

    if (updatedApps[replaceApp]) {
      updatedApps[replaceApp] = {
        packageName: item.packageName,
        label: item.label,
        index: item.index,
        customLabel: item.customLabel,
      };
    } else {
      updatedApps.push({
        packageName: item.packageName,
        label: item.label,
        index: item.index,
        customLabel: item.customLabel,
      });
    }
    setHomeApp(updatedApps);

    setReplaceApp(null);
    closeModal();
  };

  const openSettings = () => {
    setSettingsModalVisible(true);
  };

  const closeSettings = () => {
    setSettingsModalVisible(false);
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Home content hidden when modal is open */}
      <View style={{opacity: isModalVisible ? 0 : 1}}>
        {/* Long Press area (only the empty background) */}
        <TouchableWithoutFeedback onLongPress={openSettings}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>

        <View style={styles.bottomRightContainer}>
          <FlatList
            data={homeApps}
            keyExtractor={item => item?.index.toString()}
            renderItem={({item, index}) => (
              <AppListItem
                onPress={launchApp}
                item={item}
                onLongPress={() => selectAppForHome(index)}
                index={index}
              />
            )}
          />
        </View>
      </View>

      <AppListModal
        panResponder={panResponder}
        onAppSelect={replaceApp !== null ? replaceAppHome : launchApp}
        closeModal={closeModal}
        isModalVisible={isModalVisible}
      />

      <SettingsModal
        visible={isSettingsModalVisible}
        closeSettingsModal={closeSettings}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  bottomRightContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 10,
    padding: 10,
  },
});

export default LauncherScreen;
