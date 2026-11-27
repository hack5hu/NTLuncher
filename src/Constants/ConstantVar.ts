// constants/settings.constants.ts

// Text size range constants
export const TEXT_SIZE_RANGE = {
  MIN: 12,
  MAX: 24,
  VALUES: Array.from({length: 11}, (_, i) => i + 12),
} as const;

// Apps on home screen range constants
export const APPS_ON_HOME_RANGE = {
  MIN: 1,
  MAX: 8,
  VALUES: Array.from({length: 8}, (_, i) => i + 1),
} as const;

// Enum for Yes/No boolean settings
export enum ToggleOption {
  YES = 'Yes',
  NO = 'No',
}

// Enum for theme mode
export enum ThemeMode {
  LIGHT = 'Light',
  DARK = 'Dark',
  AMOLED = 'Amoled',
}

// Enum for horizontal app alignment
export enum AppAlignmentHorizontal {
  LEFT = 'Left',
  CENTER = 'Center',
  RIGHT = 'Right',
}

// Enum for vertical app alignment
export enum AppAlignmentVertical {
  TOP = 'Top',
  CENTER = 'Center',
  BOTTOM = 'Bottom',
}

// Setting keys to maintain single source of truth
export enum SettingKey {
  IS_DEFAULT_LAUNCHER = 'isDefaultLauncher',
  APPS_ON_HOME_SCREEN = 'appsOnHomeScreen',
  SHOW_DATE_TIME = 'showDateTime',
  APP_ALIGNMENT_HORIZONTAL = 'appAlignmentHorizontal',
  APP_ALIGNMENT_VERTICAL = 'appAlignmentVertical',
  MODAL_ALIGNMENT_HORIZONTAL = 'modalAlignmentHorizontal',
  SCREEN_TIME = 'screenTime',
  AUTO_SHOW_KEYBOARD = 'autoShowKeyboard',
  AUTO_LAUNCH_SEARCH = 'autoLaunchSearch',
  DAILY_NEW_WALLPAPER = 'dailyNewWallpaper',
  STATUS_BAR_ON_TOP = 'statusBarOnTop',
  THEME_MODE = 'themeMode',
  TEXT_SIZE = 'textSize',
  SWIPE_UP = 'swipeUp',
  SWIPE_DOWN = 'swipeDown',
  SWIPE_LEFT = 'swipeLeft',
  SWIPE_RIGHT = 'swipeRight',
  ICON_PACK = 'iconPack',
  WALLPAPER_URL = 'wallpaperUrl',
  LAST_WALLPAPER_DATE = 'lastWallpaperDate',
  LAST_WALLPAPER_THEME = 'lastWallpaperTheme',
  CLOCK_24_HOUR = 'clock24Hour',
  LOCK_HOME_APPS = 'lockHomeApps',
  DOUBLE_TAP_TO_LOCK = 'doubleTapToLock',
  LOCK_PORTRAIT = 'lockPortrait',
  DIM_WALLPAPER = 'dimWallpaper',
}

// Type-safe map of all default settings
export const DEFAULT_SETTINGS: Record<SettingKey, boolean | number | string> = {
  [SettingKey.IS_DEFAULT_LAUNCHER]: false,
  [SettingKey.APPS_ON_HOME_SCREEN]: 8,
  [SettingKey.SHOW_DATE_TIME]: true,
  [SettingKey.APP_ALIGNMENT_HORIZONTAL]: AppAlignmentHorizontal.RIGHT,
  [SettingKey.APP_ALIGNMENT_VERTICAL]: AppAlignmentVertical.CENTER,
  [SettingKey.MODAL_ALIGNMENT_HORIZONTAL]: AppAlignmentHorizontal.LEFT,
  [SettingKey.SCREEN_TIME]: false,
  [SettingKey.AUTO_SHOW_KEYBOARD]: true,
  [SettingKey.AUTO_LAUNCH_SEARCH]: true,
  [SettingKey.DAILY_NEW_WALLPAPER]: true,
  [SettingKey.STATUS_BAR_ON_TOP]: true,
  [SettingKey.THEME_MODE]: ThemeMode.LIGHT,
  [SettingKey.TEXT_SIZE]: 16,
  [SettingKey.SWIPE_UP]: 'AppDrawer',
  [SettingKey.SWIPE_DOWN]: 'Notifications',
  [SettingKey.SWIPE_LEFT]: 'com.android.settings',
  [SettingKey.SWIPE_RIGHT]: 'com.android.vending',
  [SettingKey.ICON_PACK]: 'Default',
  [SettingKey.WALLPAPER_URL]: '',
  [SettingKey.LAST_WALLPAPER_DATE]: '',
  [SettingKey.LAST_WALLPAPER_THEME]: '',
  [SettingKey.CLOCK_24_HOUR]: true,
  [SettingKey.LOCK_HOME_APPS]: false,
  [SettingKey.DOUBLE_TAP_TO_LOCK]: false,
  [SettingKey.LOCK_PORTRAIT]: true,
  [SettingKey.DIM_WALLPAPER]: true,
};
