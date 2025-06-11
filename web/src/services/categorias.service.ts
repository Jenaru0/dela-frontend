import { API_BASE_URL } from '@/lib/api';

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  slug: string;
  activo: boolean;
  creadoEn: string;
  _count?: {
    productos: number;
  };
}

export interface CreateCategoriaDto {
  nombre: string;
  descripcion?: string;
  slug?: string;
  activo?: boolean;
}

export interface UpdateCategoriaDto {
  nombre?: string;
  descripcion?: string;
  slug?: string;
  activo?: boolean;
}

export interface ApiResponse<T> {
  mensaje: string;
  data: T;
}

class CategoriasService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }  // Obtener todas las categorías
  async obtenerTodas(): Promise<ApiResponse<Categoria[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/categorias`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener categorías');
      }

      const categorias = await response.json();
      // Backend returns array directly, not wrapped in ApiResponse
      return {
        mensaje: 'Categorías obtenidas correctamente',
        data: categorias
      };
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw error;
    }
  }  // Obtener todas las categorías (solo activas para público)
  async obtenerActivas(): Promise<ApiResponse<Categoria[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/categorias`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener categorías activas');
      }      const categorias = await response.json();
      // Filter only active categories on frontend for now
      const activeCategorias = categorias.filter((cat: Categoria) => cat.activo);
      return {
        mensaje: 'Categorías activas obtenidas correctamente',
        data: activeCategorias
      };
    } catch (error) {
      console.error('Error al obtener categorías activas:', error);
      throw error;
    }
  }  // Obtener categoría por ID
  async obtenerPorId(id: number): Promise<ApiResponse<Categoria>> {
    try {
      const response = await fetch(`${API_BASE_URL}/categorias/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener categoría');
      }

      const categoria = await response.json();
      return {
        mensaje: 'Categoría obtenida correctamente',
        data: categoria
      };
    } catch (error) {
      console.error('Error al obtener categoría:', error);
      throw error;
    }
  }  // Crear nueva categoría (ADMIN)
  async crear(datos: CreateCategoriaDto): Promise<ApiResponse<Categoria>> {
    try {
      const response = await fetch(`${API_BASE_URL}/categorias`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(datos),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear categoría');
      }

      const categoria = await response.json();
      return {
        mensaje: 'Categoría creada correctamente',
        data: categoria
      };
    } catch (error) {
      console.error('Error al crear categoría:', error);
      throw error;
    }
  }  // Actualizar categoría (ADMIN)
  async actualizar(id: number, datos: UpdateCategoriaDto): Promise<ApiResponse<Categoria>> {
    try {
      const response = await fetch(`${API_BASE_URL}/categorias/${id}`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(datos),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar categoría');
      }

      const categoria = await response.json();
      return {
        mensaje: 'Categoría actualizada correctamente',
        data: categoria
      };
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      throw error;
    }
  }  // Eliminar categoría (ADMIN)
  async eliminar(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/categorias/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar categoría');
      }

      return {
        mensaje: 'Categoría eliminada correctamente',
        data: undefined as void
      };
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      throw error;
    }
  }// Cambiar orden de categorías (ADMIN) - Not implemented in backend yet
  async cambiarOrden(): Promise<ApiResponse<void>> {
    // For now, just return a success response since backend doesn't support this
    return Promise.resolve({
      mensaje: 'Reordenamiento no implementado en el backend',
      data: undefined as void
    });
  }  // Activar/Desactivar categoría (ADMIN)
  async cambiarEstado(id: number, activo: boolean): Promise<ApiResponse<Categoria>> {
    try {
      const response = await fetch(`${API_BASE_URL}/categorias/${id}`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ activo }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cambiar estado de categoría');
      }

      const categoria = await response.json();
      return {
        mensaje: 'Estado de categoría actualizado correctamente',
        data: categoria
      };
    } catch (error) {
      console.error('Error al cambiar estado de categoría:', error);
      throw error;
    }
  }
}

export const categoriasService = new CategoriasService();
