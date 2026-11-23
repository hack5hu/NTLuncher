import {useState, useEffect, useCallback} from 'react';
import {NativeModules} from 'react-native';
import useAppStore from '../../../Store/AppStore';
import {
  SettingKey,
  TEXT_SIZE_RANGE,
  APPS_ON_HOME_RANGE,
  ThemeMode,
  AppAlignmentHorizontal,
  AppAlignmentVertical,
} from '../../../Constants/ConstantVar';
import {AppItemProps} from '../../../Type';

export const useSettings = (
  visible: boolean,
  onAppSelect: (item: any) => void,
  setIsLauncherAppModalVisible: (visible: boolean) => void,
) => {
  const {settingState, setSettingState, setAppListVisible} = useAppStore();
  const [activePickerKey, setActivePickerKey] = useState<SettingKey | null>(null);
  const [isAppModalVisible, setIsAppModalVisible] = useState(false);
  const [iconPacks, setIconPacks] = useState<string[]>(['Default']);

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const packsJson = await NativeModules.AppList.getIconPacks();
        const packs = JSON.parse(packsJson);
        setIconPacks(['Default', ...packs.map((p: any) => p.label)]);
      } catch (e) {
        console.log('Error fetching icon packs', e);
      }
    };
    if (visible) fetchPacks();
  }, [visible]);

  const getPickerValues = useCallback(
    (key: SettingKey): (string | number)[] => {
      switch (key) {
        case SettingKey.APPS_ON_HOME_SCREEN:
          return APPS_ON_HOME_RANGE.VALUES;
        case SettingKey.TEXT_SIZE:
          return TEXT_SIZE_RANGE.VALUES;
        case SettingKey.THEME_MODE:
          return Object.values(ThemeMode);
        case SettingKey.APP_ALIGNMENT_HORIZONTAL:
          return Object.values(AppAlignmentHorizontal);
        case SettingKey.APP_ALIGNMENT_VERTICAL:
          return Object.values(AppAlignmentVertical);
        case SettingKey.ICON_PACK:
          return iconPacks;
        default:
          return [];
      }
    },
    [iconPacks],
  );

  const handleChange = useCallback(
    (key: SettingKey, value: boolean | string | number) => {
      setSettingState({[key]: value});
      setActivePickerKey(null);
    },
    [setSettingState],
  );

  const selectSideApps = useCallback(
    (item: AppItemProps) => {
      setIsAppModalVisible(false);
      setIsLauncherAppModalVisible(true);
      if (activePickerKey) {
        setSettingState({[activePickerKey]: item.packageName});
      }
      onAppSelect(item);
    },
    [activePickerKey, onAppSelect, setIsLauncherAppModalVisible, setSettingState],
  );

  return {
    settingState,
    setSettingState,
    activePickerKey,
    setActivePickerKey,
    isAppModalVisible,
    setIsAppModalVisible,
    setAppListVisible,
    getPickerValues,
    handleChange,
    selectSideApps,
  };
};

