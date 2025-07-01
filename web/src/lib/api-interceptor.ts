/**
 * Interceptor global para manejo automático de tokens expirados
 * Se debe usar este fetch wrapper para todas las peticiones API autenticadas
 */

import { authService } from '@/services/auth.service';

// Wrapper para fetch que maneja automáticamente la renovación de tokens
export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  // Si no hay token, hacer petición normal
  const token = authService.getToken();
  if (!token) {
    return fetch(url, options);
  }

  // Usar authenticatedFetch del servicio de autenticación
  return authService.authenticatedFetch(url, options);
}

// Hook para React que maneja errores de autenticación
export function useApiErrorHandler() {
  const handleApiError = (error: Error | unknown) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('Sesión expirada')) {
      // El authService ya habrá limpiado los datos y disparado el evento
      // Solo necesitamos mostrar un mensaje al usuario si es necesario
      console.log('Usuario deslogueado debido a sesión expirada');
    }
  };

  return { handleApiError };
}
