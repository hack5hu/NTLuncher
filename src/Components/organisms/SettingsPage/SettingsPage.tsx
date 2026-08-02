import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  Switch,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  NativeModules,
} from 'react-native';
import {styles} from './Styles';
import {
  TEXT_SIZE_RANGE,
  APPS_ON_HOME_RANGE,
  ThemeMode,
  AppAlignmentHorizontal,
  AppAlignmentVertical,
  SettingKey,
} from '../../../Constants/ConstantVar';
import useAppStore from '../../../Store/AppStore';
import AppListModal from '../../templates/AppListModal/AppListModal';
import {AppItemProps} from '../../../Type';

interface SettingOption {
  title: string;
  key: SettingKey;
  type: 'toggle' | 'text' | 'number' | 'picker' | 'selector';
}

interface SettingsSection {
  title: string;
  options: SettingOption[];
}

interface SettingsModalProps {
  visible: boolean;
  closeSettingsModal: () => void;
  onAppSelect: (item: any) => void;
  closeModal: () => void;
  setSettingsModalVisible: (visible: boolean) => void;
  setIsLauncherAppModalVisible: (visible: boolean) => void;
}

// 🔹 Utility function for values
const getPickerValues = (key: SettingKey): (string | number)[] => {
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
};

// 🔹 Individual option renderers (SRP)
const ToggleOption = ({title, value, onChange}: any) => (
  <>
    <Text style={styles.optionTitle}>{title}</Text>
    <Switch value={value} onValueChange={onChange} />
  </>
);

const PickerOption = ({title, value, onPress}: any) => (
  <TouchableOpacity style={styles.pickerTriggerRow} onPress={onPress}>
    <Text style={styles.optionTitle}>{title}</Text>
    <Text style={styles.optionValue}>{String(value)}</Text>
  </TouchableOpacity>
);

const SelectorOption = ({title, value, onPress}: any) => (
  <TouchableOpacity style={styles.pickerTriggerRow} onPress={onPress}>
    <Text style={styles.optionTitle}>{title}</Text>
    <Text style={styles.optionValue}>
      {value ? String(value) : 'Select an App'}
    </Text>
  </TouchableOpacity>
);

const PickerList = ({keyName, onChange}: any) => (
  <FlatList
    horizontal
    data={getPickerValues(keyName)}
    keyExtractor={(item, index) => `${keyName}-${index}`}
    contentContainerStyle={styles.pickerListContainer}
    renderItem={({item}) => (
      <TouchableOpacity
        style={styles.pickerOption}
        onPress={() => onChange(item)}>
        <Text
          style={[
            styles.optionValue,
            keyName === SettingKey.TEXT_SIZE && {fontSize: Number(item)},
          ]}>
          {keyName === SettingKey.TEXT_SIZE ? 'Text' : item}
        </Text>
      </TouchableOpacity>
    )}
  />
);

const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  closeSettingsModal,
  onAppSelect,
  closeModal,
  setIsLauncherAppModalVisible,
}) => {
  const {settingState, setSettingState, isAppListVisible, setAppListVisible} =
    useAppStore();
  const [activePickerKey, setActivePickerKey] = useState<SettingKey | null>(
    null,
  );
  const [isAppModalVisible, setIsAppModalVisible] = useState(false);
  const [iconPacks, setIconPacks] = useState<string[]>(['Default']);

  React.useEffect(() => {
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

  const handleChange = (key: SettingKey, value: boolean | string | number) => {
    setSettingState({[key]: value});
    setActivePickerKey(null);
  };

  const selectSideApps = (item: AppItemProps) => {
    setIsAppModalVisible(false);
    setIsLauncherAppModalVisible(true);
    onAppSelect(item);
  };

  // Sections config (OCP - easy to extend)
  const settingsSections: SettingsSection[] = [
    {
      title: 'Launcher',
      options: [
        {
          title: 'Set as default launcher',
          key: SettingKey.IS_DEFAULT_LAUNCHER,
          type: 'toggle',
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
      title: 'Gesture',
      options: [
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
console.log('isAppListVisible in SettingsModal', isAppListVisible);
  const renderOption = (option: SettingOption) => {
    const value = settingState[option.key];

    switch (option.type) {
      case 'toggle':
        return (
          <ToggleOption
            title={option.title}
            value={value}
            onChange={(val: boolean) => handleChange(option.key, val)}
          />
        );

      case 'picker':
        return activePickerKey === option.key ? (
          <PickerList
            keyName={option.key}
            onChange={(val: string | number) => handleChange(option.key, val)}
          />
        ) : (
          <PickerOption
            title={option.title}
            value={value}
            onPress={() =>
              setActivePickerKey(prev =>
                prev === option.key ? null : option.key,
              )
            }
          />
        );

      case 'selector':
        return (
          <SelectorOption
            title={option.title}
            value={value}
            onPress={() => {
              setActivePickerKey(option.key);
              setAppListVisible(true);
              setIsAppModalVisible(true);
            }}
          />
        );

      default:
        return (
          <>
            <Text style={styles.optionTitle}>{option.title}</Text>
            <Text style={styles.optionValue}>{String(value)}</Text>
          </>
        );
    }
  };

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View
        style={[styles.modalContainer, {opacity: visible ? 1 : 0}]}>
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {settingsSections.map((section, idx) => (
              <View key={idx} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                {section.options.map((option, optIdx) => (
                  <View key={optIdx} style={styles.optionContainer}>
                    {renderOption(option)}
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={[styles.closeButton, {backgroundColor: '#ff4444', marginBottom: 10}]}
            onPress={() => {
                setSettingState(DEFAULT_SETTINGS);
                closeSettingsModal();
            }}>
            <Text style={styles.closeButtonText}>Reset to Defaults</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={closeSettingsModal}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>

      <AppListModal
        onAppSelect={selectSideApps}
        closeModal={closeModal}
        isModalVisible={isAppModalVisible}
        fromSettingsModal={true}
      />
    </Modal>
  );
};

export default SettingsModal;
