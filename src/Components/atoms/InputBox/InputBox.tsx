import React, { useRef } from 'react';
import {StyleProp, TextInput, TextStyle} from 'react-native';
import {styles} from './styles';
interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  inputRef?: React.RefObject<TextInput>;
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
  const localRef = inputRef ?? useRef<TextInput>(null);
  return (
    <TextInput
      ref={localRef}
      style={customStyle ?? styles.inputStyle}
      placeholder={placeholder}
      placeholderTextColor="rgba(17,17,17,0.6)"
      value={value}
      onChangeText={onChangeText}
      autoFocus={false}
    />
  );};

export default InputBox;
