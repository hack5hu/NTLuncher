import {setApps, setHomeApp} from './StoreActions';
import {AppItemProps} from '../Type';

export interface AppState {
  apps: AppItemProps[];
  homeApps: AppItemProps[];
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
};

export const actions = (set: any) => ({
  setApps: (newApps: AppItemProps[]) =>
    set((state: AppState) => setApps(newApps)(state)),

  setHomeApp: (
    updatedApps:any, // ✅ Fix: Expect an array
  ) => set((state: AppState) => setHomeApp(updatedApps)(state)),
});
