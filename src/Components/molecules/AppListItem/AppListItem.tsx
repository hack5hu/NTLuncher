import {Text, TouchableOpacity, View} from 'react-native';
import React, {useMemo} from 'react';
import {styles} from './Styles';
import {AppListProps} from './Types';
import useAppStore from '../../../Store/AppStore';
import {ThemeMode} from '../../../Constants/ConstantVar';

const AppListItem: React.FC<AppListProps> = ({
  item,
  onPress,
  onLongPress,
  index,
}) => {
  const {settingState} = useAppStore();
  const isAmoled = settingState.themeMode === ThemeMode.AMOLED;
  const isDark = settingState.themeMode === ThemeMode.DARK || isAmoled;
  const textColor = isDark ? '#FFFFFF' : '#111111';

  return (
    <TouchableOpacity
      style={styles.appItem}
      onPress={() => onPress(item)}
      onLongPress={onLongPress ? () => onLongPress(item, index) : undefined}
      delayLongPress={300}
      key={item.index}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text
          style={[
            styles.appLabel,
            {fontSize: settingState.textSize, color: textColor},
          ]}>
          {item.isWorkApp ? 'work app' : item.isDualApp ? 'duplicate' : ''}{' '}
          {item.customLabel || item.label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(AppListItem);

