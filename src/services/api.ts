import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;
const MOCK_AUTH = import.meta.env.VITE_MOCK_AUTH === 'true';

export const apiService = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock de autenticación para desarrollo
if (MOCK_AUTH) {
  apiService.interceptors.request.use(async (config) => {
    if (config.url?.includes('/auth/login')) {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500));

      const { email, password } = config.data;

      // Verificar credenciales mock
      if (email === 'admin@guardiamitre.gob.ar' && password === 'admin123') {
        return Promise.reject({
          response: {
            data: {
              user: {
                id: '1',
                name: 'Administrador',
                email: 'admin@guardiamitre.gob.ar',
                role: 'ADMIN'
              },
              accessToken: 'mock_access_token',
              refreshToken: 'mock_refresh_token'
            }
          }
        });
      } else {
        return Promise.reject({
          response: {
            status: 401,
            data: {
              message: 'Credenciales inválidas'
            }
          }
        });
      }
    }
    return config;
  });
}

// Interceptor para agregar token de autenticación
apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
apiService.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    // Si es una respuesta mock exitosa, retornar los datos
    if (error.response?.data?.user) {
      return error.response.data;
    }

    if (error.response) {
      switch (error.response.status) {
        case 401:
          toast.error('Credenciales inválidas');
          break;
        case 403:
          toast.error('No tiene permisos para realizar esta acción');
          break;
        case 404:
          toast.error('Recurso no encontrado');
          break;
        case 422:
          toast.error('Datos inválidos');
          break;
        case 500:
          toast.error('Error del servidor. Por favor, intente más tarde');
          break;
        default:
          toast.error('Ha ocurrido un error');
      }
    } else if (error.request) {
      toast.error('No se pudo conectar con el servidor');
    }
    return Promise.reject(error);
  }
);
