import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import AppDetailsIcon from '../../atoms/AppDetailsIcon/AppDetailsIcon';
import images from '../../../Assets/Assets';
import {AppItemProps} from '../../../Type';

interface DefaultActionsRowProps {
  item: AppItemProps;
  handleRename: (item: AppItemProps) => void;
  handleInfo: (item: AppItemProps) => void;
  handleDelete: (item: AppItemProps) => void;
  handleToggleHide: (item: AppItemProps) => void;
  closeActions: () => void;
}

const DefaultActionsRow: React.FC<DefaultActionsRowProps> = ({
  item,
  handleRename,
  handleInfo,
  handleDelete,
  handleToggleHide,
  closeActions,
}) => (
  <View style={styles.container}>
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
    <TouchableOpacity
      style={styles.hideButton}
      onPress={() => handleToggleHide(item)}>
      <Text style={styles.hideText}>{item.isHidden ? '👁️' : '🙈'}</Text>
      <Text style={styles.hideLabel}>{item.isHidden ? 'Unhide' : 'Hide'}</Text>
    </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 8,
    marginVertical: 4,
    alignItems: 'center',
  },
  hideButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  hideText: {
    fontSize: 18,
  },
  hideLabel: {
    fontSize: 10,
    marginTop: 2,
    color: '#333333',
  },
});

export default DefaultActionsRow;
