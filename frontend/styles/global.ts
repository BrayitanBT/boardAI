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
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 5,
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
  roleText: {
    color: 'white',
    fontWeight: '600',
  },
  
  // ============ ESTADÍSTICAS ============
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
  
  // ============ UTILIDADES ============
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  mb10: {
    marginBottom: 10,
  },
  mt20: {
    marginTop: 20,
  },
  textCenter: {
    textAlign: 'center',
  },
  smallButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  noDataText: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  materiaItem: {
    marginBottom: 10,
  },
  profileCard: {
    alignItems: 'center',
  },
  roleContainer: {
    marginTop: 10,
  },
});