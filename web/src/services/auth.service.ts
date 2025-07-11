import { 
  InicioSesionDto, 
  RegistroDto, 
  RespuestaInicioSesion, 
  RespuestaRegistro, 
  RespuestaLogout,
  RespuestaRefreshToken
} from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class AuthService {  private getAuthHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async registrar(datos: RegistroDto): Promise<RespuestaRegistro> {
    try {
      const response = await fetch(`${API_BASE_URL}/autenticacion/registro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el registro');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }

  async iniciarSesion(datos: InicioSesionDto): Promise<RespuestaInicioSesion> {
    try {
      const response = await fetch(`${API_BASE_URL}/autenticacion/inicio-sesion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el inicio de sesión');
      }

      const data = await response.json();
        // Guardar tokens en localStorage
      if (data.token_acceso && typeof window !== 'undefined') {
        localStorage.setItem('token', data.token_acceso);
        localStorage.setItem('refresh_token', data.refresh_token);
        
        // Extraer datos actualizados del JWT (por si el backend tiene datos más recientes)
        try {
          const userData = this.extractUserFromToken(data.token_acceso);
          if (userData) {
            localStorage.setItem('usuario', JSON.stringify(userData));
          } else {
            // Fallback a los datos que vienen en la respuesta
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
          }
        } catch (error) {
          console.error('Error al extraer datos del usuario del token:', error);
          // Fallback a los datos que vienen en la respuesta
          localStorage.setItem('usuario', JSON.stringify(data.usuario));
        }
      }

      return data;
    } catch (error) {
      console.error('Error en inicio de sesión:', error);
      throw error;
    }
  }

  async cerrarSesion(): Promise<RespuestaLogout> {
    try {
      const response = await this.authenticatedFetch(`${API_BASE_URL}/autenticacion/logout`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cerrar sesión');
      }

      // Limpiar localStorage
      this.limpiarDatos();

      return await response.json();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Limpiar localStorage incluso si hay error
      this.limpiarDatos();
      throw error;
    }
  }  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem('token');
    const usuario = localStorage.getItem('usuario');
    
    if (!token || !usuario) {
      return false;
    }    // Verificar si el token no está corrupto y el usuario es válido JSON
    try {
      JSON.parse(usuario);
      return true;
    } catch {
      // Si hay error al parsear, limpiar datos corruptos
      this.clearAuth();
      return false;
    }
  }  // Obtener token actual
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      // Aquí podrías agregar validación adicional del token si es necesario
      return token;
    } catch {
      return null;
    }
  }  // Obtener usuario actual del localStorage
  getCurrentUser() {
    if (typeof window === 'undefined') return null;
    
    try {
      const usuarioString = localStorage.getItem('usuario');
      if (!usuarioString) return null;
      
      const usuario = JSON.parse(usuarioString);
      
      // Validar que el usuario tiene las propiedades básicas necesarias
      if (!usuario.id || !usuario.email) {
        this.clearAuth();
        return null;
      }
      
      return usuario;
    } catch {
      this.clearAuth();
      return null;
    }
  }
  // Limpiar datos de autenticación
  clearAuth() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('usuario');
    }
  }  // Cambiar contraseña
  async cambiarContrasena(contrasenaActual: string, contrasenaNueva: string, confirmarContrasena: string): Promise<{ mensaje: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/autenticacion/cambiar-contrasena`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          contrasenaActual,
          nuevaContrasena: contrasenaNueva,
          confirmarContrasena,
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Error al cambiar la contraseña';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.mensaje || errorMessage;
        } catch (parseError) {
          console.warn('Error parsing error response:', parseError);
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      throw error;
    }
  }
  // Verificar si el token ha expirado (función opcional para futura implementación)
  isTokenExpired(): boolean {
    try {
      // Si implementas JWT, puedes decodificar y verificar la expiración
      // Por ahora, retornamos false ya que el backend manejará la expiración
      return false;
    } catch {
      return true;
    }
  }

  // Verificar la validez del token con el backend
  async verifyToken(): Promise<boolean> {
    try {
      const token = this.getToken();
      if (!token) return false;

      const response = await fetch(`${API_BASE_URL}/autenticacion/verify`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      // Si es 401, el token es inválido (no es error de red)
      if (response.status === 401) {
        return false;
      }

      // Para otros errores (500, error de red, etc.), lanzar excepción
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Error al verificar token:', error);
      // Re-lanzar el error para que el llamador pueda distinguir
      throw error;
    }
  }

  async renovarToken(): Promise<RespuestaRefreshToken> {
    try {
      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
      
      if (!refreshToken) {
        throw new Error('No hay refresh token disponible');
      }

      const response = await fetch(`${API_BASE_URL}/autenticacion/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Si el refresh token es inválido o expirado, limpiar todo
        if (response.status === 401) {
          this.limpiarDatos();
        }
        
        throw new Error(errorData.message || 'Error al renovar token');
      }

      const data = await response.json();
      
      // Guardar nuevos tokens
      if (data.token_acceso && typeof window !== 'undefined') {
        localStorage.setItem('token', data.token_acceso);
        localStorage.setItem('refresh_token', data.refresh_token);
        
        // Extraer datos del usuario del nuevo JWT y guardarlos
        try {
          const userData = this.extractUserFromToken(data.token_acceso);
          if (userData) {
            localStorage.setItem('usuario', JSON.stringify(userData));
          }
        } catch (error) {
          console.error('Error al extraer datos del usuario del token:', error);
        }
      }

      return data;
    } catch (error) {
      console.error('Error al renovar token:', error);
      throw error;
    }
  }

  private limpiarDatos(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('usuario');
    }
  }

  // Método para hacer peticiones autenticadas con renovación automática de token
  async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    try {
      let response = await fetch(url, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
      });

      // Si obtenemos un 401, intentar renovar el token y reintentar
      if (response.status === 401) {
        try {
          await this.renovarToken();
          
          // Reintentar la petición con el nuevo token
          response = await fetch(url, {
            ...options,
            headers: {
              ...this.getAuthHeaders(),
              ...options.headers,
            },
          });
          
          // Si sigue dando 401 después de renovar, la sesión debe cerrarse
          if (response.status === 401) {
            this.limpiarDatos();
            // Disparar evento para que el contexto se entere
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('auth:session-expired'));
            }
            throw new Error('Sesión expirada. Inicie sesión nuevamente.');
          }
        } catch {
          // Si la renovación falla, limpiar datos y lanzar error
          this.limpiarDatos();
          // Disparar evento para que el contexto se entere
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('auth:session-expired'));
          }
          throw new Error('Sesión expirada. Inicie sesión nuevamente.');
        }
      }

      return response;
    } catch (error) {
      // Si es un error de red (fetch falló), podría ser que el backend se reinició
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Error de conexión. El servidor podría estar reiniciando. Intenta nuevamente en unos momentos.');
      }
      
      // Re-lanzar otros errores
      throw error;
    }
  }

  // Verificar si el backend está disponible (para casos de reinicios)
  async checkBackendConnectivity(): Promise<boolean> {
    try {
      // Usar un endpoint que existe - verify token
      const response = await fetch(`${API_BASE_URL}/autenticacion/verify`, {
        method: 'POST',
        headers: {
          ...this.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        // Timeout más corto para verificación de conectividad
        signal: AbortSignal.timeout(3000),
      });

      // Si es 401, el backend está funcionando (token inválido es ok para conectividad)
      // Si es 200, también está funcionando
      return response.status === 200 || response.status === 401;
    } catch {
      return false;
    }
  }

  // Extraer datos del usuario del JWT
  private extractUserFromToken(token: string): { id: number; email: string; nombres: string; apellidos: string; celular: string; tipoUsuario: string; activo: boolean } | null {
    try {
      // Decodificar el JWT (solo la parte payload, sin verificar la firma)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const payload = JSON.parse(jsonPayload);
      
      // Convertir el payload a formato de usuario
      return {
        id: payload.sub,
        email: payload.email,
        nombres: payload.nombres || '',
        apellidos: payload.apellidos || '',
        celular: payload.celular || '',
        tipoUsuario: payload.tipoUsuario,
        activo: payload.activo,
      };
    } catch (error) {
      console.error('Error al decodificar JWT:', error);
      return null;
    }
  }
}

export const authService = new AuthService();
