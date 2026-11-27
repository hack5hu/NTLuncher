import {useCallback, useState} from 'react';
import {NativeModules} from 'react-native';
import useAppStore from '../../../Store/AppStore';
import {AppItemProps} from '../../../Type';

const {AppList} = NativeModules;

export const useAppActions = () => {
  const {apps, setApps, toggleHideApp} = useAppStore();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [rename, setRename] = useState<string>('');
  const [isRenaming, setIsRenaming] = useState<boolean>(false);

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

  const renameCallFn = (item: AppItemProps) => {
    setIsRenaming(true);
    setRename(item.customLabel || item.label);
  };

  return {
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
  };
};
