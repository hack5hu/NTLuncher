import {NativeModules} from 'react-native';

jest.mock('react-native-worklets', () =>
  require('react-native-worklets/lib/module/mock'),
);

jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

NativeModules.AppList = {
  getInstalledApps: jest.fn().mockResolvedValue('[]'),
  launchApp: jest.fn(),
  openAppSettings: jest.fn(),
  uninstallApp: jest.fn(),
  expandNotifications: jest.fn(),
  openDefaultLauncherSettings: jest.fn(),
  getScreenTime: jest.fn().mockResolvedValue(
    JSON.stringify({
      hasPermission: true,
      totalTimeInForeground: 3600000,
      formattedTime: '1h 0m',
    }),
  ),
  openDigitalWellbeingOrUsageSettings: jest.fn(),
  setWallpaper: jest.fn().mockResolvedValue(true),
  getIconPacks: jest.fn().mockResolvedValue('[]'),
};
