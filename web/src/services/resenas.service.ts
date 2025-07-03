import { EstadoResena } from '@/types/enums';

interface EstadisticaEstado {
  estado: string;
  _count: {
    id: number;
  };
}

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
    const userString = localStorage.getItem('user');
    let user = null;
    
    try {
      user = userString ? JSON.parse(userString) : null;
    } catch (e) {
      console.error('Error parsing user from localStorage:', e);
    }
    
    console.log('🔐 Token found:', token ? 'Sí' : 'No');
    console.log('👤 User data:', user);
    console.log('🛡️ User type:', user?.tipoUsuario);
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
    
    console.log('📋 Headers:', headers);
    return headers;
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

      const result = await response.json();
      return result;
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

  // Obtener reseñas aprobadas de un producto (público)
  async obtenerAprobadasPorProducto(productoId: number, limit: number = 3): Promise<ApiResponse<Resena[]>> {
    try {
      const url = `${API_BASE_URL}/resenas/producto/${productoId}?estado=APROBADO&limit=${limit}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener reseñas del producto');
      }

      const result = await response.json();
      
      // Intentemos con diferentes estructuras de respuesta
      let resenas = [];
      
      if (result.data && Array.isArray(result.data)) {
        resenas = result.data;
      } else if (Array.isArray(result)) {
        resenas = result;
      } else if (result.resenas && Array.isArray(result.resenas)) {
        resenas = result.resenas;
      } else {
        resenas = [];
      }

      // Filtrar solo aprobadas y ordenar por calificación
      const resenasAprobadas = resenas
        .filter((resena: Resena) => resena.estado === 'APROBADO')
        .sort((a: Resena, b: Resena) => b.calificacion - a.calificacion)
        .slice(0, limit);
      
      return {
        mensaje: result.mensaje || 'Reseñas obtenidas correctamente',
        data: resenasAprobadas
      };
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
      console.log('🔍 ResenasService: Obteniendo todas las reseñas...');
      const params = new URLSearchParams();
      if (filtros) {
        Object.entries(filtros).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }

      const url = `${API_BASE_URL}/resenas/admin?${params.toString()}`;
      console.log('🌐 URL:', url);
      console.log('🔑 Headers:', this.getAuthHeaders());

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Error response:', errorData);
        throw new Error(errorData.message || 'Error al obtener reseñas');
      }

      const result = await response.json();
      console.log('✅ Response data:', result);
      
      // El backend devuelve { resenas, total, page, totalPages }
      // Ajustamos para que sea compatible con la interfaz ApiResponse<Resena[]>
      return {
        mensaje: 'Reseñas obtenidas correctamente',
        data: result.resenas || []
      };
    } catch (error) {
      console.error('Error al obtener reseñas:', error);
      throw error;
    }
  }

  // Cambiar estado de reseña (admin)
  async cambiarEstado(id: number, estado: EstadoResena): Promise<ApiResponse<Resena>> {
    try {
      const response = await fetch(`${API_BASE_URL}/resenas/${id}`, {
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
      console.log('📈 ResenasService: Obteniendo estadísticas...');
      const url = `${API_BASE_URL}/resenas/admin/estadisticas`;
      console.log('🌐 Estadísticas URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      console.log('📊 Estadísticas status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Error estadísticas:', errorData);
        throw new Error(errorData.message || 'Error al obtener estadísticas');
      }

      const result = await response.json();
      console.log('✅ Estadísticas data:', result);
      
      // Transformar los datos del backend al formato esperado por el frontend
      const porEstado = result.porEstado || [];
      const estadisticas = {
        total: result.total || 0,
        pendientes: porEstado.find((s: EstadisticaEstado) => s.estado === 'PENDIENTE')?._count?.id || 0,
        aprobadas: porEstado.find((s: EstadisticaEstado) => s.estado === 'APROBADO')?._count?.id || 0,
        rechazadas: porEstado.find((s: EstadisticaEstado) => s.estado === 'RECHAZADO')?._count?.id || 0,
        promedioCalificacion: result.promedioGeneral || 0
      };

      return {
        mensaje: 'Estadísticas obtenidas correctamente',
        data: estadisticas
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }
}

export const resenasService = new ResenasService();

// Exportar funciones específicas para facilitar el uso
export const obtenerResenasAprobadas = (productoId: number, limit?: number) => 
  resenasService.obtenerAprobadasPorProducto(productoId, limit);
