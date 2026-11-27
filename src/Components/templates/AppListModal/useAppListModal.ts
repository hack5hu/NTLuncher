import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  NativeModules,
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
  initialShowHidden: boolean = false,
) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showHiddenApps, setShowHiddenApps] = useState<boolean>(false);
  const translateY = useRef(new Animated.Value(height)).current;
  const {settingState} = useAppStore();
  const inputRef = useRef<any>(null);
  const scrollRef = useRef<any>(null);
  const scrollOffsetRef = useRef(0);
  const isClosingRef = useRef(false);
  const initialPinchDistRef = useRef<number | null>(null);
  const isUnlockingHiddenRef = useRef(false);

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
      if (initialShowHidden && !fromSettingsModal) {
        setShowHiddenApps(true);
      }
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
  }, [isModalVisible, initialShowHidden, fromSettingsModal, translateY, fetchInstalledApps]);

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

  const unlockHiddenApps = useCallback(async () => {
    if (isUnlockingHiddenRef.current || showHiddenApps || fromSettingsModal) {
      return;
    }
    isUnlockingHiddenRef.current = true;
    try {
      const authFn = NativeModules.AppList?.authenticateUser;
      const verified = authFn
        ? await authFn('Hidden Apps', 'Unlock to view hidden apps')
        : true;
      if (verified) {
        closeActions();
        setShowHiddenApps(true);
      }
    } catch {
      // Ignore canceled authentication
    } finally {
      isUnlockingHiddenRef.current = false;
    }
  }, [closeActions, fromSettingsModal, showHiddenApps]);

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

  // ─── List container PanResponder (2-finger spread + top swipe-down) ──────
  const getTouchDistance = (touches: ReadonlyArray<{pageX: number; pageY: number}>) => {
    const dx = touches[0].pageX - touches[1].pageX;
    const dy = touches[0].pageY - touches[1].pageY;
    return Math.hypot(dx, dy);
  };

  const listPanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: evt =>
          !fromSettingsModal &&
          !showHiddenApps &&
          evt.nativeEvent.touches.length === 2,
        onStartShouldSetPanResponderCapture: evt =>
          !fromSettingsModal &&
          !showHiddenApps &&
          evt.nativeEvent.touches.length === 2,
        onMoveShouldSetPanResponder: (evt, g) => {
          if (fromSettingsModal) return false;
          if (!showHiddenApps && evt.nativeEvent.touches.length === 2) {
            return true;
          }
          return (
            scrollOffsetRef.current <= 2 &&
            g.dy > 12 &&
            Math.abs(g.dy) > Math.abs(g.dx) * 1.2
          );
        },
        onMoveShouldSetPanResponderCapture: (evt, g) => {
          if (fromSettingsModal) return false;
          if (!showHiddenApps && evt.nativeEvent.touches.length === 2) {
            return true;
          }
          return (
            scrollOffsetRef.current <= 2 &&
            g.dy > 12 &&
            Math.abs(g.dy) > Math.abs(g.dx) * 1.2
          );
        },
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: evt => {
          if (evt.nativeEvent.touches.length === 2) {
            initialPinchDistRef.current = getTouchDistance(
              evt.nativeEvent.touches,
            );
          } else {
            initialPinchDistRef.current = null;
          }
        },
        onPanResponderMove: (evt, gesture) => {
          const touches = evt.nativeEvent.touches;
          if (!showHiddenApps && touches.length === 2) {
            const currentDist = getTouchDistance(touches);
            if (initialPinchDistRef.current === null) {
              initialPinchDistRef.current = currentDist;
            } else if (currentDist - initialPinchDistRef.current > 40) {
              initialPinchDistRef.current = null;
              unlockHiddenApps();
            }
            return;
          }
          if (gesture.dy > 0) translateY.setValue(gesture.dy);
        },
        onPanResponderRelease: (_, gesture) => {
          initialPinchDistRef.current = null;
          onSwipeRelease(_, gesture);
        },
        onPanResponderTerminate: () => {
          initialPinchDistRef.current = null;
        },
      }),
    [fromSettingsModal, onSwipeRelease, showHiddenApps, translateY, unlockHiddenApps],
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
    unlockHiddenApps,
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
