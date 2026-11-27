import React, {memo} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import AppDetailsIcon from '../../atoms/AppDetailsIcon/AppDetailsIcon';
import images from '../../../Assets/Assets';
import {LauncherThemes, useThemeColors} from '../../../theme';
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
  const colors = useThemeColors();

  return (
    <View style={[styles.container, {backgroundColor: colors.floatingCard}]}>
      <AppDetailsIcon
        image={images.close}
        label="Close"
        onPress={closeActions}
        item={item}
        tintColor={colors.textPrimary}
      />
      <AppDetailsIcon
        image={images.edit}
        label="Rename"
        onPress={() => handleRename(item)}
        item={item}
        tintColor={colors.textPrimary}
      />
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={item.isHidden ? 'Unhide' : 'Hide'}
        style={styles.actionButton}
        activeOpacity={0.65}
        onPress={() => handleToggleHide(item)}>
        <EyeToggleIcon isHidden={item.isHidden} color={colors.textPrimary} />
        <Text
          style={[styles.actionLabel, {color: colors.textPrimary}]}
          numberOfLines={1}>
          {item.isHidden ? 'Unhide' : 'Hide'}
        </Text>
      </TouchableOpacity>
      <AppDetailsIcon
        image={images.info}
        label="Info"
        onPress={() => handleInfo(item)}
        item={item}
        tintColor={colors.textPrimary}
      />
      <AppDetailsIcon
        image={images.trash}
        label="Delete"
        onPress={() => handleDelete(item)}
        item={item}
        tintColor={colors.textPrimary}
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
    shadowColor: LauncherThemes.Light.shadow,
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
