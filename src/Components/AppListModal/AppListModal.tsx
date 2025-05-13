import {
  Animated,
  FlatList,
  Modal,
  TextInput,
  View,
  NativeModules,
  Dimensions,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import AppListItem from '../AppListItem/AppListItem';
import {styles} from './Styles';
import {AppItemProps} from '../../Type';
import images from '../../Assets/Assets';
import AppDetailsIcon from '../AppDetailsIcons/AppDetailsIcons';
interface AppListModalProps {
  panResponder: any;
  onAppSelect: any;
  closeModal: any;
  onLongPress?: any;
  isModalVisible: boolean;
}

const AppListModal: React.FC<AppListModalProps> = ({
  panResponder,
  onAppSelect,
  closeModal,
  onLongPress,
  isModalVisible,
}) => {
  const {AppList} = NativeModules;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [apps, setApps] = useState<AppItemProps[]>([]);
  const {height} = Dimensions.get('window');
  const translateY = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    fetchInstalledApps();
    if (isModalVisible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [height, isModalVisible, translateY]);

  const fetchInstalledApps = async () => {
    try {
      const installedApps = await AppList.getInstalledApps();
      console.log(JSON.parse(installedApps));
      console.log(installedApps);

      setApps(JSON.parse(installedApps));
    } catch (error) {
      console.error('Error fetching apps:', error);
    }
  };
  const filteredApps = apps.filter(app =>
    app.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const onLongPressFn = (index: number) => {
    setSelectedIndex(index);
  };
  const handleInfo = (item: AppItemProps) => {
    AppList.openAppSettings(item.packageName);
    setSelectedIndex(null);
  };
  const handleDelete = async (item: AppItemProps) => {
    await AppList.uninstallApp(item.packageName);
    setSelectedIndex(null);
  };
  return (
    <Modal
      transparent={true}
      animationType="fade"
      onRequestClose={closeModal}
      visible={isModalVisible}>
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[styles.modalContainer, {transform: [{translateY}]}]}
          {...panResponder.panHandlers}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search apps..."
            autoFocus={true}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <FlatList
            data={filteredApps}
            keyExtractor={(item: AppItemProps) => item.index.toString()}
            renderItem={({item, index}) => (
              <>
                <AppListItem
                  onPress={onAppSelect}
                  item={item}
                  onLongPress={() => onLongPressFn(index)}
                  index={index}
                />

                {selectedIndex === index && (
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
                      onPress={() => setSelectedIndex(null)}
                      item={item}
                    />
                    <AppDetailsIcon
                      image={images.edit}
                      label="Edit Name"
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
                )}
              </>
            )}
          />
        </Animated.View>
      </View>
    </Modal>
  );
};

export default AppListModal;
