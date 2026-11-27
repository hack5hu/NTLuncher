import {NativeModules} from 'react-native';
import {SettingKey, ThemeMode} from '../../../Constants/ConstantVar';
import useAppStore from '../../../Store/AppStore';
import {
  fetchRandomDailyWallpaper,
  getTodayDateKey,
  updateSystemWallpaper,
} from '../../../helper/wallpaperHelper';

export interface SettingOption {
  title: string;
  subtitle?: string;
  key: SettingKey;
  type: 'toggle' | 'text' | 'number' | 'picker' | 'selector' | 'action';
  actionLabel?: string;
  onPressAction?: () => void | Promise<void>;
}

export interface SettingsSection {
  title: string;
  options: SettingOption[];
}

const refreshWallpaperNow = async () => {
  const {settingState, setSettingState} = useAppStore.getState();
  const isDark =
    settingState.themeMode === ThemeMode.DARK ||
    settingState.themeMode === ThemeMode.AMOLED;
  const url = await fetchRandomDailyWallpaper(
    isDark,
    String(settingState.wallpaperUrl || ''),
  );
  if (!url) {
    throw new Error('Unable to fetch wallpaper');
  }
  setSettingState({
    wallpaperUrl: url,
    dailyNewWallpaper: true,
    lastWallpaperDate: getTodayDateKey(),
    lastWallpaperTheme: isDark ? 'dark' : 'light',
  });
  updateSystemWallpaper(url);
};

export const getSettingsSections = (): SettingsSection[] => [
  {
    title: 'Launcher',
    options: [
      {
        title: 'Set as default launcher',
        subtitle: 'Choose this app as your default Home app.',
        key: SettingKey.IS_DEFAULT_LAUNCHER,
        type: 'toggle',
        onPressAction: () =>
          NativeModules.AppList?.openDefaultLauncherSettings?.(),
      },
      {
        title: 'Lock portrait',
        subtitle: 'Keep the home screen locked in portrait orientation.',
        key: SettingKey.LOCK_PORTRAIT,
        type: 'toggle',
      },
    ],
  },
  {
    title: 'Home Screen',
    options: [
      {
        title: 'Apps on home screen',
        key: SettingKey.APPS_ON_HOME_SCREEN,
        type: 'picker',
      },
      {
        title: 'App alignment (H)',
        key: SettingKey.APP_ALIGNMENT_HORIZONTAL,
        type: 'picker',
      },
      {
        title: 'App alignment (V)',
        key: SettingKey.APP_ALIGNMENT_VERTICAL,
        type: 'picker',
      },
      {
        title: 'Lock home apps',
        subtitle: 'Prevent accidental app replacement on long press.',
        key: SettingKey.LOCK_HOME_APPS,
        type: 'toggle',
      },
    ],
  },
  {
    title: 'Clock & Wellbeing',
    options: [
      {
        title: 'Show date time',
        key: SettingKey.SHOW_DATE_TIME,
        type: 'toggle',
      },
      {
        title: '24-hour clock',
        key: SettingKey.CLOCK_24_HOUR,
        type: 'toggle',
      },
      {
        title: 'Screen time',
        subtitle:
          'Requires Usage Access permission. Enable it in Settings to view daily screen time.',
        key: SettingKey.SCREEN_TIME,
        type: 'toggle',
        onPressAction: async () => {
          try {
            const res = await NativeModules.AppList?.getScreenTime?.();
            const parsed = res ? JSON.parse(res) : null;
            if (!parsed?.hasPermission) {
              NativeModules.AppList?.openDigitalWellbeingOrUsageSettings?.();
            }
          } catch {
            NativeModules.AppList?.openDigitalWellbeingOrUsageSettings?.();
          }
        },
      },
    ],
  },
  {
    title: 'App Drawer & Search',
    options: [
      {
        title: 'Auto show keyboard',
        key: SettingKey.AUTO_SHOW_KEYBOARD,
        type: 'toggle',
      },
      {
        title: 'Auto launch on search',
        key: SettingKey.AUTO_LAUNCH_SEARCH,
        type: 'toggle',
      },
      {
        title: 'Drawer alignment (H)',
        key: SettingKey.MODAL_ALIGNMENT_HORIZONTAL,
        type: 'picker',
      },
      {title: 'Text size', key: SettingKey.TEXT_SIZE, type: 'picker'},
      {
        title: 'Icon Pack',
        subtitle: 'Select an installed icon pack (text-only mode stays active by default).',
        key: SettingKey.ICON_PACK,
        type: 'picker',
      },
    ],
  },
  {
    title: 'Wallpaper & Theme',
    options: [
      {title: 'Theme mode', key: SettingKey.THEME_MODE, type: 'picker'},
      {
        title: 'Daily new wallpaper',
        key: SettingKey.DAILY_NEW_WALLPAPER,
        type: 'toggle',
      },
      {
        title: 'Dim wallpaper',
        key: SettingKey.DIM_WALLPAPER,
        type: 'toggle',
      },
      {
        title: 'Change wallpaper now',
        key: SettingKey.WALLPAPER_URL,
        type: 'action',
        actionLabel: 'Refresh',
        onPressAction: refreshWallpaperNow,
      },
      {
        title: 'Status bar on top',
        key: SettingKey.STATUS_BAR_ON_TOP,
        type: 'toggle',
      },
    ],
  },
  {
    title: 'Gestures',
    options: [
      {
        title: 'Double tap to lock',
        subtitle:
          'Requires Accessibility permission. Enable this app under Accessibility settings to lock the screen.',
        key: SettingKey.DOUBLE_TAP_TO_LOCK,
        type: 'toggle',
        onPressAction: () => NativeModules.AppList?.lockScreen?.(),
      },
      {
        title: 'Swipe up',
        key: SettingKey.SWIPE_UP,
        type: 'selector',
      },
      {
        title: 'Swipe down',
        key: SettingKey.SWIPE_DOWN,
        type: 'selector',
      },
      {
        title: 'Swipe left',
        key: SettingKey.SWIPE_LEFT,
        type: 'selector',
      },
      {
        title: 'Swipe right',
        key: SettingKey.SWIPE_RIGHT,
        type: 'selector',
      },
    ],
  },
];
