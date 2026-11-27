import React, {memo} from 'react';
import {
  Animated,
  FlatList,
  Modal,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import InputBox from '../../atoms/InputBox/InputBox';
import AppListItem from '../../molecules/AppListItem/AppListItem';
import AppItemActions from '../../organisms/AppItemActions/AppItemActions';
import {styles} from './Styles';
import {AppListModalProps} from './Types';
import {AppItemProps} from '../../../Type';
import {useAppListModal} from './useAppListModal';

const AppListModal: React.FC<AppListModalProps> = ({
  panResponder,
  onAppSelect,
  closeModal,
  isModalVisible,
  fromSettingsModal = false,
}) => {
  const {
    searchQuery,
    setSearchQuery,
    selectedIndex,
    setSelectedIndex,
    rename,
    setRename,
    isRenaming,
    setIsRenaming,
    showHiddenApps,
    setShowHiddenApps,
    translateY,
    filteredApps,
    inputRef,
    scrollRef,
    dateTimeAlignment,
    handleRename,
    handleInfo,
    handleDelete,
    handleToggleHide,
    handleScroll,
    renameCallFn,
    modalPanResponder,
    handleClose,
  } = useAppListModal(
    isModalVisible,
    fromSettingsModal,
    onAppSelect,
    closeModal,
  );

  return (
    <Modal
      transparent={true}
      animationType="none"
      onRequestClose={handleClose}
      visible={isModalVisible}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.dimOverlay}
          activeOpacity={1}
          onPress={handleClose}
        />
        <Animated.View
          style={[styles.modalContainer, {transform: [{translateY}]}]}
          {...(!fromSettingsModal ? modalPanResponder.panHandlers : {})}>
          <InputBox
            value={searchQuery}
            onChangeText={setSearchQuery}
            inputRef={inputRef}
          />
          <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4, marginBottom: 8}}>
            <TouchableOpacity onPress={() => setShowHiddenApps(!showHiddenApps)}>
              <Text style={{color: '#888888', fontSize: 13}}>
                {showHiddenApps ? '← Back to all apps' : 'View hidden apps'}
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            ref={scrollRef}
            data={filteredApps.sort((a: AppItemProps, b: AppItemProps) =>
              (a.customLabel || a.label)
                .toLowerCase()
                .localeCompare((b.customLabel || b.label).toLowerCase()),
            )}
            keyExtractor={item => item.index.toString()}
            onScroll={handleScroll}
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
                    handleToggleHide={handleToggleHide}
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

export default memo(AppListModal);
