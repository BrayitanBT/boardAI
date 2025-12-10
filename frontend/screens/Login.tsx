import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { styles } from '../styles/global';
import Input from '../components/Input';
import Button from '../components/Button';
import { login } from '../api';
import { LoginScreenProps } from '../types';

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation, onLoginSuccess }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleLogin = async (): Promise<void> => {
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    const result = await login(email, password);
    
    if (result.success) {
      onLoginSuccess();
    } else {
      setError(result.message || 'Credenciales incorrectas');
    }
    
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.centerContainer}>
        <View style={{ width: '100%' }}>
          <Text style={styles.title}>Board Ai</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

          {error ? (
            <View style={[styles.card, { backgroundColor: '#ffe6e6' }]}>
              <Text style={[styles.errorText, styles.textCenter]}>{error}</Text>
            </View>
          ) : null}

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="ejemplo@mail.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
          />

          <Button
            title="Iniciar Sesión"
            onPress={handleLogin}
            loading={loading}
          />

          <Button
            title="Registrarse"
            onPress={() => navigation.navigate('Register')}
            type="secondary"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;