import React, {memo} from 'react';
import {TextInput, View} from 'react-native';
import AppDetailsIcon from '../../atoms/AppDetailsIcon/AppDetailsIcon';
import images from '../../../Assets/Assets';
import useAppStore from '../../../Store/AppStore';
import {ThemeMode} from '../../../Constants/ConstantVar';
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
  const {settingState} = useAppStore();
  const isDark =
    settingState?.themeMode === ThemeMode.DARK ||
    settingState?.themeMode === ThemeMode.AMOLED;
  const cardBg = isDark ? 'rgba(34, 34, 38, 0.96)' : 'rgba(255, 255, 255, 0.96)';
  const inputBg = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)';
  const textColor = isDark ? '#F3F4F6' : '#1F2937';
  const placeholderColor = isDark ? 'rgba(243,244,246,0.5)' : 'rgba(31,41,55,0.45)';

  return (
    <View style={[styles.container, {backgroundColor: cardBg}]}>
      <TextInput
        value={rename}
        onChangeText={name => {
          const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
          setRename(capitalized);
        }}
        style={[styles.input, {backgroundColor: inputBg, color: textColor}]}
        placeholder="Enter new App name..."
        placeholderTextColor={placeholderColor}
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
          tintColor={textColor}
        />
        <AppDetailsIcon
          image={images.close}
          label="Cancel"
          onPress={closeActions}
          item={item}
          tintColor={textColor}
        />
      </View>
    </View>
  );
};

export default memo(RenameRow);
