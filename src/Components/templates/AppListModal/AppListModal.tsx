import React, {memo} from 'react';
import {
  Animated,
  FlatList,
  Modal,
  RefreshControl,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
} from 'react-native';
import InputBox from '../../atoms/InputBox/InputBox';
import AppListItem from '../../molecules/AppListItem/AppListItem';
import AppItemActions from '../../organisms/AppItemActions/AppItemActions';
import {styles} from './Styles';
import {AppListModalProps} from './Types';
import {useAppListModal} from './useAppListModal';
import {getAppKey} from './useAppQuery';

const AppListModal: React.FC<AppListModalProps> = ({
  onAppSelect,
  closeModal,
  isModalVisible,
  fromSettingsModal = false,
}) => {
  const {
    searchQuery,
    setSearchQuery,
    selectedAppKey,
    selectAppActions,
    closeActions,
    rename,
    setRename,
    isRenaming,
    showHiddenApps,
    toggleHiddenView,
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
    dragHandlePanResponder,
    listPanResponder,
    handleClose,
    blurInput,
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
          style={[styles.modalContainer, {transform: [{translateY}]}]}>
          {!fromSettingsModal && (
            <View
              collapsable={false}
              style={styles.dragHandle}
              onTouchStart={blurInput}
              {...dragHandlePanResponder.panHandlers}
            />
          )}

          <InputBox
            value={searchQuery}
            onChangeText={setSearchQuery}
            inputRef={inputRef}
          />

          <TouchableWithoutFeedback onPress={blurInput}>
            <View style={styles.hiddenAppsRow}>
              <TouchableOpacity
                onPress={() => {
                  blurInput();
                  toggleHiddenView();
                }}>
                <Text style={styles.hiddenAppsText}>
                  {showHiddenApps ? '← Back to all apps' : 'View hidden apps'}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>

          <View style={styles.listWrapper} {...listPanResponder.panHandlers}>
            <FlatList
              ref={scrollRef}
              data={filteredApps}
              keyExtractor={item => `${getAppKey(item)}-${item.index}`}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              overScrollMode="never"
              bounces={false}
              decelerationRate="normal"
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="never"
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              removeClippedSubviews
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>
                    {showHiddenApps ? 'No hidden apps' : 'No matching apps found'}
                  </Text>
                </View>
              }
              refreshControl={
                !fromSettingsModal ? (
                  <RefreshControl
                    refreshing={false}
                    onRefresh={handleClose}
                    progressViewOffset={-1000}
                    colors={['transparent']}
                    progressBackgroundColor="transparent"
                  />
                ) : undefined
              }
              renderItem={({item}) => {
                const appKey = getAppKey(item);
                return (
                  <View>
                    <View style={dateTimeAlignment}>
                      <AppListItem
                        onPress={onAppSelect}
                        item={item}
                        onLongPress={() => selectAppActions(item)}
                        index={item.index}
                      />
                    </View>
                    {selectedAppKey === appKey && (
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
                        closeActions={closeActions}
                      />
                    )}
                  </View>
                );
              }}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default memo(AppListModal);
