import React, {memo} from 'react';
import {
  Animated,
  FlatList,
  Linking,
  Modal,
  RefreshControl,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
} from 'react-native';
import {useThemeColors} from '../../../theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
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
  initialShowHidden = false,
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
    modalHorizontalAlign,
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
    initialShowHidden,
  );

  const insets = useSafeAreaInsets();
  const colors = useThemeColors();

  const openWebSearch = () => {
    const query = searchQuery.trim();
    if (!query) return;
    Linking.openURL(
      `https://www.google.com/search?q=${encodeURIComponent(query)}`,
    ).catch(err => console.error('Web search error:', err));
  };

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
          style={[
            styles.modalContainer,
            {
              paddingTop: insets.top,
              transform: [{translateY}],
            },
          ]}>
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

          {showHiddenApps && (
            <TouchableWithoutFeedback onPress={blurInput}>
              <View style={styles.hiddenAppsRow}>
                <TouchableOpacity
                  onPress={() => {
                    blurInput();
                    toggleHiddenView();
                  }}>
                  <Text style={[styles.hiddenAppsText, {color: colors.textMuted}]}>
                    ← Back to all apps
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          )}

          <View
            testID="list-wrapper"
            style={styles.listWrapper}
            {...listPanResponder.panHandlers}>
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
              contentContainerStyle={[
                styles.listContent,
                {paddingBottom: Math.max(insets.bottom + 24, 50)},
              ]}
              showsVerticalScrollIndicator={false}
              initialNumToRender={16}
              maxToRenderPerBatch={12}
              windowSize={5}
              removeClippedSubviews
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={[styles.emptyStateText, {color: colors.textMuted}]}>
                    {showHiddenApps ? 'No hidden apps' : 'No matching apps found'}
                  </Text>
                  {!showHiddenApps && searchQuery.trim().length > 0 && (
                    <TouchableOpacity
                      style={[
                        styles.webSearchButton,
                        {backgroundColor: colors.actionPillBg},
                      ]}
                      onPress={openWebSearch}>
                      <Text
                        style={[
                          styles.webSearchText,
                          {color: colors.textPrimary},
                        ]}>
                        Search "{searchQuery.trim()}" on Web
                      </Text>
                    </TouchableOpacity>
                  )}
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
                        horizontalAlign={modalHorizontalAlign}
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
