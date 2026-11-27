import {useCallback, useState} from 'react';
import {NativeModules} from 'react-native';
import useAppStore from '../../../Store/AppStore';
import {AppItemProps} from '../../../Type';
import {getAppKey} from './useAppQuery';

const {AppList} = NativeModules;

export const useAppActions = () => {
  const {apps, homeApps, setApps, setHomeApp, toggleHideApp} = useAppStore();
  const [selectedAppKey, setSelectedAppKey] = useState<string | null>(null);
  const [rename, setRename] = useState<string>('');
  const [isRenaming, setIsRenaming] = useState<boolean>(false);

  const handleRename = useCallback(
    (item: AppItemProps) => {
      if (!item?.packageName) return;
      const trimmed = rename.trim();
      const shouldReset = trimmed.length === 0;

      const updatedApps = (apps || []).map((app: AppItemProps) =>
        app.packageName === item.packageName &&
        Boolean(app.isWorkApp) === Boolean(item.isWorkApp)
          ? {
              ...app,
              customLabel: shouldReset ? '' : trimmed,
              isRenamed: !shouldReset,
            }
          : app,
      );
      setApps(updatedApps);

      if (Array.isArray(homeApps)) {
        const updatedHomeApps = homeApps.map((homeApp: AppItemProps) =>
          homeApp.packageName === item.packageName &&
          Boolean(homeApp.isWorkApp) === Boolean(item.isWorkApp)
            ? {
                ...homeApp,
                customLabel: shouldReset ? '' : trimmed,
                isRenamed: !shouldReset,
              }
            : homeApp,
        );
        setHomeApp(updatedHomeApps);
      }

      setSelectedAppKey(null);
      setRename('');
      setIsRenaming(false);
    },
    [apps, homeApps, rename, setApps, setHomeApp],
  );

  const handleInfo = useCallback((item: AppItemProps) => {
    if (!item?.packageName) return;
    try {
      AppList.openAppSettings(item.packageName);
    } catch (error) {
      console.error('Error opening app settings:', error);
    } finally {
      setSelectedAppKey(null);
    }
  }, []);

  const handleDelete = useCallback(async (item: AppItemProps) => {
    if (!item?.packageName) return;
    try {
      await AppList.uninstallApp(item.packageName);
    } catch (error) {
      console.error('Error uninstalling app:', error);
    } finally {
      setSelectedAppKey(null);
    }
  }, []);

  const handleToggleHide = useCallback(
    (item: AppItemProps) => {
      if (!item?.packageName) return;
      toggleHideApp(item.packageName);
      setSelectedAppKey(null);
      setIsRenaming(false);
      setRename('');
    },
    [toggleHideApp],
  );

  const renameCallFn = useCallback((item: AppItemProps) => {
    setIsRenaming(true);
    setRename(item.customLabel || item.label || '');
  }, []);

  const selectAppActions = useCallback((item: AppItemProps) => {
    setIsRenaming(false);
    setRename('');
    setSelectedAppKey(getAppKey(item));
  }, []);

  const closeActions = useCallback(() => {
    setRename('');
    setIsRenaming(false);
    setSelectedAppKey(null);
  }, []);

  return {
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
  };
};
