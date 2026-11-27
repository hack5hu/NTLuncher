import React, {memo, useMemo} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import useAppStore from '../../../Store/AppStore';
import {useDateAndTime} from './useDateAndTime';
import {styles} from './DateAndTime.styles';

const DateAndTime: React.FC = () => {
  const {settingState} = useAppStore();
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

  const alignItems = useMemo<'flex-start' | 'center' | 'flex-end'>(() => {
    const map: Record<string, 'flex-start' | 'center' | 'flex-end'> = {
      Left: 'flex-start',
      Center: 'center',
      Right: 'flex-end',
    };
    return map[String(settingState.appAlignmentHorizontal)] ?? 'flex-start';
  }, [settingState.appAlignmentHorizontal]);

  return (
    <View style={[styles.container, {alignItems}]}>
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
