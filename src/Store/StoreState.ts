import {setApps, setHomeApp, setSettingState} from './StoreActions';
import {AppItemProps} from '../Type';
import { DEFAULT_SETTINGS, SettingKey } from '../Constants/ConstantVar';

export interface AppState {
  apps: AppItemProps[];
  homeApps: AppItemProps[];
  settingState: Record<SettingKey, boolean | number | string>;
  isAppListVisible: boolean;
}

export const initialState: AppState = {
  apps: [],
  homeApps: [
    {label: 'select App', packageName: '', index: 234543},
    {label: 'select App', packageName: '', index: 14543},
    {label: 'select App', packageName: '', index: 254345},
    {label: 'select App', packageName: '', index: 365432345},
    {label: 'select App', packageName: '', index: 4654345},
    {label: 'select App', packageName: '', index: 2543453443},
    {label: 'select App', packageName: '', index: 36543234345435},
    {label: 'select App', packageName: '', index: 465434534543},
  ],
  isAppListVisible: false,
  settingState: {...DEFAULT_SETTINGS},
};

export const actions = (set: any) => ({
  setApps: (newApps: AppItemProps[]) =>
    set((state: AppState) => setApps(newApps)(state)),

  setHomeApp: (updatedApps: AppItemProps[]) =>
    set((state: AppState) => setHomeApp(updatedApps)(state)),
  setAppListVisible: (visible: boolean) =>{
    console.log('Action: Setting isAppListVisible to', visible);
    set((state: AppState) => ({...state, isAppListVisible: visible}))},
  setSettingState: (
    updatedSettings: Partial<Record<SettingKey, boolean | number | string>>,
  ) => set((state: AppState) => setSettingState(updatedSettings)(state)),
  
});
