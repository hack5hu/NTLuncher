import {Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {styles} from './Styles';
import {AppListProps} from './Types';

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
      delayLongPress={300}
      key={item.index}>
      <Text style={styles.appLabel}>{item.customLabel || item.label}</Text>
    </TouchableOpacity>
  );
};

export default AppListItem;
