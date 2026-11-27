import {useCallback, useMemo} from 'react';
import {NativeModules} from 'react-native';
import useAppStore from '../../../Store/AppStore';
import {AppItemProps} from '../../../Type';

const {AppList} = NativeModules;

export const useAppQuery = (searchQuery: string, showHiddenApps: boolean) => {
  const {apps, setApps} = useAppStore();

  const fetchInstalledApps = useCallback(async () => {
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
  }, [apps, setApps]);

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

  return {filteredApps, fetchInstalledApps};
};
