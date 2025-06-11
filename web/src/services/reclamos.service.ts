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
  respuesta?: string;
  fechaRespuesta?: string;
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
}

export interface CreateReclamoDto {
  pedidoId?: number;
  asunto: string;
  descripcion: string;
}

export interface UpdateReclamoDto {
  estado?: EstadoReclamo;
  prioridad?: PrioridadReclamo;
  respuesta?: string;
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

      const response = await fetch(`${API_BASE_URL}/reclamos?${params.toString()}`, {
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
}

export const reclamosService = new ReclamosService();
