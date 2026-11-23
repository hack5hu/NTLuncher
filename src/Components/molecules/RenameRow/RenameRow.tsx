import React from 'react';
import {View} from 'react-native';
import AppDetailsIcon from '../../atoms/AppDetailsIcon/AppDetailsIcon';
import images from '../../../Assets/Assets';
import {AppItemProps} from '../../../Type';
import InputBox from '../../atoms/InputBox/InputBox';
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
}) => (
  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
    <InputBox
      value={rename}
      onChangeText={name => {
        const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
        setRename(capitalized);
      }}
      customStyle={styles.rename}
      placeholder="Enter new App name..."
    />
    <AppDetailsIcon
      image={images.edit}
      label="Done"
      onPress={() => handleRename(item)}
      item={item}
    />
    <AppDetailsIcon
      image={images.close}
      label="Cancel"
      onPress={closeActions}
      item={item}
    />
  </View>
);

export default RenameRow;
