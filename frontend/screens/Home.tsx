import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/global';
import Card from '../components/Card';
import Button from '../components/Button';
import Loading from '../components/Loading';
import { logout, getMaterias, getMisEntregas } from '../api';
import { ScreenProps, User, Materia, Entrega } from '../types';

const HomeScreen: React.FC<ScreenProps> = ({ navigation }) => {
  const [user, setUser] = useState<User | null>(null);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadUser();
    loadData();
  }, []);

  const loadUser = async (): Promise<void> => {
    const userJson = await AsyncStorage.getItem('user');
    if (userJson) {
      setUser(JSON.parse(userJson));
    }
  };

  const loadData = async (): Promise<void> => {
    setLoading(true);
    
    const materiasResult = await getMaterias();
    if (materiasResult.success && materiasResult.materias) {
      setMaterias(materiasResult.materias);
    }

    if (user?.rol === 'estudiante') {
      const entregasResult = await getMisEntregas();
      if (entregasResult.success && entregasResult.entregas) {
        setEntregas(entregasResult.entregas);
      }
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

  const navigateToProfile = (): void => {
    navigation.navigate('Perfil');
  };

  if (loading || !user) {
    return <Loading message="Cargando..." />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.row, styles.spaceBetween, styles.mb10]}>
        <TouchableOpacity onPress={navigateToProfile} style={styles.row}>
          <View style={[
            styles.avatarContainer,
            user.rol === 'profesor' && styles.avatarProfesor
          ]}>
            <Text style={styles.avatarText}>
              {user.nombre.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.title}>
              Hola, {user.nombre.split(' ')[0]}
            </Text>
            <Text style={styles.subtitle}>
              {user.rol === 'estudiante' ? 'Estudiante' : 'Profesor'}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* Acciones según rol */}
        <Card title="Acciones rápidas">
          {user.rol === 'estudiante' ? (
            <>
              <Button
                title="📚 Ver mis materias"
                onPress={() => navigation.navigate('Materias', { tipo: 'mis-materias' })}
                style={styles.mb10}
              />
              <Button
                title="➕ Inscribirme a materias"
                onPress={() => navigation.navigate('Materias', { tipo: 'todas' })}
                type="secondary"
                style={styles.mb10}
              />
              <Button
                title="📄 Ver mis entregas"
                onPress={() => navigation.navigate('Entregas', { tipo: 'mis-entregas' })}
                type="secondary"
              />
            </>
          ) : (
            <>
              <Button
                title="📚 Ver mis materias"
                onPress={() => navigation.navigate('Materias', { tipo: 'mis-materias' })}
                style={styles.mb10}
              />
              <Button
                title="➕ Crear nueva materia"
                onPress={() => navigation.navigate('CrearMateria')}
                type="secondary"
                style={styles.mb10}
              />
              <Button
                title="📋 Ver entregas pendientes"
                onPress={() => navigation.navigate('Entregas', { tipo: 'pendientes' })}
                type="secondary"
              />
            </>
          )}
        </Card>

        {/* Últimas materias */}
        <Text style={[styles.cardTitle, styles.mt20]}>Materias recientes</Text>
        
        {materias.length === 0 ? (
          <Text style={[styles.text, styles.textCenter, styles.mt20]}>
            No hay materias disponibles
          </Text>
        ) : (
          materias.slice(0, 3).map((materia) => (
            <Card
              key={materia.id}
              title={materia.nombre}
              description={`Profesor: ${materia.profesor_nombre || 'Desconocido'}`}
              onPress={() => navigation.navigate('Tareas', { materia })}
            />
          ))
        )}

        {/* Para estudiantes: últimas entregas */}
        {user.rol === 'estudiante' && entregas.length > 0 && (
          <>
            <Text style={[styles.cardTitle, styles.mt20]}>Mis últimas entregas</Text>
            {entregas.slice(0, 2).map((entrega) => (
              <Card
                key={entrega.id}
                title={entrega.titulo || 'Tarea'}
                description={`Calificación: ${entrega.calificacion || 'Pendiente'}`}
              />
            ))}
          </>
        )}

        {/* Botón ver todas */}
        {materias.length > 3 && (
          <Button
            title="Ver todas las materias"
            onPress={() => navigation.navigate('Materias', { tipo: 'todas' })}
            type="secondary"
            style={styles.mt20}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;