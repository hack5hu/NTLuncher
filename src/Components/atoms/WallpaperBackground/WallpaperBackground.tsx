import React from 'react';
import {Image, StyleSheet, View, Dimensions} from 'react-native';
import useAppStore from '../../../Store/AppStore';
import {ThemeMode} from '../../../Constants/ConstantVar';

const {width, height} = Dimensions.get('window');

const WallpaperBackground = () => {
  const {settingState} = useAppStore();
  const wallpaperUrl = settingState.wallpaperUrl;
  const themeMode = settingState.themeMode;

  const isAmoled = themeMode === ThemeMode.AMOLED;
  const isDark = themeMode === ThemeMode.DARK || isAmoled;
  const overlayOpacity = isAmoled ? 0 : isDark ? 0.4 : 0.2;

  const backgroundColor = isAmoled
    ? '#000000'
    : isDark
    ? '#121212'
    : '#f5f5f5';

  return (
    <View style={StyleSheet.absoluteFill}>
      {!isAmoled && wallpaperUrl ? (
        <Image
          source={{uri: wallpaperUrl}}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.fallback, {backgroundColor}]} />
      )}
      {!isAmoled && (
        <View
          style={[styles.overlay, {backgroundColor: `rgba(0,0,0,${overlayOpacity})`}]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width,
    height,
  },
  fallback: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
  },
});

export default WallpaperBackground;
