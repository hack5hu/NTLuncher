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
