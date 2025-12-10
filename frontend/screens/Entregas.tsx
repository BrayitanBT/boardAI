import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/global';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Loading from '../components/Loading';
import { 
  getMisEntregas, 
  getEntregasTarea, 
  calificarEntrega,
  getMisMaterias 
} from '../api';
import { ScreenProps, User, Entrega, Materia } from '../types';

const EntregasScreen: React.FC<ScreenProps> = ({ route }) => {  // <-- Solo route
  const params = route?.params || {};
  const { tipo = 'mis-entregas', tareaId } = params;
  
  const tareaIdString = tareaId?.toString() || '';
  
  const [user, setUser] = useState<User | null>(null);
  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState<string>('');
  const [calificando, setCalificando] = useState<number | null>(null);
  const [calificacion, setCalificacion] = useState<string>('');
  const [comentario, setComentario] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadData = useCallback(async (): Promise<void> => {
    setLoading(true);
    
    if (tipo === 'mis-entregas') {
      const result = await getMisEntregas();
      if (result.success && result.entregas) {
        setEntregas(result.entregas);
      }
    } else if (user?.rol === 'profesor') {
      if (materiaSeleccionada) {
        const result = await getEntregasTarea(parseInt(materiaSeleccionada));
        if (result.success && result.entregas) {
          setEntregas(result.entregas);
        }
      }
      
      const materiasResult = await getMisMaterias();
      if (materiasResult.success && materiasResult.materias) {
        setMaterias(materiasResult.materias);
        if (materiasResult.materias.length > 0 && !materiaSeleccionada) {
          setMateriaSeleccionada(materiasResult.materias[0].id.toString());
        }
      }
    }
    
    setLoading(false);
  }, [tipo, user, materiaSeleccionada]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [tareaIdString, materiaSeleccionada, user, tipo, loadData]);

  const loadUser = async (): Promise<void> => {
    const userJson = await AsyncStorage.getItem('user');
    if (userJson) {
      setUser(JSON.parse(userJson));
    }
  };

  const handleCalificar = async (entregaId: number): Promise<void> => {
    const calificacionNum = parseFloat(calificacion);
    if (!calificacion || isNaN(calificacionNum) || calificacionNum < 0 || calificacionNum > 10) {
      Alert.alert('Error', 'Ingresa una calificación válida (0-10)');
      return;
    }

    const result = await calificarEntrega(
      entregaId,
      calificacionNum,
      comentario
    );

    if (result.success) {
      Alert.alert('Éxito', 'Entrega calificada');
      setCalificando(null);
      setCalificacion('');
      setComentario('');
      loadData();
    } else {
      Alert.alert('Error', result.message);
    }
  };

  if (loading || !user) {
    return <Loading message="Cargando entregas..." />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {tipo === 'mis-entregas' ? 'Mis Entregas' : 'Entregas Pendientes'}
      </Text>

      {user.rol === 'profesor' && tipo !== 'mis-entregas' && (
        <Card title="Seleccionar tarea para calificar">
          {materias.length === 0 ? (
            <Text style={styles.text}>No tienes materias asignadas</Text>
          ) : (
            <View style={styles.row}>
              {materias.map((materia) => (
                <Button
                  key={materia.id}
                  title={materia.nombre}
                  onPress={() => setMateriaSeleccionada(materia.id.toString())}
                  type={materiaSeleccionada === materia.id.toString() ? 'primary' : 'secondary'}
                  style={{ marginRight: 10, marginBottom: 10 }}
                />
              ))}
            </View>
          )}
        </Card>
      )}

      {entregas.length === 0 ? (
        <Text style={[styles.text, styles.textCenter, styles.mt20]}>
          {tipo === 'mis-entregas' ? 'No has entregado tareas' : 'No hay entregas pendientes'}
        </Text>
      ) : (
        entregas.map((entrega) => (
          <Card
            key={entrega.id}
            title={`${entrega.titulo || 'Tarea'} - ${entrega.estudiante_nombre || 'Estudiante'}`}
            description={`Contenido: ${entrega.contenido || 'Sin contenido'}\nFecha: ${entrega.fecha_entrega}`}
          >
            {entrega.calificacion ? (
              <View>
                <Text style={[styles.text, { color: '#27ae60' }]}>
                  Calificación: {entrega.calificacion}/10
                </Text>
                {entrega.comentario_profesor && (
                  <Text style={[styles.text, styles.mt20]}>
                    Comentario: {entrega.comentario_profesor}
                  </Text>
                )}
              </View>
            ) : user.rol === 'profesor' && tipo !== 'mis-entregas' ? (
              <View>
                {calificando === entrega.id ? (
                  <View>
                    <Input
                      label="Calificación (0-10)"
                      value={calificacion}
                      onChangeText={setCalificacion}
                      placeholder="Ej: 8.5"
                      keyboardType="numeric"
                    />
                    <Input
                      label="Comentario (opcional)"
                      value={comentario}
                      onChangeText={setComentario}
                      placeholder="Retroalimentación..."
                      multiline
                    />
                    <View style={styles.row}>
                      <Button
                        title="Cancelar"
                        onPress={() => setCalificando(null)}
                        type="secondary"
                        style={{ flex: 1, marginRight: 10 }}
                      />
                      <Button
                        title="Calificar"
                        onPress={() => handleCalificar(entrega.id)}
                        style={{ flex: 1, marginLeft: 10 }}
                      />
                    </View>
                  </View>
                ) : (
                  <Button
                    title="Calificar entrega"
                    onPress={() => setCalificando(entrega.id)}
                  />
                )}
              </View>
            ) : (
              <Text style={[styles.text, { color: '#e67e22' }]}>
                Calificación pendiente
              </Text>
            )}
          </Card>
        ))
      )}
    </ScrollView>
  );
};

export default EntregasScreen;