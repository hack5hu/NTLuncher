import {SettingKey} from '../../../Constants/ConstantVar';
import {NativeModules} from 'react-native';

export interface SettingOption {
  title: string;
  key: SettingKey;
  type: 'toggle' | 'text' | 'number' | 'picker' | 'selector';
  onPressAction?: () => void;
}

export interface SettingsSection {
  title: string;
  options: SettingOption[];
}

export const getSettingsSections = (): SettingsSection[] => [
  {
    title: 'Launcher',
    options: [
      {
        title: 'Set as default launcher',
        key: SettingKey.IS_DEFAULT_LAUNCHER,
        type: 'toggle',
        onPressAction: () => NativeModules.AppList.openDefaultLauncherSettings(),
      },
    ],
  },
  {
    title: 'Home screen',
    options: [
      {
        title: 'Apps on home screen',
        key: SettingKey.APPS_ON_HOME_SCREEN,
        type: 'picker',
      },
      {
        title: 'Show date time',
        key: SettingKey.SHOW_DATE_TIME,
        type: 'toggle',
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
      {title: 'Screen time', key: SettingKey.SCREEN_TIME, type: 'toggle'},
    ],
  },
  {
    title: 'Appearance',
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
        title: 'Daily new wallpaper',
        key: SettingKey.DAILY_NEW_WALLPAPER,
        type: 'toggle',
      },
      {
        title: 'Status bar on top',
        key: SettingKey.STATUS_BAR_ON_TOP,
        type: 'toggle',
      },
      {title: 'Theme mode', key: SettingKey.THEME_MODE, type: 'picker'},
      {title: 'Text size', key: SettingKey.TEXT_SIZE, type: 'picker'},
    ],
  },
  {
    title: 'Gestures',
    options: [
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
  {
    title: 'Personalization',
    options: [
      {
        title: 'Icon Pack',
        key: SettingKey.ICON_PACK,
        type: 'picker',
      },
    ],
  },
];

