import { authService } from '@/services/auth.service';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Tipos para la API
interface ApiErrorData {
  message?: string;
  [key: string]: unknown;
}

// Clase para manejar errores de API
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: ApiErrorData
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Función helper para realizar peticiones con manejo automático de errores
export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Agregar headers de autenticación si están disponibles
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  const token = authService.getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Si la respuesta es 401, limpiar la sesión automáticamente
    if (response.status === 401) {
      authService.clearAuth();
      // Recargar la página para que el AuthContext se actualice
      window.location.reload();
      throw new ApiError('Sesión expirada', 401);
    }

    // Si la respuesta no es exitosa, lanzar error
    if (!response.ok) {      let errorData: ApiErrorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: 'Error desconocido' };
      }
      
      throw new ApiError(
        errorData.message || `Error HTTP ${response.status}`,
        response.status,
        errorData
      );
    }

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Error de red o conexión
    throw new ApiError('Error de conexión', 0);
  }
}

// Helper para peticiones GET
export async function apiGet<T = unknown>(endpoint: string): Promise<T> {
  const response = await apiRequest(endpoint, { method: 'GET' });
  return response.json();
}

// Helper para peticiones POST
export async function apiPost<T = unknown>(endpoint: string, data: unknown): Promise<T> {
  const response = await apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.json();
}

// Helper para peticiones PUT
export async function apiPut<T = unknown>(endpoint: string, data: unknown): Promise<T> {
  const response = await apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.json();
}

// Helper para peticiones DELETE
export async function apiDelete<T = unknown>(endpoint: string): Promise<T> {
  const response = await apiRequest(endpoint, { method: 'DELETE' });
  return response.json();
}
