import {useMemo} from 'react';
import useAppStore from '../Store/AppStore';
import {getThemeColors, LauncherColorPalette} from './colors';

export const useThemeColors = (): LauncherColorPalette => {
  const themeMode = useAppStore(state => state.settingState?.themeMode);
  return useMemo(() => getThemeColors(themeMode), [themeMode]);
};
