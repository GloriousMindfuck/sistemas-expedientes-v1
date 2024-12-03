import { apiService } from './api';
import { z } from 'zod';

const LoginResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    role: z.enum(['ADMIN', 'USER', 'VIEWER'])
  }),
  accessToken: z.string(),
  refreshToken: z.string()
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await apiService.post<LoginResponse>('/auth/login', { 
        email, 
        password 
      });

      const validatedResponse = LoginResponseSchema.parse(response);

      // Almacenar tokens y datos de usuario
      localStorage.setItem('auth_token', validatedResponse.accessToken);
      localStorage.setItem('refresh_token', validatedResponse.refreshToken);
      localStorage.setItem('user', JSON.stringify(validatedResponse.user));

      return validatedResponse;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Inicio de sesión fallido');
    }
  },

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }
};
