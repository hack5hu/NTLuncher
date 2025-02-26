import {AppItemProps} from '../Type';

export interface AppState {
  apps: AppItemProps[]; // Ensure this matches the actual structure
  selectedApp: AppItemProps | null; // Use correct type
}

export const setApps = (newApps: AppItemProps[]) => (state: AppState) => ({
  ...state,
  apps: newApps,
});

export const setHomeApp =
  (app: AppItemProps | null) => (state: AppState) => ({
    ...state,
    homeApps: app,
  });
