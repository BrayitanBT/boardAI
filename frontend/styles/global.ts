// src/styles/global.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ============ CONTENEDORES ============
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  
  // ============ SCROLLVIEW ============ (NUEVO)
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  
  // ============ TEXTOS ============
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 30,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  textSmall: {
    fontSize: 13,
    color: '#7f8c8d',
    marginTop: 2,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 5,
  },
  textCenter: {
    textAlign: 'center',
  },
  noDataText: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontStyle: 'italic',
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontStyle: 'italic',
    marginTop: 20,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  
  // ============ BOTONES ============
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondary: {
    backgroundColor: '#95a5a6',
  },
  buttonDanger: {
    backgroundColor: '#e74c3c',
  },
  buttonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  smallButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  
  // ============ BOTONES DE FILTRO PARA MATERIAS ============
  materiaFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  materiaFilterButtonSelected: {
    backgroundColor: '#2980b9',
  },
  materiaFilterButtonUnselected: {
    backgroundColor: '#95a5a6',
  },
  
  // ============ INPUTS ============
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputFocused: {
    borderColor: '#3498db',
    borderWidth: 2,
  },
  
  // ============ CARDS ============
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  cardText: {
    color: '#7f8c8d',
    fontSize: 14,
  },
  
  // ============ AVATARES ============
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarProfesor: {
    backgroundColor: '#9b59b6',
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarTextLarge: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  
  // ============ ROLES Y BADGES ============
  logoutText: {
    color: '#e74c3c',
    fontSize: 16,
  },
  roleBadge: {
    backgroundColor: '#2ecc71',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
  },
  roleBadgeProfesor: {
    backgroundColor: '#9b59b6',
  },
  roleBadgeWarning: {
    backgroundColor: '#f39c12',
  },
  roleText: {
    color: 'black',
    fontWeight: '600',
  },
  roleValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498db',
    marginLeft: 5,
  },
  
  // ============ BADGES PARA ESTADOS ============
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeSuccess: {
    backgroundColor: '#2ecc71',
  },
  badgeWarning: {
    backgroundColor: '#f39c12',
  },
  badgeInfo: {
    backgroundColor: '#3498db',
  },
  badgeDanger: {
    backgroundColor: '#e74c3c',
  },
  
  // ============ UTILIDADES DE LAYOUT ============
  horizontalLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  justifyContentBetween: {
    justifyContent: 'space-between',
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  
  // ============ UTILIDADES DE ESPACIADO ============
  marginTop5: { 
    marginTop: 5 
  },
  marginTop10: { 
    marginTop: 10 
  },
  marginTop20: { 
    marginTop: 20 
  },
  marginBottom10: { 
    marginBottom: 10 
  },
  marginBottom20: { 
    marginBottom: 20 
  },
  marginVertical5: {
    marginVertical: 5,
  },
  marginVertical10: {
    marginVertical: 10,
  },
  marginVertical20: {
    marginVertical: 20,
  },
  padding10: {
    padding: 10,
  },
  padding20: {
    padding: 20,
  },
  
  // ============ OTROS ESTILOS DE LAYOUT (Perfiles/Secciones) ============
  profileInfo: {
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  section: {
    marginVertical: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 5,
  },
  materiaItem: {
    marginBottom: 10,
  },
  profileCard: {
    alignItems: 'center',
  },
  roleContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: '#ecf0f1',
  },

  // ============ ESTILOS ESPECÍFICOS PARA TEXTOS CON ESPACIADO ============
  textWithPaddingTop: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    paddingTop: 20,
  },
  textContainerWithMargin: {
    marginTop: 20,
  },
  textContainerWithPadding: {
    paddingTop: 20,
  },

  // ============ ESTILOS DE NAVEGACIÓN ============
  navigationHeader: {
    backgroundColor: '#3498db',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  navigationHeaderTitle: {
    fontWeight: 'bold',
    fontSize: 18
  },
  navigationHeaderLogin: {
    backgroundColor: '#3498db',
  },
  navigationHeaderRegister: {
    backgroundColor: '#2980b9',
  },
  navigationHeaderHome: {
    backgroundColor: '#2c3e50',
  },
  navigationHeaderMaterias: {
    backgroundColor: '#3498db',
  },
  navigationHeaderTareas: {
    backgroundColor: '#3498db',
  },
  navigationHeaderCrearMateria: {
    backgroundColor: '#27ae60',
  },
  navigationHeaderCrearTarea: {
    backgroundColor: '#27ae60',
  },
  navigationHeaderEntregas: {
    backgroundColor: '#9b59b6',
  },
  navigationHeaderPerfil: {
    backgroundColor: '#e67e22',
  },
  navigationHeaderDetalleEntrega: {
    backgroundColor: '#34495e',
  },
  navigationHeaderCalificarEntrega: {
    backgroundColor: '#f39c12',
  },
  navigationCard: {
    backgroundColor: '#f5f5f5'
  },
});

// Exportar configuraciones de navegación como objetos separados
export const navigationStyles = {
  // Configuración global para screenOptions
  screenOptions: {
    headerStyle: styles.navigationHeader,
    headerTintColor: 'white',
    headerTitleStyle: styles.navigationHeaderTitle,
    cardStyle: styles.navigationCard,
  },

  // Opciones específicas por pantalla
  screenOptionsByRoute: {
    Login: {
      headerShown: false
    },
    Register: {
      title: 'Registro',
      headerStyle: styles.navigationHeaderRegister
    },
    Home: {
      title: 'Inicio',
      headerLeft: () => null,
      headerStyle: styles.navigationHeaderHome
    },
    Materias: {
      title: 'Materias',
      headerStyle: styles.navigationHeaderMaterias
    },
    Tareas: {
      title: 'Tareas',
      headerStyle: styles.navigationHeaderTareas
    },
    CrearMateria: {
      title: 'Nueva Materia',
      headerStyle: styles.navigationHeaderCrearMateria
    },
    CrearTarea: {
      title: 'Nueva Tarea',
      headerStyle: styles.navigationHeaderCrearTarea
    },
    Entregas: {
      title: 'Entregas',
      headerStyle: styles.navigationHeaderEntregas
    },
    Perfil: {
      title: 'Mi Perfil',
      headerStyle: styles.navigationHeaderPerfil
    },
    DetalleEntrega: {
      title: 'Detalle de Entrega',
      headerStyle: styles.navigationHeaderDetalleEntrega
    },
    CalificarEntrega: {
      title: 'Calificar Entrega',
      headerStyle: styles.navigationHeaderCalificarEntrega
    }
  }
};