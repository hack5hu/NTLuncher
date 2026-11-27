import React, {memo} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import AppDetailsIcon from '../../atoms/AppDetailsIcon/AppDetailsIcon';
import images from '../../../Assets/Assets';
import useAppStore from '../../../Store/AppStore';
import {ThemeMode} from '../../../Constants/ConstantVar';
import {AppItemProps} from '../../../Type';

interface DefaultActionsRowProps {
  item: AppItemProps;
  handleRename: (item: AppItemProps) => void;
  handleInfo: (item: AppItemProps) => void;
  handleDelete: (item: AppItemProps) => void;
  handleToggleHide: (item: AppItemProps) => void;
  closeActions: () => void;
}

const EyeToggleIcon: React.FC<{isHidden?: boolean; color: string}> = memo(
  ({isHidden, color}) => (
    <View style={styles.eyeWrapper}>
      <View style={[styles.eyeOutline, {borderColor: color}]}>
        <View style={[styles.eyePupil, {backgroundColor: color}]} />
      </View>
      {!isHidden && <View style={[styles.eyeSlash, {backgroundColor: color}]} />}
    </View>
  ),
);

const DefaultActionsRow: React.FC<DefaultActionsRowProps> = ({
  item,
  handleRename,
  handleInfo,
  handleDelete,
  handleToggleHide,
  closeActions,
}) => {
  const {settingState} = useAppStore();
  const isDark =
    settingState?.themeMode === ThemeMode.DARK ||
    settingState?.themeMode === ThemeMode.AMOLED;
  const cardBg = isDark ? 'rgba(34, 34, 38, 0.96)' : 'rgba(255, 255, 255, 0.96)';
  const tintColor = isDark ? '#F3F4F6' : '#1F2937';

  return (
    <View style={[styles.container, {backgroundColor: cardBg}]}>
      <AppDetailsIcon
        image={images.close}
        label="Close"
        onPress={closeActions}
        item={item}
        tintColor={tintColor}
      />
      <AppDetailsIcon
        image={images.edit}
        label="Rename"
        onPress={() => handleRename(item)}
        item={item}
        tintColor={tintColor}
      />
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={item.isHidden ? 'Unhide' : 'Hide'}
        style={styles.actionButton}
        activeOpacity={0.65}
        onPress={() => handleToggleHide(item)}>
        <EyeToggleIcon isHidden={item.isHidden} color={tintColor} />
        <Text style={[styles.actionLabel, {color: tintColor}]} numberOfLines={1}>
          {item.isHidden ? 'Unhide' : 'Hide'}
        </Text>
      </TouchableOpacity>
      <AppDetailsIcon
        image={images.info}
        label="Info"
        onPress={() => handleInfo(item)}
        item={item}
        tintColor={tintColor}
      />
      <AppDetailsIcon
        image={images.trash}
        label="Delete"
        onPress={() => handleDelete(item)}
        item={item}
        tintColor={tintColor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 14,
    marginVertical: 6,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 5,
    textAlign: 'center',
  },
  eyeWrapper: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeOutline: {
    width: 20,
    height: 12,
    borderRadius: 10,
    borderWidth: 1.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyePupil: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  eyeSlash: {
    position: 'absolute',
    width: 22,
    height: 2,
    borderRadius: 1,
    transform: [{rotate: '-40deg'}],
  },
});

export default memo(DefaultActionsRow);
