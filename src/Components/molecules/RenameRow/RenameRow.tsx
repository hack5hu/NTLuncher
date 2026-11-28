import React, {memo} from 'react';
import {TextInput, View} from 'react-native';
import AppDetailsIcon from '../../atoms/AppDetailsIcon/AppDetailsIcon';
import images from '../../../Assets/Assets';
import {useThemeColors} from '../../../theme';
import {AppItemProps} from '../../../Type';
import {styles} from './styles';

interface RenameRowProps {
  item: AppItemProps;
  rename: string;
  setRename: (name: string) => void;
  handleRename: (item: AppItemProps) => void;
  closeActions: () => void;
}

const RenameRow: React.FC<RenameRowProps> = ({
  item,
  rename,
  setRename,
  handleRename,
  closeActions,
}) => {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, {backgroundColor: colors.floatingCard}]}>
      <TextInput
        value={rename}
        onChangeText={name => {
          const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
          setRename(capitalized);
        }}
        style={[
          styles.input,
          {backgroundColor: colors.inputSubtleBg, color: colors.textPrimary},
        ]}
        placeholder="Enter new App name..."
        placeholderTextColor={colors.inputPlaceholder}
        autoFocus
        returnKeyType="done"
        onSubmitEditing={() => handleRename(item)}
      />
      <View style={styles.buttonsRow}>
        <AppDetailsIcon
          image={images.edit}
          label="Done"
          onPress={() => handleRename(item)}
          item={item}
          tintColor={colors.textPrimary}
        />
        <AppDetailsIcon
          image={images.close}
          label="Cancel"
          onPress={closeActions}
          item={item}
          tintColor={colors.textPrimary}
        />
      </View>
    </View>
  );
};

export default memo(RenameRow);
