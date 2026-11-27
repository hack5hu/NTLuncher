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
  const isClosingRef = useRef(false);

  const {
    selectedAppKey,
    setSelectedAppKey,
    selectAppActions,
    closeActions,
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

  const lastFetchTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isModalVisible) {
      isClosingRef.current = false;
      const now = Date.now();
      const hasCachedApps = (useAppStore.getState().apps || []).length > 0;
      if (!hasCachedApps || now - lastFetchTimeRef.current > 30000) {
        lastFetchTimeRef.current = now;
        fetchInstalledApps();
      }
      translateY.setValue(height);
      Animated.spring(translateY, {
        toValue: 0,
        damping: 26,
        stiffness: 380,
        mass: 0.7,
        useNativeDriver: true,
      }).start();
    }
  }, [isModalVisible, translateY, fetchInstalledApps]);

  useEffect(() => {
    if (isModalVisible && settingState.autoShowKeyboard && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 400);
    }
    if (!isModalVisible) {
      setSearchQuery('');
      closeActions();
      setShowHiddenApps(false);
    }
  }, [isModalVisible, settingState.autoShowKeyboard, closeActions]);

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
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    Keyboard.dismiss();
    Animated.timing(translateY, {
      toValue: height,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      closeModal();
    });
  }, [closeModal, translateY]);

  const toggleHiddenView = useCallback(() => {
    closeActions();
    setShowHiddenApps(prev => !prev);
  }, [closeActions]);

  // ─── Blur search input when tapping outside ───────────────────────────────
  const blurInput = useCallback(() => {
    inputRef.current?.blur();
    Keyboard.dismiss();
  }, []);

  // ─── Shared release handler (requires a big swipe down to close) ──────────
  const onSwipeRelease = useCallback(
    (_: unknown, gesture: {dy: number; vy: number}) => {
      if (gesture.dy > 130 || gesture.vy > 0.65) {
        handleClose();
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          damping: 24,
          stiffness: 350,
          useNativeDriver: true,
        }).start();
      }
    },
    [handleClose, translateY],
  );

  // ─── Drag handle (strip ABOVE the input — always wins) ───────────────────
  const dragHandlePanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !fromSettingsModal,
        onMoveShouldSetPanResponder: () => !fromSettingsModal,
        onStartShouldSetPanResponderCapture: () => !fromSettingsModal,
        onMoveShouldSetPanResponderCapture: () => !fromSettingsModal,
        onPanResponderTerminationRequest: () => false,
        onPanResponderMove: (_, gesture) => {
          if (gesture.dy > 0) translateY.setValue(gesture.dy);
        },
        onPanResponderRelease: onSwipeRelease,
      }),
    [fromSettingsModal, onSwipeRelease, translateY],
  );

  // ─── List container PanResponder ─────────────────────────────────────────
  const listPanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onStartShouldSetPanResponderCapture: () => false,
        onMoveShouldSetPanResponder: (_, g) =>
          !fromSettingsModal &&
          scrollOffsetRef.current <= 2 &&
          g.dy > 12 &&
          Math.abs(g.dy) > Math.abs(g.dx) * 1.2,
        onMoveShouldSetPanResponderCapture: (_, g) =>
          !fromSettingsModal &&
          scrollOffsetRef.current <= 2 &&
          g.dy > 12 &&
          Math.abs(g.dy) > Math.abs(g.dx) * 1.2,
        onPanResponderTerminationRequest: () => false,
        onPanResponderMove: (_, gesture) => {
          if (gesture.dy > 0) translateY.setValue(gesture.dy);
        },
        onPanResponderRelease: onSwipeRelease,
      }),
    [fromSettingsModal, onSwipeRelease, translateY],
  );

  const handleScroll = useCallback(
    (event: {nativeEvent: {contentOffset: {y: number}}}) => {
      scrollOffsetRef.current = event.nativeEvent.contentOffset.y;
    },
    [],
  );

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
    selectedAppKey,
    setSelectedAppKey,
    selectAppActions,
    closeActions,
    rename,
    setRename,
    isRenaming,
    setIsRenaming,
    showHiddenApps,
    setShowHiddenApps,
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
  };
};
