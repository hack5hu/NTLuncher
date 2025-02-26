import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {initialState, actions} from './StoreState';

const useAppStore = create<any>()(
  persist(
    (set, get) => ({
      ...initialState,
      ...actions(set),
    }),
    {
      name: 'app-storage', // ✅ Name for storage
      storage: createJSONStorage(() => AsyncStorage), // ✅ Uses AsyncStorage for persistence
    },
  ),
);

export default useAppStore;
