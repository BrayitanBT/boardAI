
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './styles/global';
import { RootStackParamList } from './types';

// Importar screens
import LoginScreen from './screens/Login';
import RegisterScreen from './screens/Register';
import HomeScreen from './screens/Home';
import MateriasScreen from './screens/Materias';
import TareasScreen from './screens/Tareas';
import CrearMateriaScreen from './screens/CrearMateria';
import CrearTareaScreen from './screens/CrearTarea';
import EntregasScreen from './screens/Entregas';
import PerfilScreen from './screens/Perfil';

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async (): Promise<void> => {
    const token = await AsyncStorage.getItem('token');
    setIsLoggedIn(!!token);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerStyle: { backgroundColor: '#3498db' },
        headerTintColor: 'white',
        headerTitleStyle: { fontWeight: 'bold' }
      }}>
        {!isLoggedIn ? (
          <>
            <Stack.Screen 
              name="Login" 
              options={{ headerShown: false }}
            >
              {(props) => (
                <LoginScreen 
                  {...props} 
                  onLoginSuccess={() => setIsLoggedIn(true)} 
                />
              )}
            </Stack.Screen>
            <Stack.Screen 
              name="Register" 
              options={{ title: 'Registro' }}
            >
              {(props) => (
                <RegisterScreen 
                  {...props} 
                  onRegisterSuccess={() => setIsLoggedIn(true)} 
                />
              )}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen}
              options={{ title: 'Inicio' }}
            />
            <Stack.Screen 
              name="Materias" 
              component={MateriasScreen}
              options={{ title: 'Materias' }}
            />
            <Stack.Screen 
              name="Tareas" 
              component={TareasScreen}
              options={{ title: 'Tareas' }}
            />
            <Stack.Screen 
              name="CrearMateria" 
              component={CrearMateriaScreen}
              options={{ title: 'Nueva Materia' }}
            />
            <Stack.Screen 
              name="CrearTarea" 
              component={CrearTareaScreen}
              options={{ title: 'Nueva Tarea' }}
            />
            <Stack.Screen 
              name="Entregas" 
              component={EntregasScreen}
              options={{ title: 'Entregas' }}
            />
            <Stack.Screen 
              name="Perfil" 
              component={PerfilScreen}
              options={{ title: 'Mi Perfil' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;