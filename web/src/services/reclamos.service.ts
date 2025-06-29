import { EstadoReclamo, PrioridadReclamo, TipoReclamo } from '@/types/enums';

export interface Reclamo {
  id: number;
  usuarioId: number;
  pedidoId?: number;
  tipoReclamo: TipoReclamo;
  asunto: string;
  descripcion: string;
  estado: EstadoReclamo;
  prioridad: PrioridadReclamo;
  fechaCierre?: string;
  creadoEn: string;
  actualizadoEn: string;
  pedido?: {
    id: number;
    numero: string;
  };
  usuario?: {
    id: number;
    nombres: string;
    apellidos: string;
    email: string;
  };
  comentarios?: Array<{
    id: number;
    comentario: string;
    esInterno: boolean;
    creadoEn: string;
    usuario: {
      id: number;
      nombres: string;
      apellidos: string;
      tipoUsuario: string;
    };
  }>;
  _count?: {
    comentarios: number;
  };
}

export interface CreateReclamoDto {
  pedidoId?: number;
  asunto: string;
  descripcion: string;
}

export interface UpdateReclamoDto {
  asunto?: string;
  descripcion?: string;
  estado?: EstadoReclamo;
  prioridad?: PrioridadReclamo;
  tipoReclamo?: TipoReclamo;
}

export interface FiltrosReclamosDto {
  estado?: EstadoReclamo;
  prioridad?: PrioridadReclamo;
  fechaDesde?: string;
  fechaHasta?: string;
  page?: number;
  limit?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ApiResponse<T> {
  mensaje: string;
  data: T;
}

class ReclamosService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Crear nuevo reclamo
  async crear(datos: CreateReclamoDto): Promise<ApiResponse<Reclamo>> {
    try {
      const response = await fetch(`${API_BASE_URL}/reclamos`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(datos),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear reclamo');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al crear reclamo:', error);
      throw error;
    }
  }

  // Obtener mis reclamos
  async obtenerMisReclamos(): Promise<ApiResponse<Reclamo[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/reclamos/mis-reclamos`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener reclamos');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener reclamos:', error);
      throw error;
    }
  }

  // Obtener reclamo por ID
  async obtenerPorId(id: number): Promise<ApiResponse<Reclamo>> {
    try {
      const response = await fetch(`${API_BASE_URL}/reclamos/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener reclamo');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener reclamo:', error);
      throw error;
    }
  }
  // Obtener todos los reclamos (admin)
  async obtenerTodos(filtros?: FiltrosReclamosDto): Promise<ApiResponse<Reclamo[]>> {
    try {
      const params = new URLSearchParams();
      if (filtros) {
        Object.entries(filtros).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }

      const response = await fetch(`${API_BASE_URL}/reclamos/admin?${params.toString()}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener reclamos');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener reclamos:', error);
      throw error;
    }
  }

  // Obtener reclamos con paginación (admin)
  async obtenerConPaginacion(
    page: number = 1, 
    limit: number = 10,
    search?: string,
    estado?: EstadoReclamo,
    prioridad?: PrioridadReclamo,
    tipoReclamo?: TipoReclamo,
    fechaInicio?: string,
    fechaFin?: string
  ): Promise<{
    data: Reclamo[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      if (search) params.append('search', search);
      if (estado) params.append('estado', estado);
      if (prioridad) params.append('prioridad', prioridad);
      if (tipoReclamo) params.append('tipoReclamo', tipoReclamo);
      if (fechaInicio) params.append('fechaInicio', fechaInicio);
      if (fechaFin) params.append('fechaFin', fechaFin);

      const response = await fetch(`${API_BASE_URL}/reclamos/admin?${params.toString()}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener reclamos');
      }

      const result = await response.json();
      return {
        data: result.reclamos || result.data || [],
        total: result.total || 0,
        page: result.page || page,
        totalPages: result.totalPages || 1
      };
    } catch (error) {
      console.error('Error al obtener reclamos con paginación:', error);
      throw error;
    }
  }
  // Actualizar reclamo (admin)
  async actualizar(id: number, datos: UpdateReclamoDto): Promise<ApiResponse<Reclamo>> {
    try {
      const response = await fetch(`${API_BASE_URL}/reclamos/${id}`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(datos),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar reclamo');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al actualizar reclamo:', error);
      throw error;
    }
  }

  // Obtener estadísticas de reclamos (admin)
  async obtenerEstadisticas(): Promise<ApiResponse<{
    total: number;
    porEstado: { estado: EstadoReclamo; _count: { id: number } }[];
    porTipo: { tipoReclamo: TipoReclamo; _count: { id: number } }[];
    porPrioridad: { prioridad: PrioridadReclamo; _count: { id: number } }[];
  }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/reclamos/admin/estadisticas`, {
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
  // Agregar comentario a reclamo (admin)
  async agregarComentario(
    reclamoId: number, 
    comentario: string, 
    esInterno: boolean = false
  ): Promise<ApiResponse<{ id: number; comentario: string; esInterno: boolean; creadoEn: string }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/reclamos/${reclamoId}/comentarios`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ comentario, esInterno }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al agregar comentario');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al agregar comentario:', error);
      throw error;
    }
  }
}

export const reclamosService = new ReclamosService();
