import React from 'react';
import {View} from 'react-native';
import AppDetailsIcon from '../../atoms/AppDetailsIcon/AppDetailsIcon';
import images from '../../../Assets/Assets';
import {AppItemProps} from '../../../Type';

interface DefaultActionsRowProps {
  item: AppItemProps;
  handleRename: (item: AppItemProps) => void;
  handleInfo: (item: AppItemProps) => void;
  handleDelete: (item: AppItemProps) => void;
  closeActions: () => void;
}

const DefaultActionsRow: React.FC<DefaultActionsRowProps> = ({
  item,
  handleRename,
  handleInfo,
  handleDelete,
  closeActions,
}) => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: 'white',
      paddingHorizontal: 25,
      paddingVertical: 5,
    }}>
    <AppDetailsIcon
      image={images.close}
      label="Close"
      onPress={closeActions}
      item={item}
    />
    <AppDetailsIcon
      image={images.edit}
      label="Rename"
      onPress={() => handleRename(item)}
      item={item}
    />
    <AppDetailsIcon
      image={images.info}
      label="Info"
      onPress={() => handleInfo(item)}
      item={item}
    />
    <AppDetailsIcon
      image={images.trash}
      label="Delete"
      onPress={() => handleDelete(item)}
      item={item}
    />
  </View>
);

export default DefaultActionsRow;
