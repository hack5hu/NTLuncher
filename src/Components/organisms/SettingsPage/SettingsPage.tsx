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
import {styles} from './Styles';
import {SettingKey, DEFAULT_SETTINGS} from '../../../Constants/ConstantVar';
import AppListModal from '../../templates/AppListModal/AppListModal';
import {useSettings} from './useSettings';
import {getSettingsSections, SettingOption} from './settingsConfig';

interface SettingsModalProps {
  visible: boolean;
  closeSettingsModal: () => void;
  panResponder?: any;
  onAppSelect: (item: any) => void;
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

  const renderOption = (option: SettingOption) => {
    const value = settingState[option.key];

    switch (option.type) {
      case 'toggle':
        return (
          <>
            <Text style={styles.optionTitle}>{option.title}</Text>
            <Switch
              value={Boolean(value)}
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
            data={getPickerValues(option.key)}
            keyExtractor={(item, index) => `${option.key}-${index}`}
            contentContainerStyle={styles.pickerListContainer}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.pickerOption}
                onPress={() => handleChange(option.key, item)}>
                <Text
                  style={[
                    styles.optionValue,
                    option.key === SettingKey.TEXT_SIZE && {fontSize: Number(item)},
                  ]}>
                  {option.key === SettingKey.TEXT_SIZE ? 'Text' : item}
                </Text>
              </TouchableOpacity>
            )}
          />
        ) : (
          <TouchableOpacity
            style={styles.pickerTriggerRow}
            onPress={() =>
              setActivePickerKey(prev => (prev === option.key ? null : option.key))
            }>
            <Text style={styles.optionTitle}>{option.title}</Text>
            <Text style={styles.optionValue}>{String(value)}</Text>
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
            <Text style={styles.optionTitle}>{option.title}</Text>
            <Text style={styles.optionValue}>
              {value ? String(value) : 'Select an App'}
            </Text>
          </TouchableOpacity>
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
      <View style={[styles.modalContainer, {opacity: visible ? 1 : 0}]}>
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

export default memo(SettingsModal);
