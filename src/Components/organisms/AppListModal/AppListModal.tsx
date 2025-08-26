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
import AppListItem from '../../molecules/AppListItem/AppListItem';
import {styles} from './Styles';
import {AppItemProps} from '../../../Type';
import images from '../../../Assets/Assets';
import AppDetailsIcon from '../../atoms/AppDetailsIcon/AppDetailsIcon';
import useAppStore from '../../../Store/AppStore';
import {AppListModalProps} from './Types';

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
  const [rename, setRename] = useState<string>('');
  const [isRenaming, setIsRenaming] = useState<boolean>(false);
  const {height} = Dimensions.get('window');
  const translateY = useRef(new Animated.Value(height)).current;
  const {apps, setApps, homeApps, setHomeApp} = useAppStore();
  const inputRef = useRef<TextInput>(null);
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
  useEffect(() => {
    if (isModalVisible && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
    }
  }, [isModalVisible]);

  const fetchInstalledApps = async () => {
    try {
      const installedApps = await AppList.getInstalledApps();
      const parsedApps: AppItemProps[] = JSON.parse(installedApps);
      const updatedApps: AppItemProps[] = parsedApps.map(newApp => {
        const existingApp = apps.find(
          (app: AppItemProps) => app.packageName === newApp.packageName,
        );

        return {
          ...newApp,
          customLabel: existingApp?.customLabel || '',
          isRenamed: existingApp?.isRenamed || false,
        };
      });
      setApps(updatedApps);
    } catch (error) {
      console.error('Error fetching apps:', error);
    }
  };
  const filteredApps = apps.filter((app: AppItemProps) =>
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
  const handleRename = async (item: AppItemProps) => {
    const updatedApps = [...apps];

    if (updatedApps[item.index]) {
      updatedApps[item.index] = {
        packageName: item.packageName,
        label: item.label,
        index: item.index,
        customLabel: rename,
        isRenamed: true,
      };
    } else {
      updatedApps.push({
        packageName: item.packageName,
        label: item.label,
        index: item.index,
        isRenamed: false,
        customLabel: '',
      });
    }
    console.log('2345', updatedApps);

    setApps(updatedApps);
    setSelectedIndex(null);
    setRename('');
    setIsRenaming(false);
  };
  const scrollRef = useRef(null);
  const [isUserDragging, setIsUserDragging] = useState(false);
  const currentOffsetYRef = useRef(0);

  const handleScroll = (event: any) => {
    if (!isUserDragging) {
      return;
    }
    const offsetY = event.nativeEvent.contentOffset.y;
    currentOffsetYRef.current = offsetY;
    if (offsetY < -50) {
      closeModal();
    }
  };
  const handleScrollBeginDrag = () => setIsUserDragging(true);
  const handleScrollEndDrag = () => setIsUserDragging(false);

  return (
    <Modal
      transparent={true}
      animationType="fade"
      onRequestClose={closeModal}
      visible={isModalVisible}>
      <View style={styles.modalOverlay}>
        <View style={styles.dimOverlay} />
        <Animated.View
          style={[styles.modalContainer, {transform: [{translateY}]}]}
          {...panResponder.panHandlers}>
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Search apps..."
            placeholderTextColor="rgba(17,17,17,0.6)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={false}
          />

          <FlatList
            ref={scrollRef}
            data={filteredApps.sort((a: AppItemProps, b: AppItemProps) =>
              (a.customLabel || a.label)
                .toLowerCase()
                .localeCompare((b.customLabel || b.label).toLowerCase()),
            )}
            keyExtractor={(item: AppItemProps) => item.index.toString()}
            onScroll={handleScroll}
            onScrollBeginDrag={handleScrollBeginDrag}
            onScrollEndDrag={handleScrollEndDrag}
            scrollEventThrottle={16}
            overScrollMode="always"
            alwaysBounceVertical={true}
            decelerationRate="normal"
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{paddingBottom: 50}}
            showsVerticalScrollIndicator={false}
            bounces
            removeClippedSubviews
            renderItem={({item, index}) => (
              <>
                <AppListItem
                  onPress={onAppSelect}
                  item={item}
                  onLongPress={() => onLongPressFn(index)}
                  index={index}
                />

                {selectedIndex === index && (
                  <>
                    {isRenaming ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <TextInput
                          style={styles.rename}
                          autoFocus={true}
                          value={rename}
                          onChangeText={name => {
                            const capitalized =
                              name.charAt(0).toUpperCase() + name.slice(1);
                            setRename(capitalized);
                          }}
                        />
                        <AppDetailsIcon
                          image={images.edit}
                          label="Done"
                          onPress={() => {
                            handleRename(item);
                          }}
                          item={item}
                        />
                        <AppDetailsIcon
                          image={images.close}
                          label="Cancel"
                          onPress={() => {
                            setRename('');
                            setIsRenaming(false);
                            setSelectedIndex(null);
                          }}
                          item={item}
                        />
                      </View>
                    ) : (
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
                          label="Rename"
                          onPress={() => {
                            setIsRenaming(true);
                            setRename(item.customLabel || item.label);
                          }}
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
              </>
            )}
          />
        </Animated.View>
      </View>
    </Modal>
  );
};

export default AppListModal;
