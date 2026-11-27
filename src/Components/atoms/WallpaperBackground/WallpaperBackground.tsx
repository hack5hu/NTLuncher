import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import useAppStore from '../../../Store/AppStore';
import {ThemeMode} from '../../../Constants/ConstantVar';
import {useThemeColors} from '../../../theme';

const WallpaperBackground = () => {
  const {settingState} = useAppStore();
  const colors = useThemeColors();
  const wallpaperUrl = settingState.dailyNewWallpaper
    ? settingState.wallpaperUrl
    : '';
  const isAmoled = settingState.themeMode === ThemeMode.AMOLED;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {wallpaperUrl ? (
        <>
          <Image
            source={{uri: String(wallpaperUrl)}}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
          <View
            style={[
              StyleSheet.absoluteFill,
              {backgroundColor: colors.wallpaperOverlay},
            ]}
          />
        </>
      ) : isAmoled ? (
        <View
          style={[
            StyleSheet.absoluteFill,
            {backgroundColor: colors.amoledBg},
          ]}
        />
      ) : null}
    </View>
  );
};

export default WallpaperBackground;
