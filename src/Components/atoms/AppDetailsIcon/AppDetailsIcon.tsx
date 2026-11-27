import {Image, Text, TouchableOpacity} from 'react-native';
import React, {memo} from 'react';
import {AppDetailsProps} from './Types';
import {styles} from './Styles';

const AppDetailsIcon: React.FC<AppDetailsProps> = ({
  item,
  onPress,
  image,
  label,
  tintColor = '#1F2937',
}) => {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      style={styles.containerStyle}
      activeOpacity={0.65}
      onPress={() => onPress(item)}>
      <Image
        source={image}
        style={[styles.imageIcon, {tintColor}]}
      />
      <Text style={[styles.label, {color: tintColor}]} numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default memo(AppDetailsIcon);
