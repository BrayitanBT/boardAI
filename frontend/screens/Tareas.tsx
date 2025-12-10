import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  Alert,
  TouchableOpacity 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/global';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Loading from '../components/Loading';
import { 
  getTareas, 
  entregarTarea, 
  getComentarios, 
  crearComentario,
  eliminarComentario,
  eliminarTarea 
} from '../api';
import { ScreenProps, User, Materia, Tarea, Comentario } from '../types';

const TareasScreen: React.FC<ScreenProps> = ({ route, navigation }) => {
  const params = route?.params || {};
  const { materia }: { materia: Materia } = params;
  
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [comentarios, setComentarios] = useState<Record<number, Comentario[]>>({});
  const [user, setUser] = useState<User | null>(null);
  const [entregaText, setEntregaText] = useState<string>('');
  const [nuevoComentario, setNuevoComentario] = useState<string>('');
  const [tareaActiva, setTareaActiva] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadTareas = useCallback(async (): Promise<void> => {
    if (!materia?.id) return;
    
    setLoading(true);
    const result = await getTareas(materia.id);
    if (result.success && result.tareas) {
      setTareas(result.tareas);
    }
    setLoading(false);
  }, [materia?.id]);

  useEffect(() => {
    loadTareas();
  }, [loadTareas]);

  const loadUser = async (): Promise<void> => {
    const userJson = await AsyncStorage.getItem('user');
    if (userJson) {
      setUser(JSON.parse(userJson));
    }
  };

  const loadComentarios = async (tareaId: number): Promise<void> => {
    const result = await getComentarios(tareaId);
    if (result.success && result.comentarios) {
      setComentarios(prev => ({
        ...prev,
        [tareaId]: result.comentarios!
      }));
    }
  };

  const handleEntregar = async (tareaId: number): Promise<void> => {
    if (!entregaText.trim()) {
      Alert.alert('Error', 'Por favor escribe algo para entregar');
      return;
    }

    const result = await entregarTarea(tareaId, entregaText);
    
    if (result.success) {
      Alert.alert('Éxito', 'Tarea entregada correctamente');
      setEntregaText('');
      loadTareas();
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const handleComentar = async (tareaId: number): Promise<void> => {
    if (!nuevoComentario.trim()) {
      Alert.alert('Error', 'El comentario no puede estar vacío');
      return;
    }

    const result = await crearComentario(tareaId, nuevoComentario);
    
    if (result.success) {
      setNuevoComentario('');
      loadComentarios(tareaId);
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const handleEliminarTarea = async (tareaId: number): Promise<void> => {
    Alert.alert(
      'Eliminar tarea',
      '¿Estás seguro de que quieres eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            const result = await eliminarTarea(tareaId);
            if (result.success) {
              Alert.alert('Éxito', 'Tarea eliminada');
              loadTareas();
            } else {
              Alert.alert('Error', result.message);
            }
          }
        }
      ]
    );
  };

  const handleEliminarComentario = async (comentarioId: number, tareaId: number): Promise<void> => {
    Alert.alert(
      'Eliminar comentario',
      '¿Estás seguro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          onPress: async () => {
            const result = await eliminarComentario(comentarioId);
            if (result.success) {
              loadComentarios(tareaId);
            } else {
              Alert.alert('Error', result.message);
            }
          }
        }
      ]
    );
  };

  if (loading || !user || !materia) {
    return <Loading message="Cargando tareas..." />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{materia.nombre}</Text>
      <Text style={styles.subtitle}>{materia.descripcion || 'Sin descripción'}</Text>

      {user?.rol === 'profesor' && materia.profesor_id === user.id && (
        <Button
          title="➕ Crear tarea en esta materia"
          onPress={() => navigation.navigate('CrearTarea')}
          style={styles.mb10}
        />
      )}

      {tareas.length === 0 ? (
        <Text style={[styles.text, styles.textCenter, styles.mt20]}>
          No hay tareas en esta materia
        </Text>
      ) : (
        tareas.map((tarea) => (
          <Card
            key={tarea.id}
            title={tarea.titulo}
            description={`${tarea.descripcion || 'Sin descripción'}\nEntrega: ${tarea.fecha_entrega || 'Sin fecha límite'}`}
          >
            {user?.rol === 'profesor' && materia.profesor_id === user.id && (
              <Button
                title="🗑️ Eliminar tarea"
                onPress={() => handleEliminarTarea(tarea.id)}
                type="danger"
                style={styles.mb10}
              />
            )}

            {user?.rol === 'estudiante' && (
              <>
                <Text style={[styles.inputLabel, styles.mt20]}>Tu entrega:</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.inputMultiline
                  ]}
                  multiline
                  placeholder="Escribe tu respuesta aquí..."
                  value={entregaText}
                  onChangeText={setEntregaText}
                />
                <Button
                  title="📤 Entregar tarea"
                  onPress={() => handleEntregar(tarea.id)}
                  style={styles.mt20}
                />
              </>
            )}

            <TouchableOpacity 
              onPress={() => {
                setTareaActiva(tareaActiva === tarea.id ? null : tarea.id);
                if (tareaActiva !== tarea.id) {
                  loadComentarios(tarea.id);
                }
              }}
              style={{ marginTop: 20 }}
            >
              <Text style={{ color: '#3498db', fontWeight: '600' }}>
                {tareaActiva === tarea.id ? '▼' : '▶'} Comentarios
              </Text>
            </TouchableOpacity>

            {tareaActiva === tarea.id && (
              <View style={{ marginTop: 10 }}>
                {comentarios[tarea.id]?.map((comentario) => (
                  <View 
                    key={comentario.id} 
                    style={[
                      styles.card, 
                      { 
                        marginVertical: 5,
                        backgroundColor: comentario.usuario_id === user?.id ? '#e8f4fd' : 'white'
                      }
                    ]}
                  >
                    <View style={[styles.row, styles.spaceBetween]}>
                      <Text style={{ fontWeight: '600' }}>
                        {comentario.usuario_nombre} ({comentario.rol})
                      </Text>
                      <Text style={{ fontSize: 12, color: '#7f8c8d' }}>
                        {new Date(comentario.creado_en).toLocaleDateString()}
                      </Text>
                    </View>
                    <Text style={[styles.text, { marginTop: 5 }]}>
                      {comentario.comentario}
                    </Text>
                    {(comentario.usuario_id === user?.id || user?.rol === 'profesor') && (
                      <TouchableOpacity
                        onPress={() => handleEliminarComentario(comentario.id, tarea.id)}
                        style={{ alignSelf: 'flex-end', marginTop: 5 }}
                      >
                        <Text style={{ color: '#e74c3c', fontSize: 12 }}>Eliminar</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}

                <Input
                  label="Agregar comentario"
                  value={nuevoComentario}
                  onChangeText={setNuevoComentario}
                  placeholder="Escribe un comentario..."
                  multiline
                />
                <Button
                  title="Comentar"
                  onPress={() => handleComentar(tarea.id)}
                  type="secondary"
                />
              </View>
            )}
          </Card>
        ))
      )}
    </ScrollView>
  );
};

export default TareasScreen;