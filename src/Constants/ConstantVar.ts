// constants/settings.constants.ts

// Text size range constants
export const TEXT_SIZE_RANGE = {
  MIN: 10,
  MAX: 28,
  VALUES: Array.from({length: 19}, (_, i) => i + 10),
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
  SCREEN_TIME = 'screenTime',
  AUTO_SHOW_KEYBOARD = 'autoShowKeyboard',
  DAILY_NEW_WALLPAPER = 'dailyNewWallpaper',
  STATUS_BAR_ON_TOP = 'statusBarOnTop',
  THEME_MODE = 'themeMode',
  TEXT_SIZE = 'textSize',
}

// Type-safe map of all default settings
export const DEFAULT_SETTINGS: Record<SettingKey, boolean | number | string> = {
  [SettingKey.IS_DEFAULT_LAUNCHER]: false,
  [SettingKey.APPS_ON_HOME_SCREEN]: 8,
  [SettingKey.SHOW_DATE_TIME]: true,
  [SettingKey.APP_ALIGNMENT_HORIZONTAL]: AppAlignmentHorizontal.RIGHT,
  [SettingKey.APP_ALIGNMENT_VERTICAL]: AppAlignmentVertical.CENTER,
  [SettingKey.SCREEN_TIME]: false,
  [SettingKey.AUTO_SHOW_KEYBOARD]: true,
  [SettingKey.DAILY_NEW_WALLPAPER]: false,
  [SettingKey.STATUS_BAR_ON_TOP]: true,
  [SettingKey.THEME_MODE]: ThemeMode.LIGHT,
  [SettingKey.TEXT_SIZE]: 16,
};
