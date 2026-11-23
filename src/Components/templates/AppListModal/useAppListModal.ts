import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Animated, Dimensions, NativeModules} from 'react-native';
import useAppStore from '../../../Store/AppStore';
import {AppItemProps} from '../../../Type';

const {AppList} = NativeModules;
const {height} = Dimensions.get('window');

export const useAppListModal = (
  isModalVisible: boolean,
  fromSettingsModal: boolean,
  onAppSelect: (item: AppItemProps) => void,
  closeModal: () => void,
) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [rename, setRename] = useState<string>('');
  const [isRenaming, setIsRenaming] = useState<boolean>(false);
  const [showHiddenApps, setShowHiddenApps] = useState<boolean>(false);
  const translateY = useRef(new Animated.Value(height)).current;
  const {apps, setApps, settingState, toggleHideApp} = useAppStore();
  const inputRef = useRef<any>(null);
  const scrollRef = useRef<any>(null);
  const [isUserDragging, setIsUserDragging] = useState(false);
  const currentOffsetYRef = useRef(0);

  useEffect(() => {
    fetchInstalledApps();
    Animated.timing(translateY, {
      toValue: isModalVisible ? 0 : height,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isModalVisible, translateY]);

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
  }, [isModalVisible, settingState.autoShowKeyboard]);

  const fetchInstalledApps = async () => {
    try {
      const installedApps = await AppList.getInstalledApps();
      const parsedApps: AppItemProps[] = JSON.parse(installedApps);

      const updatedApps: AppItemProps[] = parsedApps.map(newApp => {
        const existingApp = apps.find(
          (app: AppItemProps) =>
            app.packageName === newApp.packageName &&
            app.isWorkApp === newApp.isWorkApp,
        );

        return {
          ...newApp,
          customLabel: existingApp?.customLabel || '',
          isRenamed: existingApp?.isRenamed || false,
          isHidden: existingApp?.isHidden || false,
        };
      });

      setApps(updatedApps);
    } catch (error) {
      console.error('Error fetching apps:', error);
    }
  };

  const filteredApps = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return apps.filter((app: AppItemProps) => {
      if (!showHiddenApps && app.isHidden) return false;
      if (showHiddenApps && !app.isHidden) return false;
      if (!query) return true;
      const appName = (app.customLabel || app.label).toLowerCase();
      return appName.includes(query);
    });
  }, [apps, searchQuery, showHiddenApps]);

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

  const handleRename = useCallback(
    (item: AppItemProps) => {
      const updatedApps = apps.map(app =>
        app.packageName === item.packageName && app.isWorkApp === item.isWorkApp
          ? {...app, customLabel: rename, isRenamed: true}
          : app,
      );
      setApps(updatedApps);
      setSelectedIndex(null);
      setRename('');
      setIsRenaming(false);
    },
    [apps, rename, setApps],
  );

  const handleInfo = useCallback((item: AppItemProps) => {
    AppList.openAppSettings(item.packageName);
    setSelectedIndex(null);
  }, []);

  const handleDelete = useCallback(async (item: AppItemProps) => {
    await AppList.uninstallApp(item.packageName);
    setSelectedIndex(null);
  }, []);

  const handleToggleHide = useCallback(
    (item: AppItemProps) => {
      toggleHideApp(item.packageName);
      setSelectedIndex(null);
    },
    [toggleHideApp],
  );

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
    setIsUserDragging,
  };
};

