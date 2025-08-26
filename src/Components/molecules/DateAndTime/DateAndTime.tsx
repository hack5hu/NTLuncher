import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, NativeModules} from 'react-native';
import useAppStore from '../../Store/AppStore';
import {styles} from './Styles';

const DateAndTime = () => {
  const {isAppListVisible} = useAppStore();
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const {AppList} = NativeModules;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      );
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
      };
      setCurrentDate(now.toLocaleDateString('en-US', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const launchApp = (packageName: string) => {
    AppList.launchApp(packageName); // Replace with your desired app package name
  };

  return (
    <View style={[styles.container, {opacity: isAppListVisible ? 0 : 1}]}>
      <TouchableOpacity
        onPress={() => launchApp('com.google.android.deskclock')}>
        <Text style={styles.time}>{currentTime.slice(0, -3)}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => launchApp('com.google.android.calendar')}>
        <Text style={styles.date}>{currentDate}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DateAndTime;
