import React, {memo, useRef} from 'react';
import {
  StyleProp,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import {useThemeColors} from '../../../theme';
import {styles} from './styles';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  inputRef?: React.RefObject<React.ComponentRef<typeof TextInput> | null>;
  placeholder?: string;
  customStyle?: StyleProp<TextStyle>;
}

const InputBox: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  inputRef,
  placeholder = 'Search apps...',
  customStyle,
}) => {
  const fallbackRef = useRef<React.ComponentRef<typeof TextInput> | null>(null);
  const resolvedRef = inputRef ?? fallbackRef;
  const colors = useThemeColors();

  return (
    <View style={[styles.wrapper, {backgroundColor: colors.inputBg}]}>
      <TextInput
        ref={resolvedRef}
        style={[styles.inputStyle, {color: colors.textPrimary}, customStyle]}
        placeholder={placeholder}
        placeholderTextColor={colors.inputPlaceholder}
        value={value}
        onChangeText={onChangeText}
        autoFocus={false}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          style={styles.clearButton}
          onPress={() => onChangeText('')}>
          <Text style={[styles.clearText, {color: colors.inputPlaceholder}]}>
            ✕
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default memo(InputBox);
