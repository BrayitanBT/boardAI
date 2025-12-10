import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  ActivityIndicator 
} from 'react-native';
import { styles } from '../styles/global';
import { ButtonProps } from '../types';

const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  loading = false,
  disabled = false,
  type = 'primary',
  style,
  ...props 
}) => {
  const getBaseStyle = () => {
    if (type === 'secondary') return styles.buttonSecondary;
    if (type === 'danger') return styles.buttonDanger;
    return styles.button;
  };

  return (
    <TouchableOpacity
      style={[
        getBaseStyle(),
        disabled && styles.buttonDisabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;