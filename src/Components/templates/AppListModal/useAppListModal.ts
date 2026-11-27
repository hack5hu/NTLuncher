import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  Keyboard,
} from 'react-native';
import useAppStore from '../../../Store/AppStore';
import {AppItemProps} from '../../../Type';
import {useAppActions} from './useAppActions';
import {useAppQuery} from './useAppQuery';

const {height} = Dimensions.get('window');

export const useAppListModal = (
  isModalVisible: boolean,
  fromSettingsModal: boolean,
  onAppSelect: (item: AppItemProps) => void,
  closeModal: () => void,
) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showHiddenApps, setShowHiddenApps] = useState<boolean>(false);
  const translateY = useRef(new Animated.Value(height)).current;
  const {settingState} = useAppStore();
  const inputRef = useRef<any>(null);
  const scrollRef = useRef<any>(null);
  const scrollOffsetRef = useRef(0);

  const {
    selectedIndex,
    setSelectedIndex,
    rename,
    setRename,
    isRenaming,
    setIsRenaming,
    handleRename,
    handleInfo,
    handleDelete,
    handleToggleHide,
    renameCallFn,
  } = useAppActions();

  const {filteredApps, fetchInstalledApps} = useAppQuery(
    searchQuery,
    showHiddenApps,
  );

  useEffect(() => {
    fetchInstalledApps();
    Animated.spring(translateY, {
      toValue: isModalVisible ? 0 : height,
      damping: 24,
      stiffness: 260,
      mass: 0.9,
      useNativeDriver: true,
    }).start();
  }, [isModalVisible, translateY, fetchInstalledApps]);

  useEffect(() => {
    if (isModalVisible && settingState.autoShowKeyboard && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 400);
    }
    if (!isModalVisible) {
      setSearchQuery('');
      setSelectedIndex(null);
      setIsRenaming(false);
      setShowHiddenApps(false);
    }
  }, [isModalVisible, settingState.autoShowKeyboard, setIsRenaming, setSelectedIndex]);

  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (
      settingState.autoLaunchSearch &&
      trimmed.length >= 2 &&
      filteredApps.length === 1 &&
      isModalVisible &&
      !fromSettingsModal
    ) {
      const targetApp = filteredApps[0];
      const timer = setTimeout(() => {
        onAppSelect(targetApp);
        closeModal();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [
    filteredApps,
    searchQuery,
    settingState.autoLaunchSearch,
    isModalVisible,
    fromSettingsModal,
    onAppSelect,
    closeModal,
  ]);

  const handleClose = useCallback(() => {
    Keyboard.dismiss();
    Animated.timing(translateY, {
      toValue: height,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      closeModal();
    });
  }, [closeModal, translateY]);

  const modalPanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gesture) => {
          // Allow swipe down when at top of list, or in header/background
          return gesture.dy > 15 && scrollOffsetRef.current <= 5;
        },
        onPanResponderMove: (_, gesture) => {
          if (gesture.dy > 0) {
            translateY.setValue(gesture.dy);
          }
        },
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dy > 120 || gesture.vy > 0.5) {
            handleClose();
          } else {
            Animated.spring(translateY, {
              toValue: 0,
              damping: 20,
              stiffness: 250,
              useNativeDriver: true,
            }).start();
          }
        },
      }),
    [handleClose, translateY],
  );

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    scrollOffsetRef.current = offsetY;
    if (offsetY < -60) {
      handleClose();
    }
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

  return {
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
  };
};


