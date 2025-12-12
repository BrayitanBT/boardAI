import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { styles } from '../styles/global';

interface ChatMessage {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatbotScreen: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: 1, 
      text: '¡Hola! Soy Billy, tu asistente virtual. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre tus materias, tareas o cualquier tema educativo.', 
      isBot: true, 
      timestamp: new Date() 
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const simulateBotResponse = (userMessage: string): string => {
    const responses = [
      "Entiendo tu pregunta sobre: \"" + userMessage + "\". Estoy procesando tu consulta...",
      "¡Excelente pregunta! Billy está analizando tu consulta para darte la mejor respuesta.",
      "He recibido tu mensaje. Como asistente virtual, estoy aquí para ayudarte con tus dudas académicas.",
      "Procesando tu consulta... ¿Hay algo más específico en lo que pueda ayudarte?",
      "Estoy revisando la información para responderte adecuadamente. ¡Gracias por tu paciencia!"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const sendMessage = () => {
    if (inputText.trim() === '') return;
    
    const userMessage: ChatMessage = {
      id: messages.length + 1,
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: messages.length + 2,
        text: simulateBotResponse(inputText),
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const clearChat = () => {
    Alert.alert(
      'Limpiar chat',
      '¿Estás seguro de que quieres limpiar toda la conversación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Limpiar', 
          style: 'destructive',
          onPress: () => {
            setMessages([
              { 
                id: 1, 
                text: '¡Hola! Soy Billy, tu asistente virtual. ¿En qué puedo ayudarte hoy?', 
                isBot: true, 
                timestamp: new Date() 
              }
            ]);
          }
        }
      ]
    );
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.screenContainer}>
      <KeyboardAvoidingView 
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView 
          contentContainerStyle={styles.screenScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header del Chatbot */}
          <View style={[styles.horizontalLayout, styles.justifyContentBetween, styles.marginBottom20]}>
            <View style={styles.horizontalLayout}>
              <View style={styles.chatbotHeaderIcon}>
                <Text style={styles.chatbotHeaderIconText}>🤖</Text>
              </View>
              <View>
                <Text style={styles.chatbotHeaderTitle}>Billy - Asistente</Text>
                <Text style={styles.chatbotHeaderSubtitle}>Disponible 24/7 para ayudarte</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              onPress={clearChat}
              style={styles.clearChatButton}
            >
              <Text style={styles.clearChatButtonText}>🗑️</Text>
            </TouchableOpacity>
          </View>

          {/* Historial del Chat */}
          <ScrollView 
            ref={scrollViewRef}
            style={styles.chatHistoryContainer}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.chatMessageContainer,
                  message.isBot ? styles.chatMessageBotContainer : styles.chatMessageUserContainer
                ]}
              >
                <View style={[
                  styles.chatMessageBubble,
                  message.isBot ? styles.chatMessageBotBubble : styles.chatMessageUserBubble
                ]}>
                  <Text style={[
                    styles.chatMessageText,
                    message.isBot ? styles.chatMessageBotText : styles.chatMessageUserText
                  ]}>
                    {message.text}
                  </Text>
                  <Text style={[
                    styles.chatMessageTime,
                    message.isBot ? styles.chatMessageBotTime : styles.chatMessageUserTime
                  ]}>
                    {formatTime(message.timestamp)}
                  </Text>
                </View>
              </View>
            ))}
            
            {isLoading && (
              <View style={styles.chatMessageBotContainer}>
                <View style={styles.chatMessageBotBubble}>
                  <View style={styles.typingIndicator}>
                    <Text style={styles.typingText}>Billy está escribiendo</Text>
                    <View style={styles.typingDots}>
                      <View style={styles.typingDot} />
                      <View style={styles.typingDot} />
                      <View style={styles.typingDot} />
                    </View>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Input del Chat */}
          <View style={styles.chatInputContainer}>
            <TextInput
              style={styles.chatInput}
              placeholder="Escribe tu pregunta aquí..."
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              onSubmitEditing={sendMessage}
              blurOnSubmit={false}
            />
            
            <TouchableOpacity 
              style={[
                styles.chatSendButton,
                !inputText.trim() && styles.chatSendButtonDisabled
              ]}
              onPress={sendMessage}
              disabled={!inputText.trim()}
            >
              <Text style={styles.chatSendButtonText}>➤</Text>
            </TouchableOpacity>
          </View>

          {/* Nota informativa */}
          <View style={styles.chatInfoContainer}>
            <Text style={styles.chatInfoText}>
              💡 Billy puede ayudarte con: preguntas académicas, dudas sobre tareas, conceptos de estudio y más.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatbotScreen;