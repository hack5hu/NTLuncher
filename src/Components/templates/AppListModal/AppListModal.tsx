import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  FlatList,
  Modal,
  View,
  Dimensions,
  NativeModules,
  Text,
} from 'react-native';
// import SearchInput from '../../atoms/SearchInput';
import InputBox from '../../atoms/InputBox/InputBox';
import AppListItem from '../../molecules/AppListItem/AppListItem';
import AppItemActions from '../../organisms/AppItemActions/AppItemActions';
import useAppStore from '../../../Store/AppStore';
import {styles} from './Styles';
import {AppListModalProps} from './Types';
import {AppItemProps} from '../../../Type';

const AppListModal: React.FC<AppListModalProps> = ({
  panResponder,
  onAppSelect,
  closeModal,
  isModalVisible,
  fromSettingsModal = false,
}) => {
  const {AppList, } = NativeModules;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [rename, setRename] = useState<string>('');
  const [isRenaming, setIsRenaming] = useState<boolean>(false);
  const {height} = Dimensions.get('window');
  const translateY = useRef(new Animated.Value(height)).current;
  const {apps, setApps, settingState} = useAppStore();
  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const [isUserDragging, setIsUserDragging] = useState(false);
  const currentOffsetYRef = useRef(0);

  useEffect(() => {
    fetchInstalledApps();
    Animated.timing(translateY, {
      toValue: isModalVisible ? 0 : height,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [height, isModalVisible, translateY]);

  useEffect(() => {
    if (isModalVisible && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 500);
    }
  }, [isModalVisible]);

  const fetchInstalledApps = async () => {
    try {
      const installedApps = await AppList.getInstalledApps();

      const parsedApps: AppItemProps[] = JSON.parse(installedApps);

      const updatedApps: AppItemProps[] = parsedApps.map(newApp => {
        // Use both packageName + isWorkApp to identify uniqueness
        const existingApp = apps.find(
          (app: AppItemProps) =>
            app.packageName === newApp.packageName &&
            app.isWorkApp === newApp.isWorkApp,
        );

        return {
          ...newApp, // label, packageName, isWorkApp from native module
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

  const handleRename = (item: AppItemProps) => {
    const updatedApps = [...apps];
    if (updatedApps[item.index]) {
      updatedApps[item.index] = {...item, customLabel: rename, isRenamed: true};
    } else {
      updatedApps.push({...item, isRenamed: false, customLabel: ''});
    }
    setApps(updatedApps);
    setSelectedIndex(null);
    setRename('');
    setIsRenaming(false);
  };

  const handleInfo = (item: AppItemProps) => {
    AppList.openAppSettings(item.packageName);
    setSelectedIndex(null);
  };
  const handleDelete = async (item: AppItemProps) => {
    await AppList.uninstallApp(item.packageName);
    setSelectedIndex(null);
  };

  const handleScroll = (event: any) => {
    if (!isUserDragging) return;
    const offsetY = event.nativeEvent.contentOffset.y;
    currentOffsetYRef.current = offsetY;
    if (offsetY < -50) closeModal();
  };

  const renameCallFn = (item: AppItemProps) => {
    setIsRenaming(true);
    setRename(item.customLabel || item.label);
  };

  const dateTimeAlignment = useMemo(() => {
      const map: Record<string, 'flex-start' | 'center' | 'flex-end'> = {
        Left: 'flex-start',
        Center: 'center',
        Right: 'flex-end',
      };
      return {
        alignItems: map[settingState.appAlignmentHorizontal] ?? 'flex-start',
      };
    }, [settingState.appAlignmentHorizontal]);

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
            {...(!fromSettingsModal ? panResponder.panHandlers : {})}>
            <InputBox
              value={searchQuery}
              onChangeText={setSearchQuery}
              inputRef={inputRef}
            />
            <FlatList
              ref={scrollRef}
              data={filteredApps.sort((a: AppItemProps, b: AppItemProps) =>
                (a.customLabel || a.label)
                  .toLowerCase()
                  .localeCompare((b.customLabel || b.label).toLowerCase()),
              )}
              keyExtractor={item => item.index.toString()}
              onScroll={handleScroll}
              onScrollBeginDrag={() => setIsUserDragging(true)}
              onScrollEndDrag={() => setIsUserDragging(false)}
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
                <View style={[dateTimeAlignment]}>
                  <AppListItem
                    onPress={onAppSelect}
                    item={item}
                    onLongPress={() => setSelectedIndex(index)}
                    index={index}
                  />
                  {selectedIndex === index && (
                    <AppItemActions
                      item={item}
                      isRenaming={isRenaming}
                      rename={rename}
                      setRename={setRename}
                      saveRename={handleRename}
                      handleRename={renameCallFn}
                      handleInfo={handleInfo}
                      handleDelete={handleDelete}
                      closeActions={() => {
                        setRename('');
                        setIsRenaming(false);
                        setSelectedIndex(null);
                      }}
                    />
                  )}
                </View>
              )}
            />
          </Animated.View>
        </View>
      </Modal>
    );
};

export default AppListModal;
