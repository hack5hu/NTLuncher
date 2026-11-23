import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, NativeModules, Vibration, StyleSheet} from 'react-native';
import useAppStore from '../../../Store/AppStore';

const DateAndTime = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const {AppList} = NativeModules;
  const {settingState} = useAppStore();
  const isDark = settingState.themeMode === 'Dark';

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
      );
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      };
      setCurrentDate(now.toLocaleDateString('en-US', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const launchApp = (packageName: string) => {
    Vibration.vibrate(10);
    AppList.launchApp(packageName);
  };

  const textColor = isDark ? '#FFFFFF' : '#000000';

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => launchApp('com.android.deskclock')}>
        <Text style={[styles.time, {color: textColor}]}>{currentTime}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => launchApp('com.android.calendar')}>
        <Text style={[styles.date, {color: textColor, opacity: 0.8}]}>
          {currentDate}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
  },
  time: {
    fontSize: 64,
    fontWeight: '300',
    letterSpacing: -2,
  },
  date: {
    fontSize: 18,
    fontWeight: '400',
    marginTop: -10,
  },
});

export default DateAndTime;
