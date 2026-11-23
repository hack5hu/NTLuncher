import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, View, Dimensions} from 'react-native';
import useAppStore from '../../../Store/AppStore';

const {width, height} = Dimensions.get('window');

const WallpaperBackground = () => {
  const {settingState} = useAppStore();
  const wallpaperUrl = settingState.wallpaperUrl;
  const themeMode = settingState.themeMode;

  const overlayOpacity = themeMode === 'Dark' ? 0.4 : 0.2;

  return (
    <View style={StyleSheet.absoluteFill}>
      {wallpaperUrl ? (
        <Image
          source={{uri: wallpaperUrl}}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.fallback, {backgroundColor: themeMode === 'Dark' ? '#121212' : '#f5f5f5'}]} />
      )}
      <View style={[styles.overlay, {backgroundColor: `rgba(0,0,0,${overlayOpacity})`}]} />
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
    ...StyleSheet.absoluteFillObject,
  },
});

export default WallpaperBackground;
