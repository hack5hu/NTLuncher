import React, {memo} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
  StatusBar,
} from 'react-native';
import AppListModal from '../Components/templates/AppListModal/AppListModal';
import AppListItem from '../Components/molecules/AppListItem/AppListItem';
import SettingsModal from '../Components/organisms/SettingsPage/SettingsPage';
import DateAndTime from '../Components/molecules/DateAndTime/DateAndTime';
import WallpaperBackground from '../Components/atoms/WallpaperBackground/WallpaperBackground';
import {useLauncher} from './useLauncher';
import {styles} from './Launcher.styles';

const LauncherScreen: React.FC = () => {
  const {
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
  } = useLauncher();

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

export default memo(LauncherScreen);
