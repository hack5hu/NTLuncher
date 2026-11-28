import {useCallback, useMemo} from 'react';
import {NativeModules} from 'react-native';
import useAppStore from '../../../Store/AppStore';
import {AppItemProps} from '../../../Type';

const {AppList} = NativeModules;

export const getAppKey = (item: AppItemProps): string =>
  `${item.packageName}::${Boolean(item.isWorkApp)}`;

export const useAppQuery = (searchQuery: string, showHiddenApps: boolean) => {
  const {apps, setApps} = useAppStore();

  const fetchInstalledApps = useCallback(async () => {
    try {
      const installedApps = await AppList.getInstalledApps();
      let parsedApps: AppItemProps[] = [];
      if (Array.isArray(installedApps)) {
        parsedApps = installedApps;
      } else if (typeof installedApps === 'string' && installedApps.trim()) {
        parsedApps = JSON.parse(installedApps);
      }

      if (!Array.isArray(parsedApps)) return;

      const currentApps: AppItemProps[] = useAppStore.getState().apps || [];

      const updatedApps: AppItemProps[] = parsedApps.map(newApp => {
        const existingApp = currentApps.find(
          (app: AppItemProps) =>
            app.packageName === newApp.packageName &&
            Boolean(app.isWorkApp) === Boolean(newApp.isWorkApp),
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
  }, [setApps]);

  const filteredApps = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return (apps || [])
      .filter((app: AppItemProps) => {
        if (!showHiddenApps && app.isHidden) return false;
        if (showHiddenApps && !app.isHidden) return false;
        if (!query) return true;
        const appName = (app.customLabel || app.label || '').toLowerCase();
        return appName.includes(query);
      })
      .sort((a: AppItemProps, b: AppItemProps) =>
        (a.customLabel || a.label || '')
          .toLowerCase()
          .localeCompare((b.customLabel || b.label || '').toLowerCase()),
      );
  }, [apps, searchQuery, showHiddenApps]);

  return {filteredApps, fetchInstalledApps};
};
