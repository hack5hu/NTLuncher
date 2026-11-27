import {Text, TouchableOpacity, View} from 'react-native';
import React, {useMemo} from 'react';
import {styles} from './Styles';
import {AppListProps} from './Types';
import useAppStore from '../../../Store/AppStore';
import {useThemeColors} from '../../../theme';

const AppListItem: React.FC<AppListProps> = ({
  item,
  onPress,
  onLongPress,
  index,
}) => {
  const {settingState} = useAppStore();
  const colors = useThemeColors();

  const {alignItems, textAlign} = useMemo(() => {
    const align = String(settingState.appAlignmentHorizontal);
    if (align === 'Left') {
      return {alignItems: 'flex-start' as const, textAlign: 'left' as const};
    }
    if (align === 'Center') {
      return {alignItems: 'center' as const, textAlign: 'center' as const};
    }
    return {alignItems: 'flex-end' as const, textAlign: 'right' as const};
  }, [settingState.appAlignmentHorizontal]);

  const prefix = item.isWorkApp
    ? 'work app '
    : item.isDualApp
    ? 'duplicate '
    : '';

  return (
    <TouchableOpacity
      style={[styles.appItem, {alignItems}]}
      onPress={() => onPress(item)}
      onLongPress={onLongPress ? () => onLongPress(item, index) : undefined}
      delayLongPress={300}>
      <View style={styles.rowContainer}>
        <Text
          style={[
            styles.appLabel,
            {
              fontSize: Number(settingState.textSize),
              color: colors.textOnWallpaper,
              textAlign,
            },
          ]}>
          {prefix}
          {item.customLabel || item.label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(AppListItem);
