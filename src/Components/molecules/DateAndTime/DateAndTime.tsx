import React, {memo} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useDateAndTime} from './useDateAndTime';
import {styles} from './DateAndTime.styles';

const DateAndTime: React.FC = () => {
  const {
    currentTime,
    currentDate,
    screenTime,
    showScreenTime,
    hasUsagePermission,
    textColor,
    launchApp,
    openScreenTime,
  } = useDateAndTime();

  return (
    <View style={styles.container}>
      {/* Clock */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => launchApp('com.android.deskclock')}>
        <Text style={[styles.time, {color: textColor}]}>{currentTime}</Text>
      </TouchableOpacity>

      {/* Date */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => launchApp('com.android.calendar')}>
        <Text style={[styles.date, {color: textColor, opacity: 0.8}]}>
          {currentDate}
        </Text>
      </TouchableOpacity>

      {/* Screen Time Widget (Olauncher style with Digital Wellbeing launch) */}
      {showScreenTime && (
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.screenTimeRow}
          onPress={openScreenTime}>
          <Text style={[styles.screenTimeText, {color: textColor}]}>
            ⏱ {hasUsagePermission ? (screenTime || 'Calculating...') : 'Grant permission for screen time'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default memo(DateAndTime);
