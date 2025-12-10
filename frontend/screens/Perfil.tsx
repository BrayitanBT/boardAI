import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/global';
import Card from '../components/Card';
import Button from '../components/Button';
import Loading from '../components/Loading';
import { logout, getMisMaterias } from '../api';
import { ScreenProps, User, Materia } from '../types';

const PerfilScreen: React.FC<ScreenProps> = ({ navigation }) => {
  const [user, setUser] = useState<User | null>(null);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (): Promise<void> => {
    setLoading(true);
    
    const userJson = await AsyncStorage.getItem('user');
    if (userJson) {
      setUser(JSON.parse(userJson));
    }

    const materiasResult = await getMisMaterias();
    if (materiasResult.success && materiasResult.materias) {
      setMaterias(materiasResult.materias);
    }
    
    setLoading(false);
  };

  const handleLogout = (): void => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que quieres salir?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Salir', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.replace('Login');
          }
        }
      ]
    );
  };

  if (loading || !user) {
    return <Loading message="Cargando perfil..." />;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Información del usuario */}
      <View style={[styles.card, styles.profileCard]}>
        <View style={[
          styles.avatarLarge,
          user.rol === 'profesor' && styles.avatarProfesor
        ]}>
          <Text style={styles.avatarTextLarge}>
            {user.nombre.charAt(0).toUpperCase()}
          </Text>
        </View>
        
        <Text style={styles.title}>{user.nombre}</Text>
        <Text style={styles.subtitle}>{user.email}</Text>
        <View style={[styles.row, styles.roleContainer]}>
          <View style={[
            styles.roleBadge,
            user.rol === 'profesor' && styles.roleBadgeProfesor
          ]}>
            <Text style={styles.roleText}>
              {user.rol === 'profesor' ? '👨‍🏫 Profesor' : '👨‍🎓 Estudiante'}
            </Text>
          </View>
        </View>
      </View>

      {/* Estadísticas */}
      <Card title="Estadísticas">
        <View style={[styles.row, styles.spaceBetween]}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{materias.length}</Text>
            <Text style={styles.statLabel}>Materias</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Tareas pendientes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>-</Text>
            <Text style={styles.statLabel}>Promedio</Text>
          </View>
        </View>
      </Card>

      {/* Materias inscritas/creadas */}
      <Card title={user.rol === 'estudiante' ? 'Mis materias inscritas' : 'Materias que enseño'}>
        {materias.length === 0 ? (
          <Text style={styles.noDataText}>
            No tienes materias {user.rol === 'estudiante' ? 'inscritas' : 'creadas'}
          </Text>
        ) : (
          materias.map((materia) => (
            <View key={materia.id} style={[styles.row, styles.spaceBetween, styles.materiaItem]}>
              <Text style={styles.text}>{materia.nombre}</Text>
              <Button
                title="Ver"
                onPress={() => navigation.navigate('Tareas', { materia })}
                type="secondary"
                style={styles.smallButton}
              />
            </View>
          ))
        )}
      </Card>

      {/* Acciones */}
      <Card title="Acciones de cuenta">
        {user.rol === 'profesor' && (
          <Button
            title="➕ Crear nueva materia"
            onPress={() => navigation.navigate('CrearMateria')}
            style={styles.mb10}
          />
        )}
        
        {user.rol === 'profesor' && materias.length > 0 && (
          <Button
            title="📝 Crear nueva tarea"
            onPress={() => navigation.navigate('CrearTarea')}
            type="secondary"
            style={styles.mb10}
          />
        )}

        <Button
          title="🚪 Cerrar sesión"
          onPress={handleLogout}
          type="danger"
        />
      </Card>
    </ScrollView>
  );
};

export default PerfilScreen;