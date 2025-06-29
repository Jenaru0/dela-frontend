import { API_BASE_URL } from '@/lib/api';
import { DireccionCliente, DireccionClienteConUsuario, CreateDireccionDto, UpdateDireccionDto, ApiResponse } from '@/types/direcciones';

class DireccionesService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Obtener todas las direcciones del usuario autenticado
  async obtenerDirecciones(): Promise<ApiResponse<DireccionCliente[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/direcciones`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener direcciones');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener direcciones:', error);
      throw error;
    }
  }

  // Crear nueva dirección
  async crearDireccion(datos: CreateDireccionDto): Promise<ApiResponse<DireccionCliente>> {
    try {
      const response = await fetch(`${API_BASE_URL}/direcciones`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(datos),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear dirección');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al crear dirección:', error);
      throw error;
    }
  }

  // Actualizar dirección
  async actualizarDireccion(id: number, datos: UpdateDireccionDto): Promise<ApiResponse<DireccionCliente>> {
    try {
      const response = await fetch(`${API_BASE_URL}/direcciones/${id}`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(datos),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar dirección');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al actualizar dirección:', error);
      throw error;
    }
  }

  // Eliminar dirección
  async eliminarDireccion(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/direcciones/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar dirección');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al eliminar dirección:', error);
      throw error;
    }
  }

  // Establecer dirección como predeterminada
  async establecerPredeterminada(id: number): Promise<ApiResponse<DireccionCliente>> {
    try {
      const response = await fetch(`${API_BASE_URL}/direcciones/${id}/predeterminada`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al establecer dirección predeterminada');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al establecer dirección predeterminada:', error);
      throw error;
    }
  }  // Admin: Obtener todas las direcciones de todos los usuarios
  async obtenerTodasAdmin(): Promise<ApiResponse<DireccionClienteConUsuario[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/direcciones/admin/todas`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener direcciones');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener direcciones admin:', error);
      throw error;
    }
  }

  // Admin: Obtener direcciones con paginación
  async obtenerConPaginacion(
    page: number = 1,
    limit: number = 10,
    filters: { search?: string } = {}
  ): Promise<{
    data: DireccionClienteConUsuario[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (filters.search) {
        searchParams.append('search', filters.search);
      }

      const response = await fetch(`${API_BASE_URL}/direcciones/admin/paginacion?${searchParams}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener direcciones');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener direcciones con paginación:', error);
      throw error;
    }
  }
  // Admin: Obtener estadísticas de direcciones
  async obtenerEstadisticas(): Promise<ApiResponse<{
    total: number;
    activas: number;
    inactivas: number;
    predeterminadas: number;
    porDepartamento: { [key: string]: number };
  }>>{
    try {
      const response = await fetch(`${API_BASE_URL}/direcciones/admin/estadisticas`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener estadísticas');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener estadísticas admin:', error);
      throw error;
    }
  }
}

export const direccionesService = new DireccionesService();
