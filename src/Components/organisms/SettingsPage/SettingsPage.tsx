import React, {useState} from 'react';
import {
  View,
  Text,
  Switch,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {styles} from './Styles';

// Define types for the settings
interface SettingOption {
  title: string;
  value: string | boolean | number;
  type: 'toggle' | 'text' | 'number';
  onValueChange?: (value: boolean | number | string) => void;
}

interface SettingsSection {
  title: string;
  options: SettingOption[];
}

interface SettingsModalProps {
  visible: boolean;
  closeSettingsModal: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({visible, closeSettingsModal}) => {
  // State for managing settings
  const [settings, setSettings] = useState({
    isDefaultLauncher: false,
    appsOnHomeScreen: 8,
    showDateTime: true,
    appAlignment: 'Right',
    screenTime: false,
    autoShowKeyboard: true,
    dailyNewWallpaper: false,
    statusBarOnTop: true,
    themeMode: 'Light' as 'Light' | 'Dark',
    textSize: 5,
  });
  

  // Handle toggle changes
  const handleToggleChange = (key: string, value: boolean) => {
    setSettings(prev => ({...prev, [key]: value}));
  };

  // Handle numeric changes (e.g., text size or apps on home screen)
  const handleNumericChange = (key: string, value: number) => {
    setSettings(prev => ({...prev, [key]: value}));
  };

  // Handle text/dropdown changes (e.g., app alignment, theme mode)
  const handleTextChange = (key: string, value: string) => {
    setSettings(prev => ({...prev, [key]: value}));
  };

  // Settings data structure
  const settingsSections: SettingsSection[] = [
    {
      title: 'NYlauncher',
      options: [
        {
          title: 'Set as default launcher',
          value: settings.isDefaultLauncher,
          type: 'toggle',
          onValueChange: value =>
            handleToggleChange('isDefaultLauncher', value as boolean),
        },
        {title: 'About and FAQs', value: '', type: 'text'},
        {title: 'Olauncher Pro', value: '', type: 'text'},
      ],
    },
    {
      title: 'Home screen',
      options: [
        {
          title: 'Apps on home screen',
          value: settings.appsOnHomeScreen,
          type: 'number',
          onValueChange: value =>
            handleNumericChange('appsOnHomeScreen', value as number),
        },
        {
          title: 'Show date time',
          value: settings.showDateTime,
          type: 'toggle',
          onValueChange: value =>
            handleToggleChange('showDateTime', value as boolean),
        },
        {
          title: 'App alignment',
          value: settings.appAlignment,
          type: 'text',
          onValueChange: value =>
            handleTextChange('appAlignment', value as string),
        },
        {
          title: 'Screen time',
          value: settings.screenTime,
          type: 'toggle',
          onValueChange: value =>
            handleToggleChange('screenTime', value as boolean),
        },
      ],
    },
    {
      title: 'Appearance',
      options: [
        {
          title: 'Auto show keyboard',
          value: settings.autoShowKeyboard,
          type: 'toggle',
          onValueChange: value =>
            handleToggleChange('autoShowKeyboard', value as boolean),
        },
        {
          title: 'Daily new wallpaper',
          value: settings.dailyNewWallpaper,
          type: 'toggle',
          onValueChange: value =>
            handleToggleChange('dailyNewWallpaper', value as boolean),
        },
        {
          title: 'Status bar on top',
          value: settings.statusBarOnTop,
          type: 'toggle',
          onValueChange: value =>
            handleToggleChange('statusBarOnTop', value as boolean),
        },
        {
          title: 'Theme mode',
          value: settings.themeMode,
          type: 'text',
          onValueChange: value =>
            handleTextChange('themeMode', value as string),
        },
        {
          title: 'Text size',
          value: settings.textSize,
          type: 'number',
          onValueChange: value =>
            handleNumericChange('textSize', value as number),
        },
      ],
    },
  ];

  // const closeModal = () => {
  //   console.log('Checking the shit');
  //   closeSettingsModal();
  // };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      // onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView>
            {settingsSections.map((section, index) => (
              <View key={index} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                {section.options.map((option, optionIndex) => (
                  <View key={optionIndex} style={styles.optionContainer}>
                    <Text style={styles.optionTitle}>{option.title}</Text>
                    {option.type === 'toggle' && (
                      <Switch
                        value={option.value as boolean}
                        onValueChange={option.onValueChange}
                        trackColor={{false: '#767577', true: '#81b0ff'}}
                        thumbColor={option.value ? '#f5dd4b' : '#f4f3f4'}
                      />
                    )}
                    {option.type === 'text' && (
                      <Text style={styles.optionValue}>
                        {typeof option.value === 'string' ? option.value : ''}
                      </Text>
                    )}
                    {option.type === 'number' && (
                      <Text style={styles.optionValue}>{option.value}</Text>
                    )}
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={closeSettingsModal}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SettingsModal;
