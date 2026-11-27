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
    gesturePickKey,
    openHiddenOnLaunch,
    panResponder,
    alignmentStyle,
    dateTimeAlignment,
    launchApp,
    selectAppForHome,
    openSettings,
    closeSettings,
    openGestureAppPicker,
    handleModalAppSelect,
    handleCloseAppModal,
    handleHomeBackgroundPress,
  } = useLauncher();

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <WallpaperBackground />

      {/* Long press to open settings; double tap to lock screen */}
      <TouchableWithoutFeedback
        onPress={handleHomeBackgroundPress}
        onLongPress={openSettings}
        delayLongPress={500}>
        <View style={StyleSheet.absoluteFill} />
      </TouchableWithoutFeedback>
      <StatusBar hidden={!settingState.statusBarOnTop} />

      {/* Date & Time */}
      {settingState.showDateTime !== false && (
        <View
          style={[
            styles.dateTimeContainer,
            dateTimeAlignment,
            {opacity: isAppListVisible || isSettingsModalVisible ? 0 : 1},
          ]}>
          <DateAndTime />
        </View>
      )}

      {/* Home Apps */}
      <View
        style={[
          styles.bottomContainer,
          alignmentStyle,
          {opacity: isAppListVisible || isSettingsModalVisible ? 0 : 1},
        ]}>
        <FlatList
          data={visibleHomeApps}
          keyExtractor={(item, slotIndex) =>
            `home-slot-${slotIndex}-${item.packageName || 'empty'}`
          }
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

      {/* Single shared App List Modal */}
      <AppListModal
        onAppSelect={handleModalAppSelect}
        closeModal={handleCloseAppModal}
        isModalVisible={isLauncherAppModalVisible}
        fromSettingsModal={Boolean(gesturePickKey)}
        initialShowHidden={openHiddenOnLaunch}
      />

      {/* Settings Modal */}
      <SettingsModal
        visible={isSettingsModalVisible}
        closeSettingsModal={closeSettings}
        onPickGestureApp={openGestureAppPicker}
      />
    </View>
  );
};

export default memo(LauncherScreen);
