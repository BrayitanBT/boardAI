// screens/PerfilScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getMisMaterias, salirMateria } from '../api';
import { ScreenProps, Materia } from '../types';
import Button from '../components/Button';
import Card from '../components/Card';
import Loading from '../components/Loading';
import { styles as globalStyles } from '../styles/global';

const PerfilScreen: React.FC<ScreenProps<'Perfil'>> = ({ navigation }) => {
  const { user, signOut } = useAuth();
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const usuario_id = user?.id;

  const loadMaterias = useCallback(async () => {
    if (!usuario_id) return;

    setLoading(true);
    try {
      const response = await getMisMaterias();
      if (response.success && response.materias) {
        setMaterias(response.materias);
      } else {
        Alert.alert("Error", response.message || "No se pudieron cargar las materias. Revise la API.");
      }
    } catch{
      Alert.alert("Error", "Error al cargar las materias");
      
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [usuario_id]);

  useEffect(() => {
    loadMaterias();
  }, [loadMaterias]);

  const onRefresh = () => {
    setRefreshing(true);
    loadMaterias();
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar tu sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar',
          onPress: () => {
            signOut();
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  const handleSalirMateria = async (materiaId: number) => {
    Alert.alert(
      'Salir de la materia',
      '¿Estás seguro de que quieres salir de esta materia?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          onPress: async () => {
            const response = await salirMateria(materiaId);
            if (response.success) {
              Alert.alert("Éxito", "Saliste de la materia.");
              loadMaterias();
            } else {
              Alert.alert("Error", response.message || "No se pudo salir de la materia.");
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (!user) {
    return <Loading message="Cargando perfil..." type="fullscreen" />;
  }

  return (
    <ScrollView
      style={globalStyles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={globalStyles.scrollContent} // ✅ Ahora usa el estilo global
    >
      <View style={globalStyles.card}>
        <Text style={globalStyles.title}>Mi Perfil</Text>

        {/* Información de Usuario */}
        <View style={globalStyles.profileInfo}>
          <Text style={globalStyles.subtitle}>{user.nombre}</Text>
          <Text style={globalStyles.text}>{user.email}</Text>
          
          <View style={[globalStyles.horizontalLayout, globalStyles.roleContainer]}>
            <Text style={globalStyles.roleText}>Rol:</Text>
            <Text style={globalStyles.roleValue}>{user.rol.toUpperCase()}</Text>
          </View>
        </View>

        <Button 
          title="Cerrar Sesión" 
          onPress={handleLogout} 
          type="danger" 
        />
      </View>

      {/* Materias del Usuario */}
      <View style={globalStyles.section}>
        <View style={[globalStyles.horizontalLayout, globalStyles.justifyContentBetween]}>
          <Text style={globalStyles.sectionTitle}>
            {user.rol === 'profesor' ? 'Mis Materias Creadas' : 'Mis Materias Inscritas'}
          </Text>
          {user.rol === 'profesor' && (
            <Button 
              title="Crear" 
              onPress={() => navigation.navigate('CrearMateria')} 
              type="secondary"
              style={{ paddingVertical: 5 }}
            />
          )}
        </View>

        {loading ? (
          <Loading message="Cargando materias..." type="inline" />
        ) : materias.length === 0 ? (
          <Text style={globalStyles.emptyText}>No tienes materias asociadas.</Text>
        ) : (
          materias.map((materia) => (
            <Card 
              key={materia.id}
              title={materia.nombre}
              description={`Código: ${materia.codigo || 'N/A'}`}
              onPress={() => navigation.navigate('Tareas', { materia })}
            >
              <View>
                <Text style={globalStyles.textSmall}>Profesor: {materia.profesor_nombre}</Text>
                
                <View style={[globalStyles.horizontalLayout, globalStyles.justifyContentBetween, globalStyles.materiaItem]}>
                  <Button 
                    title="Ver Tareas"
                    onPress={() => navigation.navigate('Tareas', { materia })}
                    type="secondary"
                    style={globalStyles.smallButton}
                  />
                  {user.rol === 'estudiante' && (
                    <Button 
                      title="Salir"
                      onPress={() => handleSalirMateria(materia.id)}
                      type="danger"
                      style={globalStyles.smallButton}
                    />
                  )}
                </View>
              </View>
            </Card>
          ))
        )}
        
        <View style={globalStyles.marginBottom10}>
          <Button 
            title="Ver todas las materias" 
            onPress={() => navigation.navigate('Materias', { tipo: 'todas' })} 
          />
        </View>
        <View style={globalStyles.marginBottom10}>
          <Button 
            title="Ver mis materias" 
            onPress={() => navigation.navigate('Materias', { tipo: 'mis-materias' })} 
            type="secondary"
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default PerfilScreen;