import {Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {styles} from './Styles';
import {AppListProps} from './Types';
import useAppStore from '../../../Store/AppStore';

const AppListItem: React.FC<AppListProps> = ({
  item,
  onPress,
  onLongPress,
  index,
}) => {
  const {settingState} = useAppStore();
  return (
    <TouchableOpacity
      style={styles.appItem}
      onPress={() => onPress(item)}
      onLongPress={onLongPress ? () => onLongPress(item, index) : undefined}
      delayLongPress={300}
      key={item.index}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={[styles.appLabel, {fontSize: settingState.textSize}]}>
          {item.isWorkApp ? 'work app' : item.isDualApp ? 'duplicate' : ''}{' '}
          {item.customLabel || item.label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default AppListItem;
