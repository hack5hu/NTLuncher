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
  const shouldDim = settingState.dimWallpaper !== false;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {wallpaperUrl ? (
        <>
          <Image
            key={String(wallpaperUrl)}
            source={{uri: String(wallpaperUrl)}}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
          {shouldDim && (
            <View
              style={[
                StyleSheet.absoluteFill,
                {backgroundColor: colors.wallpaperOverlay},
              ]}
            />
          )}
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
