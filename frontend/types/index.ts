// ============ TIPOS DE DATOS ============

// Tipos de usuario
export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: 'estudiante' | 'profesor';
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
}

// Tipos de materia
export interface Materia {
  id: number;
  nombre: string;
  descripcion?: string;
  codigo?: string;
  profesor_id: number;
  profesor_nombre?: string;
}

export interface MateriaResponse {
  success: boolean;
  message?: string;
  materias?: Materia[];
  materia?: Materia;
}

// Tipos de tarea
export interface Tarea {
  id: number;
  materia_id: number;
  titulo: string;
  descripcion?: string;
  fecha_creacion: string;
  fecha_entrega?: string;
  archivo_url?: string;
}

export interface TareaResponse {
  success: boolean;
  message?: string;
  tareas?: Tarea[];
}

// Tipos de entrega
export interface Entrega {
  id: number;
  tarea_id: number;
  estudiante_id: number;
  contenido?: string;
  archivo_url?: string;
  fecha_entrega: string;
  calificacion?: number;
  comentario_profesor?: string;
  titulo?: string;
  estudiante_nombre?: string;
}

export interface EntregaResponse {
  success: boolean;
  message?: string;
  entregas?: Entrega[];
}

// Tipos de comentario
export interface Comentario {
  id: number;
  tarea_id: number;
  usuario_id: number;
  usuario_nombre: string;
  rol: string;
  comentario: string;
  creado_en: string;
}

export interface ComentarioResponse {
  success: boolean;
  message?: string;
  comentarios?: Comentario[];
}

// ============ PROPS PARA COMPONENTES ============

export interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  type?: 'primary' | 'secondary' | 'danger';
  style?: any;
}

export interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export interface CardProps {
  title?: string;
  description?: string;
  onPress?: () => void;
  children?: React.ReactNode;
  style?: any;
}

export interface LoadingProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
  type?: 'default' | 'fullscreen' | 'inline';
  containerStyle?: any;
  textStyle?: any;
  showSpinner?: boolean;
}

// ============ TIPOS PARA NAVEGACIÓN ============

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Materias: { tipo: 'todas' | 'mis-materias' };
  Tareas: { materia: Materia };
  CrearMateria: undefined;
  CrearTarea: undefined;
  Entregas: { tipo?: 'mis-entregas' | 'pendientes'; tareaId?: number };
  Perfil: undefined;
};

// Props para screens
export interface ScreenProps {
  navigation: any;
  route?: any;
}

export interface LoginScreenProps extends ScreenProps {
  onLoginSuccess: () => void;
}

export interface RegisterScreenProps extends ScreenProps {
  onRegisterSuccess: () => void;
}