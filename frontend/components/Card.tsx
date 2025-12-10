import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/global';
import { CardProps } from '../types';

const Card: React.FC<CardProps> = ({ 
  title, 
  description, 
  onPress, 
  children,
  style 
}) => {
  const content = (
    <View style={[styles.card, style]}>
      {title && <Text style={styles.cardTitle}>{title}</Text>}
      {description && <Text style={styles.cardText}>{description}</Text>}
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

export default Card;