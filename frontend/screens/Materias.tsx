import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { styles } from '../styles/global';
import Card from '../components/Card';
import Button from '../components/Button';
import Loading from '../components/Loading';
import { getMaterias, getMisMaterias, inscribirseMateria } from '../api';
import { ScreenProps, Materia } from '../types';

const MateriasScreen: React.FC<ScreenProps> = ({ route, navigation }) => {
  const { tipo = 'todas' } = route.params || {};
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [misMaterias, setMisMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (): Promise<void> => {
    setLoading(true);
    
    if (tipo === 'mis-materias') {
      const result = await getMisMaterias();
      if (result.success && result.materias) {
        setMisMaterias(result.materias);
      }
    } else {
      const result = await getMaterias();
      if (result.success && result.materias) {
        setMaterias(result.materias);
      }
    }
    
    setLoading(false);
  };

  const handleInscribirse = async (materiaId: number): Promise<void> => {
    const result = await inscribirseMateria(materiaId);
    
    if (result.success) {
      Alert.alert('Éxito', 'Te has inscrito correctamente');
      loadData();
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const renderMateria = (materia: Materia, esInscrito: boolean = false): JSX.Element => (
    <Card
      key={materia.id}
      title={materia.nombre}
      description={`${materia.descripcion || 'Sin descripción'}\nProfesor: ${materia.profesor_nombre || 'Desconocido'}`}
    >
      <View style={[styles.row, styles.spaceBetween, styles.mt20]}>
        <Button
          title="Ver tareas"
          onPress={() => navigation.navigate('Tareas', { materia })}
          style={{ flex: 1, marginRight: 10 }}
          type="secondary"
        />
        
        {tipo === 'todas' && !esInscrito && (
          <Button
            title="Inscribirme"
            onPress={() => handleInscribirse(materia.id)}
            style={{ flex: 1, marginLeft: 10 }}
          />
        )}
      </View>
    </Card>
  );

  if (loading) {
    return <Loading message="Cargando materias..." />;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {tipo === 'mis-materias' ? (
          <>
            <Text style={styles.title}>Mis Materias</Text>
            {misMaterias.length === 0 ? (
              <Text style={[styles.text, styles.textCenter, styles.mt20]}>
                No estás inscrito en ninguna materia
              </Text>
            ) : (
              misMaterias.map((materia) => renderMateria(materia, true))
            )}
          </>
        ) : (
          <>
            <Text style={styles.title}>Todas las Materias</Text>
            {materias.length === 0 ? (
              <Text style={[styles.text, styles.textCenter, styles.mt20]}>
                No hay materias disponibles
              </Text>
            ) : (
              materias.map((materia) => {
                const esInscrito = misMaterias.some(m => m.id === materia.id);
                return renderMateria(materia, esInscrito);
              })
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default MateriasScreen;