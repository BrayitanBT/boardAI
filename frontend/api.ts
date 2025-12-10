import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AuthResponse,
  MateriaResponse,
  TareaResponse,
  EntregaResponse,
  ComentarioResponse,
  User,
  Materia,
  Tarea,
  Entrega,
  Comentario
} from './types';

const API_URL = 'http://10.0.2.2:3000';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Interceptor para token
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/login', {
      email,
      contrasena: password,
    });
    if (response.data.success && response.data.token && response.data.user) {
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error: any) {
    console.error('Login error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Error de conexión' 
    };
  }
};

export const register = async (userData: {
  nombre: string;
  email: string;
  contrasena: string;
  rol: 'estudiante' | 'profesor';
}): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/register', userData);
    return response.data;
  } catch (error: any) {
    console.error('Register error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Error de conexión' 
    };
  }
};

export const logout = async (): Promise<void> => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');
};

// Materias
export const getMaterias = async (): Promise<MateriaResponse> => {
  try {
    const response = await api.get<MateriaResponse>('/materias');
    return response.data;
  } catch (error: any) {
    console.error('Get materias error:', error);
    return { 
      success: false, 
      message: 'Error al cargar materias' 
    };
  }
};

export const getMisMaterias = async (): Promise<MateriaResponse> => {
  try {
    const response = await api.get<MateriaResponse>('/mi/materias');
    return response.data;
  } catch (error: any) {
    console.error('Get mis materias error:', error);
    return { 
      success: false, 
      message: 'Error al cargar mis materias' 
    };
  }
};

export const getMateriaById = async (id: number): Promise<MateriaResponse> => {
  try {
    const response = await api.get<MateriaResponse>(`/materias/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Get materia error:', error);
    return { 
      success: false, 
      message: 'Error al cargar materia' 
    };
  }
};

export const crearMateria = async (materiaData: {
  nombre: string;
  descripcion?: string;
  codigo?: string;
}): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await api.post<{ success: boolean; message?: string }>('/materias', materiaData);
    return response.data;
  } catch (error: any) {
    console.error('Create materia error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Error al crear materia' 
    };
  }
};

export const inscribirseMateria = async (materia_id: number): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await api.post<{ success: boolean; message?: string }>('/inscripciones', { materia_id });
    return response.data;
  } catch (error: any) {
    console.error('Inscribirse error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Error al inscribirse' 
    };
  }
};

export const eliminarMateria = async (materia_id: number): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await api.delete<{ success: boolean; message?: string }>(`/materias/${materia_id}`);
    return response.data;
  } catch (error: any) {
    console.error('Delete materia error:', error);
    return { 
      success: false, 
      message: 'Error al eliminar materia' 
    };
  }
};

// Tareas
export const getTareas = async (materia_id: number): Promise<TareaResponse> => {
  try {
    const response = await api.get<TareaResponse>(`/materias/${materia_id}/tareas`);
    return response.data;
  } catch (error: any) {
    console.error('Get tareas error:', error);
    return { 
      success: false, 
      message: 'Error al cargar tareas' 
    };
  }
};

export const crearTarea = async (tareaData: {
  materia_id: number;
  titulo: string;
  descripcion?: string;
  fecha_entrega?: string;
}): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await api.post<{ success: boolean; message?: string }>('/tareas', tareaData);
    return response.data;
  } catch (error: any) {
    console.error('Create tarea error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Error al crear tarea' 
    };
  }
};

export const eliminarTarea = async (tarea_id: number): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await api.delete<{ success: boolean; message?: string }>(`/tareas/${tarea_id}`);
    return response.data;
  } catch (error: any) {
    console.error('Delete tarea error:', error);
    return { 
      success: false, 
      message: 'Error al eliminar tarea' 
    };
  }
};

// Entregas
export const entregarTarea = async (tarea_id: number, contenido: string): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await api.post<{ success: boolean; message?: string }>('/entregas', {
      tarea_id,
      contenido,
    });
    return response.data;
  } catch (error: any) {
    console.error('Entregar tarea error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Error al entregar' 
    };
  }
};

export const getEntregasTarea = async (tarea_id: number): Promise<EntregaResponse> => {
  try {
    const response = await api.get<EntregaResponse>(`/tareas/${tarea_id}/entregas`);
    return response.data;
  } catch (error: any) {
    console.error('Get entregas error:', error);
    return { 
      success: false, 
      message: 'Error al cargar entregas' 
    };
  }
};

export const calificarEntrega = async (
  entrega_id: number, 
  calificacion: number, 
  comentario?: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await api.put<{ success: boolean; message?: string }>(
      `/entregas/${entrega_id}/calificar`, 
      {
        calificacion,
        comentario_profesor: comentario,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('Calificar error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Error al calificar' 
    };
  }
};

export const getMisEntregas = async (): Promise<EntregaResponse> => {
  try {
    const response = await api.get<EntregaResponse>('/mi/entregas');
    return response.data;
  } catch (error: any) {
    console.error('Get mis entregas error:', error);
    return { 
      success: false, 
      message: 'Error al cargar entregas' 
    };
  }
};

// Comentarios
export const getComentarios = async (tarea_id: number): Promise<ComentarioResponse> => {
  try {
    const response = await api.get<ComentarioResponse>(`/tareas/${tarea_id}/comentarios`);
    return response.data;
  } catch (error: any) {
    console.error('Get comentarios error:', error);
    return { 
      success: false, 
      message: 'Error al cargar comentarios' 
    };
  }
};

export const crearComentario = async (tarea_id: number, comentario: string): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await api.post<{ success: boolean; message?: string }>(
      `/tareas/${tarea_id}/comentarios`, 
      { comentario }
    );
    return response.data;
  } catch (error: any) {
    console.error('Create comentario error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Error al crear comentario' 
    };
  }
};

export const eliminarComentario = async (comentario_id: number): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await api.delete<{ success: boolean; message?: string }>(`/comentarios/${comentario_id}`);
    return response.data;
  } catch (error: any) {
    console.error('Delete comentario error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Error al eliminar comentario' 
    };
  }
};