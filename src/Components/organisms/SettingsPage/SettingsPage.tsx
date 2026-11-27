import React, {memo, useMemo, useState} from 'react';
import {
  View,
  Text,
  Switch,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {styles} from './Styles';
import {
  SettingKey,
  DEFAULT_SETTINGS,
} from '../../../Constants/ConstantVar';
import {useThemeColors} from '../../../theme';
import useAppStore from '../../../Store/AppStore';
import {AppItemProps} from '../../../Type';
import {useSettings} from './useSettings';
import {getSettingsSections, SettingOption} from './settingsConfig';

const DEFAULT_PACKAGE_LABELS: Record<string, string> = {
  AppDrawer: 'App Drawer',
  Notifications: 'Notifications',
  'com.android.settings': 'Settings',
  'com.android.vending': 'Play Store',
};

interface SettingsModalProps {
  visible: boolean;
  closeSettingsModal: () => void;
  onPickGestureApp: (key: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  closeSettingsModal,
  onPickGestureApp,
}) => {
  const insets = useSafeAreaInsets();
  const {
    settingState,
    setSettingState,
    activePickerKey,
    setActivePickerKey,
    getPickerValues,
    handleChange,
  } = useSettings(visible);

  const apps: AppItemProps[] = useAppStore(state => state.apps) || [];
  const settingsSections = useMemo(() => getSettingsSections(), []);
  const themePalette = useThemeColors();
  const [actionStatus, setActionStatus] = useState<string | null>(null);

  const getAppLabel = (pkgValue: unknown): string => {
    if (!pkgValue) return 'Select an App';
    const pkg = String(pkgValue);
    const matched = apps.find(app => app.packageName === pkg);
    if (matched) {
      return matched.customLabel || matched.label;
    }
    return DEFAULT_PACKAGE_LABELS[pkg] ?? pkg;
  };

  const renderOption = (option: SettingOption) => {
    const value = settingState[option.key];

    switch (option.type) {
      case 'toggle':
        return (
          <>
            <View style={styles.optionLabelGroup}>
              <Text style={[styles.optionTitle, {color: themePalette.textPrimary}]}>
                {option.title}
              </Text>
              {option.subtitle ? (
                <Text
                  style={[
                    styles.optionSubtitle,
                    {color: themePalette.textSecondary},
                  ]}>
                  {option.subtitle}
                </Text>
              ) : null}
            </View>
            <Switch
              value={Boolean(value)}
              trackColor={{
                false: themePalette.switchTrackOff,
                true: themePalette.switchTrackOn,
              }}
              thumbColor={themePalette.switchThumb}
              onValueChange={val => {
                handleChange(option.key, val);
                if (option.onPressAction && val) {
                  option.onPressAction();
                }
              }}
            />
          </>
        );

      case 'picker':
        return activePickerKey === option.key ? (
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={getPickerValues(option.key)}
            keyExtractor={(item, index) => `${option.key}-${index}`}
            contentContainerStyle={styles.pickerListContainer}
            renderItem={({item}) => {
              const isSelected = String(value) === String(item);
              return (
                <TouchableOpacity
                  style={[
                    styles.pickerOption,
                    {
                      backgroundColor: isSelected
                        ? themePalette.chipSelected
                        : themePalette.chip,
                    },
                  ]}
                  onPress={() => handleChange(option.key, item)}>
                  <Text
                    style={[
                      styles.optionValue,
                      {
                        color: isSelected
                          ? themePalette.chipSelectedText
                          : themePalette.textPrimary,
                      },
                      option.key === SettingKey.TEXT_SIZE && {
                        fontSize: Number(item),
                      },
                    ]}>
                    {option.key === SettingKey.TEXT_SIZE ? 'Text' : item}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        ) : (
          <TouchableOpacity
            style={styles.pickerTriggerRow}
            onPress={() =>
              setActivePickerKey(prev =>
                prev === option.key ? null : option.key,
              )
            }>
            <Text style={[styles.optionTitle, {color: themePalette.textPrimary}]}>
              {option.title}
            </Text>
            <Text
              style={[styles.optionValue, {color: themePalette.textSecondary}]}>
              {String(value)}
            </Text>
          </TouchableOpacity>
        );

      case 'selector':
        return (
          <TouchableOpacity
            style={styles.pickerTriggerRow}
            onPress={() => onPickGestureApp(option.key)}>
            <Text style={[styles.optionTitle, {color: themePalette.textPrimary}]}>
              {option.title}
            </Text>
            <Text
              style={[styles.optionValue, {color: themePalette.textSecondary}]}
              numberOfLines={1}>
              {getAppLabel(value)}
            </Text>
          </TouchableOpacity>
        );

      case 'action':
        return (
          <TouchableOpacity
            style={styles.pickerTriggerRow}
            disabled={actionStatus === 'Refreshing...'}
            onPress={async () => {
              if (!option.onPressAction) return;
              setActionStatus('Refreshing...');
              try {
                await Promise.resolve(option.onPressAction());
                setActionStatus('Updated');
                setTimeout(() => setActionStatus(null), 1500);
              } catch {
                setActionStatus('Failed');
                setTimeout(() => setActionStatus(null), 1500);
              }
            }}>
            <Text style={[styles.optionTitle, {color: themePalette.textPrimary}]}>
              {option.title}
            </Text>
            <Text
              style={[styles.optionValue, {color: themePalette.textSecondary}]}>
              {actionStatus || option.actionLabel || 'Run'}
            </Text>
          </TouchableOpacity>
        );

      default:
        return (
          <>
            <Text style={[styles.optionTitle, {color: themePalette.textPrimary}]}>
              {option.title}
            </Text>
            <Text
              style={[styles.optionValue, {color: themePalette.textSecondary}]}>
              {String(value)}
            </Text>
          </>
        );
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={closeSettingsModal}>
      <View
        style={[
          styles.modalContainer,
          {
            paddingTop: Math.max(insets.top + 12, 28),
            paddingBottom: Math.max(insets.bottom + 12, 24),
          },
        ]}>
        <View
          style={[
            styles.modalContent,
            {backgroundColor: themePalette.transparent},
          ]}>
          <View style={styles.headerRow}>
            <Text
              style={[
                styles.headerTitle,
                {color: themePalette.textOnWallpaper},
              ]}>
              Settings
            </Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {settingsSections.map((section, idx) => (
              <View key={idx} style={styles.section}>
                <Text
                  style={[
                    styles.sectionTitle,
                    {color: themePalette.textOnWallpaper, opacity: 0.75},
                  ]}>
                  {section.title}
                </Text>
                <View
                  style={[
                    styles.sectionCard,
                    {backgroundColor: themePalette.translucentCard},
                  ]}>
                  {section.options.map((option, optIdx) => (
                    <View key={optIdx} style={styles.optionContainer}>
                      {renderOption(option)}
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.actionsFooter}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                {backgroundColor: themePalette.dangerBg},
              ]}
              onPress={() => {
                setSettingState(DEFAULT_SETTINGS);
                closeSettingsModal();
              }}>
              <Text
                style={[
                  styles.actionButtonText,
                  {color: themePalette.dangerText},
                ]}>
                Reset
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionButton,
                {backgroundColor: themePalette.primaryButtonBg},
              ]}
              onPress={closeSettingsModal}>
              <Text
                style={[
                  styles.actionButtonText,
                  {color: themePalette.primaryButtonText},
                ]}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default memo(SettingsModal);
