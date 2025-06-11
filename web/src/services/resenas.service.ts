import { EstadoResena } from '@/types/enums';

export interface Resena {
  id: number;
  usuarioId: number;
  productoId: number;
  calificacion: number;
  comentario?: string;
  estado: EstadoResena;
  creadoEn: string;
  actualizadoEn: string;
  usuario: {
    nombres: string;
    apellidos: string;
  };
  producto: {
    id: number;
    nombre: string;
    imagen?: string;
  };
}

export interface CreateResenaDto {
  productoId: number;
  calificacion: number;
  comentario?: string;
}

export interface UpdateResenaDto {
  calificacion?: number;
  comentario?: string;
}

export interface FiltrosResenasDto {
  productoId?: number;
  calificacion?: number;
  estado?: EstadoResena;
  page?: number;
  limit?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ApiResponse<T> {
  mensaje: string;
  data: T;
}

class ResenasService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Crear nueva reseña
  async crear(datos: CreateResenaDto): Promise<ApiResponse<Resena>> {
    try {
      const response = await fetch(`${API_BASE_URL}/resenas`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(datos),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear reseña');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al crear reseña:', error);
      throw error;
    }
  }

  // Obtener mis reseñas
  async obtenerMisResenas(): Promise<ApiResponse<Resena[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/resenas/mis-resenas`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener reseñas');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener reseñas:', error);
      throw error;
    }
  }

  // Obtener reseñas por producto
  async obtenerPorProducto(productoId: number): Promise<ApiResponse<Resena[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/resenas/producto/${productoId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener reseñas del producto');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener reseñas del producto:', error);
      throw error;
    }
  }

  // Obtener reseña por ID
  async obtenerPorId(id: number): Promise<ApiResponse<Resena>> {
    try {
      const response = await fetch(`${API_BASE_URL}/resenas/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener reseña');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener reseña:', error);
      throw error;
    }
  }

  // Actualizar reseña
  async actualizar(id: number, datos: UpdateResenaDto): Promise<ApiResponse<Resena>> {
    try {
      const response = await fetch(`${API_BASE_URL}/resenas/${id}`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(datos),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar reseña');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al actualizar reseña:', error);
      throw error;
    }
  }

  // Eliminar reseña
  async eliminar(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await fetch(`${API_BASE_URL}/resenas/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar reseña');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al eliminar reseña:', error);
      throw error;
    }
  }

  // Obtener todas las reseñas (admin)
  async obtenerTodas(filtros?: FiltrosResenasDto): Promise<ApiResponse<Resena[]>> {
    try {
      const params = new URLSearchParams();
      if (filtros) {
        Object.entries(filtros).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }

      const response = await fetch(`${API_BASE_URL}/resenas?${params.toString()}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener reseñas');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener reseñas:', error);
      throw error;
    }
  }

  // Cambiar estado de reseña (admin)
  async cambiarEstado(id: number, estado: EstadoResena): Promise<ApiResponse<Resena>> {
    try {
      const response = await fetch(`${API_BASE_URL}/resenas/${id}/estado`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ estado }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cambiar estado de la reseña');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al cambiar estado de la reseña:', error);
      throw error;
    }
  }

  // Obtener estadísticas de reseñas (admin)
  async obtenerEstadisticas(): Promise<ApiResponse<{
    total: number;
    pendientes: number;
    aprobadas: number;
    rechazadas: number;
    promedioCalificacion: number;
  }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/resenas/estadisticas`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener estadísticas');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }
}

export const resenasService = new ResenasService();
