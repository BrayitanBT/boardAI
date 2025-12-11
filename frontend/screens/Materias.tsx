// src/screens/MateriasScreen.tsx (VERSIÓN COMPLETA CORREGIDA)
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { styles } from '../styles/global';
import Card from '../components/Card';
import Button from '../components/Button';
import Loading from '../components/Loading';
import { getMaterias, getMisMaterias, inscribirseMateria } from '../api';
import { ScreenProps, Materia } from '../types'; 
import { useAuth } from '../context/AuthContext'; 

type MateriasScreenProps = ScreenProps<'Materias'>;

const MateriasScreen: React.FC<MateriasScreenProps> = ({ route, navigation }) => {
  const { user, loading: authLoading } = useAuth(); 

  const { tipo = 'todas' } = route.params || {};
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [misMaterias, setMisMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = useCallback(async (): Promise<void> => {
    if (authLoading) return;

    setLoading(true);
    
    const misMateriasResult = await getMisMaterias();
    if (misMateriasResult.success && misMateriasResult.materias) {
      setMisMaterias(misMateriasResult.materias);
    } else {
      setMisMaterias([]);
    }

    if (tipo === 'todas') {
      const result = await getMaterias();
      if (result.success && result.materias) {
        const materiasFiltradas = result.materias.filter(m => 
          !misMateriasResult.materias?.some(mm => mm.id === m.id)
        );
        setMaterias(materiasFiltradas);
      } else {
        setMaterias([]);
      }
    } else {
      setMaterias([]); 
    }
    
    setLoading(false);
  }, [tipo, authLoading]); 

  useEffect(() => {
    loadData();
  }, [tipo, loadData]); 

  const handleInscribirse = async (materiaId: number): Promise<void> => {
    const result = await inscribirseMateria(materiaId);
    
    if (result.success) {
      Alert.alert('Éxito', 'Te has inscrito correctamente');
      loadData(); 
    } else {
      Alert.alert('Error', result.message);
    }
  };
  
  const displayList = tipo === 'mis-materias' ? misMaterias : materias;
  
  const puedeCrearMateria = user?.rol === 'profesor' && tipo === 'mis-materias';

  const renderMateria = (materia: Materia, esInscrito: boolean = false): JSX.Element => {
    const puedeVerTareas = esInscrito || (user?.rol === 'profesor' && materia.profesor_id === user?.id);
    
    return (
      <Card
        key={materia.id}
        title={materia.nombre}
        description={`${materia.descripcion || 'Sin descripción'}\nProfesor: ${materia.profesor_nombre || 'Desconocido'}`}
      >
        <View style={[styles.horizontalLayout, styles.justifyContentBetween, styles.marginTop20]}>
          <Button
            title="Ver tareas"
            onPress={() => navigation.navigate('Tareas', { materia })} 
            style={{ flex: tipo === 'mis-materias' ? 1 : 0.5, marginRight: 10 }}
            type="secondary"
            disabled={!puedeVerTareas}
          />
          
          {tipo === 'todas' && !esInscrito && user?.rol === 'estudiante' && (
            <Button
              title="Inscribirme"
              onPress={() => handleInscribirse(materia.id)}
              style={{ flex: 0.5, marginLeft: 10 }}
            />
          )}
        </View>
      </Card>
    );
  };

  if (authLoading || loading) {
    return <Loading message="Cargando materias..." />;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>
          {tipo === 'mis-materias' ? 'Mis Materias' : 'Todas las Materias'}
        </Text>
        
        {puedeCrearMateria && (
          <Button
            title="+ Crear Nueva Materia"
            onPress={() => navigation.navigate('CrearMateria')}
            style={styles.marginBottom20}
          />
        )}

        {displayList.length === 0 ? (
          // SOLUCIÓN: View con margen + Text sin marginTop
          <View style={styles.marginTop20}>
            <Text style={[styles.text, styles.textCenter]}>
              {tipo === 'mis-materias' 
                ? (user?.rol === 'profesor' 
                  ? 'Aún no has creado ninguna materia.'
                  : 'No estás inscrito en ninguna materia.')
                : 'No hay materias disponibles'
              }
            </Text>
          </View>
        ) : (
          displayList.map((materia) => {
            const esInscrito = misMaterias.some(m => m.id === materia.id);
            return renderMateria(materia, esInscrito);
          })
        )}
      </ScrollView>
    </View>
  );
};

export default MateriasScreen;