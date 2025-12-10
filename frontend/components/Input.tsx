import React, { useState } from 'react';
import { View, TextInput, Text } from 'react-native';
import { styles } from '../styles/global';
import { InputProps } from '../types';

const Input: React.FC<InputProps> = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  secureTextEntry = false,
  error,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  autoCapitalize = 'none',
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <View style={styles.inputContainer}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          multiline && styles.inputMultiline,
          isFocused && styles.inputFocused
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default Input;