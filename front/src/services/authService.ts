import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

interface RegisterData {
  nombre: string;
  email: string;
  password: string;
  fecha_nacimiento: string;
  telefono?: string;
}

interface LoginData {
  email: string;
  password: string;
}

const validateAge = (birthDate: string): { isValid: boolean; age: number } => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return {
    isValid: age >= 18,
    age
  };
};

const register = async (data: RegisterData) => {
  // Validar edad antes de enviar al servidor
  const { isValid, age } = validateAge(data.fecha_nacimiento);
  if (!isValid) {
    throw new Error(`Debes tener al menos 18 años para registrarte. Edad actual: ${age}`);
  }

  try {
    const response = await axios.post(`${API_URL}/auth/registro`, data);
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.cliente));
    }
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error en el registro');
  }
};

const login = async (data: LoginData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, data);
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.cliente));
    }
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error en el inicio de sesión');
  }
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  validateAge
};

export default authService; 