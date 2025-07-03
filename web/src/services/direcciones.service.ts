import { API_BASE_URL } from '@/lib/api';
import {
  DireccionCliente,
  DireccionClienteConUsuario,
  CreateDireccionDto,
  UpdateDireccionDto,
  ApiResponse,
} from '@/types/direcciones';

class DireccionesService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Validar que un número sea válido o devolver undefined
  private validarNumero(
    valor: number | string | null | undefined
  ): number | undefined {
    if (valor === null || valor === undefined || valor === '') {
      return undefined;
    }

    const numero =
      typeof valor === 'string' ? parseFloat(valor) : Number(valor);

    if (isNaN(numero) || !isFinite(numero)) {
      return undefined;
    }

    return numero;
  }

  // Validar coordenadas geográficas
  private validarCoordenadas(
    latitud?: number,
    longitud?: number
  ): { latitud?: number; longitud?: number } {
    const result: { latitud?: number; longitud?: number } = {};

    if (latitud !== undefined) {
      const lat = this.validarNumero(latitud);
      if (lat !== undefined && lat >= -90 && lat <= 90) {
        result.latitud = lat;
      }
    }

    if (longitud !== undefined) {
      const lng = this.validarNumero(longitud);
      if (lng !== undefined && lng >= -180 && lng <= 180) {
        result.longitud = lng;
      }
    }

    return result;
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

  // Crear nueva dirección - VERSIÓN SIMPLIFICADA
  async crearDireccion(
    datos: CreateDireccionDto
  ): Promise<ApiResponse<DireccionCliente>> {
    try {
      console.log('🔧 Enviando datos originales:', datos);

      // SOLUCIÓN RÁPIDA: Solo enviar campos obligatorios
      const datosMinimos = {
        direccion: datos.direccion,
        departamento: datos.departamento || 'Lima',
        provincia: datos.provincia || 'Lima',
        distrito: datos.distrito || 'Lima',
        alias: datos.alias || '',
        predeterminada: datos.predeterminada || false,
        // Sin coordenadas ni campos opcionales que puedan causar problemas
      };

      console.log('🔧 Enviando solo datos mínimos:', datosMinimos);

      const response = await fetch(`${API_BASE_URL}/direcciones`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(datosMinimos),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔧 Error del servidor (texto):', errorText);

        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = {
            message: 'Error del servidor',
            status: response.status,
          };
        }

        throw new Error(
          errorData.message || `Error ${response.status}: ${errorText}`
        );
      }

      const result = await response.json();
      console.log('🔧 ¡Dirección creada exitosamente!', result);
      return result;
    } catch (error) {
      console.error('🔧 Error al crear dirección:', error);
      throw error;
    }
  }

  // Actualizar dirección
  async actualizarDireccion(
    id: number,
    datos: UpdateDireccionDto
  ): Promise<ApiResponse<DireccionCliente>> {
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
  async establecerPredeterminada(
    id: number
  ): Promise<ApiResponse<DireccionCliente>> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/direcciones/${id}/predeterminada`,
        {
          method: 'PATCH',
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || 'Error al establecer dirección predeterminada'
        );
      }

      return await response.json();
    } catch (error) {
      console.error('Error al establecer dirección predeterminada:', error);
      throw error;
    }
  } // Admin: Obtener todas las direcciones de todos los usuarios
  async obtenerTodasAdmin(): Promise<
    ApiResponse<DireccionClienteConUsuario[]>
  > {
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

      const response = await fetch(
        `${API_BASE_URL}/direcciones/admin/paginacion?${searchParams}`,
        {
          method: 'GET',
          headers: this.getAuthHeaders(),
        }
      );

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
  async obtenerEstadisticas(): Promise<
    ApiResponse<{
      total: number;
      activas: number;
      inactivas: number;
      predeterminadas: number;
      porDepartamento: { [key: string]: number };
    }>
  > {
    try {
      const response = await fetch(
        `${API_BASE_URL}/direcciones/admin/estadisticas`,
        {
          method: 'GET',
          headers: this.getAuthHeaders(),
        }
      );

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
