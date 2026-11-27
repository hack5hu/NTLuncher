import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import useAppStore from '../../../Store/AppStore';
import {ThemeMode} from '../../../Constants/ConstantVar';

const WallpaperBackground = () => {
  const {settingState} = useAppStore();
  const wallpaperUrl = settingState.dailyNewWallpaper
    ? settingState.wallpaperUrl
    : '';
  const themeMode = settingState.themeMode;

  const isAmoled = themeMode === ThemeMode.AMOLED;
  const isDark = themeMode === ThemeMode.DARK || isAmoled;
  const overlayOpacity = isAmoled ? 0.45 : isDark ? 0.35 : 0.15;

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
              {backgroundColor: `rgba(0,0,0,${overlayOpacity})`},
            ]}
          />
        </>
      ) : isAmoled ? (
        <View style={[StyleSheet.absoluteFill, styles.amoledBg]} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  amoledBg: {
    backgroundColor: '#000000',
  },
});

export default WallpaperBackground;
