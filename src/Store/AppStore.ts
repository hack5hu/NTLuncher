import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {initialState, actions, AppState} from './StoreState';

const useAppStore = create<any>()(
  persist(
    (set, _get) => ({
      ...initialState,
      ...actions(set),
    }),
    {
      name: 'app-storage',
      version: 2,
      storage: createJSONStorage(() => AsyncStorage),
      migrate: (persistedState: unknown, version: number) => {
        const state = (persistedState || {}) as Partial<AppState>;
        if (version < 2 && state.settingState) {
          return {
            ...state,
            settingState: {
              ...initialState.settingState,
              ...state.settingState,
              dailyNewWallpaper: true,
            },
          };
        }
        return state;
      },
      partialize: (state: AppState) => ({
        apps: state.apps,
        homeApps: state.homeApps,
        settingState: state.settingState,
      }),
    },
  ),
);

export default useAppStore;
