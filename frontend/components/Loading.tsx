import React from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator, 
  StyleSheet 
} from 'react-native';
import { styles } from '../styles/global';
import { LoadingProps } from '../types';

const Loading: React.FC<LoadingProps> = ({ 
  message = 'Cargando...', 
  size = 'large', 
  color = '#3498db',
  type = 'default',
  containerStyle,
  textStyle,
  showSpinner = true
}) => {
  const getContainerStyle = () => {
    if (type === 'fullscreen') {
      return [styles.centerContainer, loadingStyles.fullscreenContainer, containerStyle];
    }
    if (type === 'inline') {
      return [loadingStyles.inlineContainer, containerStyle];
    }
    return [styles.centerContainer, loadingStyles.defaultContainer, containerStyle];
  };

  return (
    <View style={getContainerStyle()}>
      {showSpinner && (
        <ActivityIndicator 
          size={size} 
          color={color} 
          style={loadingStyles.spinner}
        />
      )}
      {message && (
        <Text style={[loadingStyles.message, textStyle]}>{message}</Text>
      )}
    </View>
  );
};

const loadingStyles = StyleSheet.create({
  defaultContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  fullscreenContainer: {
    backgroundColor: '#f5f5f5',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  spinner: {
    marginBottom: 15,
  },
  message: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});

export default Loading;