import {Image, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {AppDetailsProps} from './Types';
import {styles} from './Styles';

const AppDetailsIcon: React.FC<AppDetailsProps> = ({
  item,
  onPress,
  image,
  label,
}) => {
  return (
    <TouchableOpacity
      style={styles.containerStyle}
      onPress={() => onPress(item)}>
      <Image source={image} style={styles.imageIcon} />
      <Text>{label}</Text>
    </TouchableOpacity>
  );
};

export default AppDetailsIcon;
