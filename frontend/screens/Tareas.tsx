// src/screens/TareasScreen.tsx (VERSIÓN CORREGIDA)
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
  getTareasByMateria,
  entregarTarea,
  getComentariosByTarea,
  createComentario,
  eliminarComentario,
  eliminarTarea 
} from '../api';
import { TareasScreenProps, User, Materia, Tarea, Comentario } from '../types';

const TareasScreen: React.FC<TareasScreenProps> = ({ route, navigation }) => {
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
    const result = await getTareasByMateria(materia.id);
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
    const result = await getComentariosByTarea(tareaId);
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

    const result = await createComentario(tareaId, { comentario: nuevoComentario });
    
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
    <View style={styles.screenContainer}>
      <ScrollView 
        contentContainerStyle={styles.screenScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Encabezado */}
        <View style={styles.screenHeader}>
          <Text style={styles.screenTitle}>{materia.nombre}</Text>
          <Text style={styles.screenSubtitle}>{materia.descripcion || 'Sin descripción'}</Text>
        </View>

        {user?.rol === 'profesor' && materia.profesor_id === user.id && (
          <Button
            title="➕ Crear tarea en esta materia"
            onPress={() => navigation.navigate('CrearTarea')}
            style={styles.marginBottom20}
          />
        )}

        {tareas.length === 0 ? (
          <View style={[styles.centerContainer, styles.marginTop20]}>
            <Text style={[styles.text, styles.textCenter]}>
              No hay tareas en esta materia
            </Text>
          </View>
        ) : (
          tareas.map((tarea) => (
            <Card
              key={tarea.id}
              title={tarea.titulo}
              description={`${tarea.descripcion || 'Sin descripción'}\nEntrega: ${tarea.fecha_entrega || 'Sin fecha límite'}`}
              style={styles.marginBottom15}
            >
              {user?.rol === 'profesor' && materia.profesor_id === user.id && (
                <Button
                  title="🗑️ Eliminar tarea"
                  onPress={() => handleEliminarTarea(tarea.id)}
                  type="danger"
                  style={styles.marginBottom10}
                />
              )}

              {user?.rol === 'estudiante' && (
                <>
                  <Text style={[styles.inputLabel, styles.marginTop15]}>Tu entrega:</Text>
                  <TextInput
                    style={[
                      styles.input,
                      styles.inputMultiline,
                      styles.marginTop5
                    ]}
                    multiline
                    placeholder="Escribe tu respuesta aquí..."
                    value={entregaText}
                    onChangeText={setEntregaText}
                  />
                  <Button
                    title="📤 Entregar tarea"
                    onPress={() => handleEntregar(tarea.id)}
                    style={styles.marginTop15}
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
                style={styles.marginTop15}
              >
                <Text style={[styles.text, styles.fontWeight600, styles.textPrimary]}>
                  {tareaActiva === tarea.id ? '▼' : '▶'} Comentarios
                </Text>
              </TouchableOpacity>

              {tareaActiva === tarea.id && (
                <View style={styles.marginTop10}>
                  {comentarios[tarea.id]?.map((comentario) => (
                    <View 
                      key={comentario.id} 
                      style={[
                        styles.card, 
                        styles.marginVertical5,
                        comentario.usuario_id === user?.id && styles.backgroundColorLightBlue
                      ]}
                    >
                      <View style={[styles.horizontalLayout, styles.justifyContentBetween]}>
                        <Text style={[styles.text, styles.fontWeight600]}>
                          {comentario.usuario_nombre} ({comentario.rol})
                        </Text>
                        <Text style={[styles.textSmall, styles.textDate]}>
                          {new Date(comentario.creado_en).toLocaleDateString()}
                        </Text>
                      </View>
                      
                      <View style={styles.marginTop5}>
                        <Text style={styles.text}>
                          {comentario.comentario}
                        </Text>
                      </View>
                      
                      {(comentario.usuario_id === user?.id || user?.rol === 'profesor') && (
                        <TouchableOpacity
                          onPress={() => handleEliminarComentario(comentario.id, tarea.id)}
                          style={[styles.marginTop5, styles.alignSelfEnd]}
                        >
                          <Text style={[styles.textSmall, styles.textDanger]}>
                            Eliminar
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}

                  <View style={styles.marginTop10}>
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
                      style={styles.marginTop10}
                    />
                  </View>
                </View>
              )}
            </Card>
          ))
        )}
        
        {/* Espacio al final */}
        <View style={{height: 30}} />
      </ScrollView>
    </View>
  );
};

export default TareasScreen;