import {Image, Text, TouchableOpacity} from 'react-native';
import React, {memo} from 'react';
import {useThemeColors} from '../../../theme';
import {AppDetailsProps} from './Types';
import {styles} from './Styles';

const AppDetailsIcon: React.FC<AppDetailsProps> = ({
  item,
  onPress,
  image,
  label,
  tintColor,
}) => {
  const colors = useThemeColors();
  const resolvedTint = tintColor ?? colors.textPrimary;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      style={styles.containerStyle}
      activeOpacity={0.65}
      onPress={() => onPress(item)}>
      <Image
        source={image}
        style={[styles.imageIcon, {tintColor: resolvedTint}]}
      />
      <Text style={[styles.label, {color: resolvedTint}]} numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default memo(AppDetailsIcon);
