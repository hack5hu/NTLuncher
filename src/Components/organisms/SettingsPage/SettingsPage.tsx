import React, {memo, useMemo} from 'react';
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
import AppListModal from '../../templates/AppListModal/AppListModal';
import {useSettings} from './useSettings';
import {getSettingsSections, SettingOption} from './settingsConfig';
import {AppItemProps} from '../../../Type';

interface SettingsModalProps {
  visible: boolean;
  closeSettingsModal: () => void;
  panResponder?: unknown;
  onAppSelect: (item: AppItemProps) => void;
  closeModal: () => void;
  setSettingsModalVisible: (visible: boolean) => void;
  setIsLauncherAppModalVisible: (visible: boolean) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  closeSettingsModal,
  onAppSelect,
  closeModal,
  setIsLauncherAppModalVisible,
}) => {
  const insets = useSafeAreaInsets();
  const {
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
  } = useSettings(visible, onAppSelect, setIsLauncherAppModalVisible);

  const settingsSections = useMemo(() => getSettingsSections(), []);
  const themePalette = useThemeColors();

  const renderOption = (option: SettingOption) => {
    const value = settingState[option.key];

    switch (option.type) {
      case 'toggle':
        return (
          <>
            <Text style={[styles.optionTitle, {color: themePalette.textPrimary}]}>
              {option.title}
            </Text>
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
            onPress={() => {
              setActivePickerKey(option.key);
              setAppListVisible(true);
              setIsAppModalVisible(true);
            }}>
            <Text style={[styles.optionTitle, {color: themePalette.textPrimary}]}>
              {option.title}
            </Text>
            <Text
              style={[styles.optionValue, {color: themePalette.textSecondary}]}
              numberOfLines={1}>
              {value ? String(value) : 'Select an App'}
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
            {backgroundColor: themePalette.surface},
          ]}>
          <View style={styles.headerRow}>
            <Text style={[styles.headerTitle, {color: themePalette.textPrimary}]}>
              Settings
            </Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {settingsSections.map((section, idx) => (
              <View key={idx} style={styles.section}>
                <Text
                  style={[
                    styles.sectionTitle,
                    {color: themePalette.textSecondary},
                  ]}>
                  {section.title}
                </Text>
                <View
                  style={[
                    styles.sectionCard,
                    {backgroundColor: themePalette.card},
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

      <AppListModal
        onAppSelect={selectSideApps}
        closeModal={closeModal}
        isModalVisible={isAppModalVisible}
        fromSettingsModal={true}
      />
    </Modal>
  );
};

export default memo(SettingsModal);
