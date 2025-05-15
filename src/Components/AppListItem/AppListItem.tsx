import {Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {styles} from './Styles';
import {AppListProps} from '../../Type';

const AppListItem: React.FC<AppListProps> = ({
  item,
  onPress,
  onLongPress,
  index,
}) => {
  return (
    <TouchableOpacity
      style={styles.appItem}
      onPress={() => onPress(item)}
      onLongPress={onLongPress ? () => onLongPress(item, index) : undefined}
      key={item.index}>
      <Text style={styles.appLabel}>{item.customLabel || item.label}</Text>
    </TouchableOpacity>
  );
};

export default AppListItem;
