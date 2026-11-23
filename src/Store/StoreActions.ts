import { SettingKey } from '../Constants/ConstantVar';
import {AppItemProps} from '../Type';
import {AppState} from './StoreState';

export const setApps = (newApps: AppItemProps[]) => (state: AppState) => ({
  ...state,
  apps: newApps,
});

export const setHomeApp =
  (updatedApps: AppItemProps[]) => (state: AppState) => ({
    ...state,
    homeApps: updatedApps,
  });
  export const setSettingState =
    (updatedSettings: Partial<Record<SettingKey, boolean | number | string>>) =>
    (state: AppState): AppState => ({
      ...state,
      settingState: {
        ...state.settingState,
        ...updatedSettings,
      },
    });

  export const setAppListVisible = (visible: boolean) => (state: AppState) => ({
    ...state,
    isAppListVisible: visible,
  });
