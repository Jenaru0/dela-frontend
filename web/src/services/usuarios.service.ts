import { 
  UpdateUsuarioDto, 
  Usuario 
} from '../types/usuarios';
import { DireccionCliente } from '../types/direcciones';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ApiResponse<T> {
  mensaje: string;
  data: T;
}

class UsuariosService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Obtener perfil del usuario autenticado
  async obtenerPerfil(): Promise<ApiResponse<Usuario>> {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/me`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener el perfil');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      throw error;
    }  }

  // Actualizar perfil del usuario autenticado
  async actualizarPerfil(datos: Partial<Usuario>): Promise<ApiResponse<Usuario>> {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/me`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(datos),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el perfil');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw error;
    }
  }  // Obtener todos los usuarios (solo admin) - Maneja múltiples páginas
  async obtenerTodos(): Promise<ApiResponse<Usuario[]>> {
    try {
      let allUsers: Usuario[] = [];
      let currentPage = 1;
      let hasMorePages = true;
      const limit = 50; // Límite máximo por página

      while (hasMorePages) {
        const response = await fetch(`${API_BASE_URL}/usuarios?page=${currentPage}&limit=${limit}`, {
          method: 'GET',
          headers: this.getAuthHeaders(),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al obtener usuarios');
        }

        const pageData = await response.json();
        
        // Agregar usuarios de esta página
        allUsers = [...allUsers, ...pageData.data];
        
        // Verificar si hay más páginas
        hasMorePages = currentPage < pageData.totalPages;
        currentPage++;
      }

      // Retornar en el mismo formato que una página normal
      return {
        mensaje: 'Lista completa de usuarios obtenida correctamente.',
        data: allUsers
      };
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  }

  // Obtener usuarios con paginación (ADMIN) - Igual que productos
  async obtenerConPaginacion(page: number = 1, limit: number = 10, filtros: { search?: string } = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    // Agregar filtros que no sean undefined o vacíos
    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });

    const response = await fetch(`${API_BASE_URL}/usuarios?${params.toString()}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
      throw new Error(errorData.message || 'Error al obtener usuarios');
    }
    
    return response.json();
  }
  // ========== MÉTODOS DE ADMINISTRACIÓN ==========
  // Crear usuario (admin)
  async crear(datos: { email: string; nombres?: string; apellidos?: string; celular?: string; tipoUsuario?: 'CLIENTE' | 'ADMIN' }): Promise<ApiResponse<Usuario>> {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(datos),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear usuario');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  }

  // Obtener un usuario específico por ID (admin)
  async obtenerPorId(id: number): Promise<ApiResponse<Usuario & {
    direcciones?: DireccionCliente[];
    pedidos?: Record<string, unknown>[];
    resenas?: Record<string, unknown>[];
    reclamos?: Record<string, unknown>[];
  }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener usuario');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      throw error;
    }
  }

  // Actualizar usuario (admin)
  async actualizar(id: number, datos: UpdateUsuarioDto): Promise<ApiResponse<Usuario>> {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(datos),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar usuario');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  }
  // Activar/Desactivar usuario (admin)
  async cambiarEstado(id: number, activo: boolean): Promise<ApiResponse<Usuario>> {
    try {
      const endpoint = activo ? 'activar' : 'desactivar';
      const response = await fetch(`${API_BASE_URL}/usuarios/${id}/${endpoint}`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error al ${activo ? 'activar' : 'desactivar'} usuario`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      throw error;
    }
  }
  // Desactivar cuenta del usuario autenticado
  async desactivarCuenta(): Promise<ApiResponse<null>> {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/me/desactivar`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        let errorMessage = 'Error al desactivar cuenta';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.mensaje || errorMessage;
        } catch (parseError) {
          // Si no se puede parsear el JSON, usar mensaje por defecto
          console.warn('Error parsing error response:', parseError);
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al desactivar cuenta:', error);
      throw error;
    }
  }
  // Obtener estadísticas de usuarios (admin)
  async obtenerEstadisticas(): Promise<ApiResponse<{
    total: number;
    activos: number;
    inactivos: number;
    nuevosEsteMes: number;
    administradores: number;
  }>> {
    try {
      // Get all users first
      const usuariosResponse = await this.obtenerTodos();
      const usuarios = usuariosResponse.data || [];

      // Calculate statistics from the user data
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();      const stats = {
        total: usuarios.length,
        activos: usuarios.filter(usuario => usuario.activo !== false).length,
        inactivos: usuarios.filter(usuario => usuario.activo === false).length,
        nuevosEsteMes: usuarios.filter(usuario => {
          if (!usuario.creadoEn) return false;
          const createdDate = new Date(usuario.creadoEn);
          return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
        }).length,
        administradores: usuarios.filter(usuario => usuario.tipoUsuario === 'ADMIN').length
      };return {
        mensaje: 'Estadísticas obtenidas correctamente',
        data: stats
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }

  // Eliminar usuario (admin)
  async eliminar(id: number): Promise<ApiResponse<{ mensaje: string }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar usuario');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  }
}

export const usuariosService = new UsuariosService();
