import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { styles } from '../styles/global';
import Input from '../components/Input';
import Button from '../components/Button';
import { createMateria } from '../api';
import { ScreenProps } from '../types';

const CrearMateriaScreen: React.FC<ScreenProps<'CrearMateria'>> = ({ navigation }) => {
  const [nombre, setNombre] = useState<string>('');
  const [descripcion, setDescripcion] = useState<string>('');
  const [codigo, setCodigo] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleCrear = async (): Promise<void> => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre de la materia es requerido');
      return;
    }

    setLoading(true);

    const result = await createMateria({
      nombre,
      descripcion,
      codigo,
    });

    if (result.success) {
      Alert.alert('Éxito', 'Materia creada correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert('Error', result.message);
    }

    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Crear Nueva Materia</Text>
      <Text style={styles.subtitle}>Completa los datos de la materia</Text>

      <Input
        label="Nombre de la materia *"
        value={nombre}
        onChangeText={setNombre}
        placeholder="Ej: Matemáticas Avanzadas"
      />

      <Input
        label="Código (opcional)"
        value={codigo}
        onChangeText={setCodigo}
        placeholder="Ej: MAT101"
      />

      <Input
        label="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        placeholder="Describe la materia..."
        multiline
        numberOfLines={4}
      />

      <View style={[styles.horizontalLayout, styles.marginTop20]}>
        <Button
          title="Cancelar"
          onPress={() => navigation.goBack()}
          type="secondary"
          style={{ flex: 1, marginRight: 10 }}
        />
        <Button
          title="Crear Materia"
          onPress={handleCrear}
          loading={loading}
          style={{ flex: 1, marginLeft: 10 }}
        />
      </View>
    </ScrollView>
  );
};

export default CrearMateriaScreen;