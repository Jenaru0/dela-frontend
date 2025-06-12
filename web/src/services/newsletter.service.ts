const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://delabackend.episundc.pe';

export interface ApiResponse<T> {
  mensaje: string;
  data: T;
}

export interface Newsletter {
  id: number;
  email: string;
  activo: boolean;
  creadoEn: string;
}

class NewsletterService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Suscribirse al newsletter
  async suscribirse(email: string): Promise<ApiResponse<Newsletter>> {
    try {
      const response = await fetch(`${API_BASE_URL}/newsletter/suscribir`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || 'Error al suscribirse al newsletter'
        );
      }

      return await response.json();
    } catch (error) {
      console.error('Error al suscribirse al newsletter:', error);
      throw error;
    }
  }

  // Desuscribirse del newsletter
  async desuscribirse(email: string): Promise<ApiResponse<null>> {
    try {
      const response = await fetch(`${API_BASE_URL}/newsletter/desuscribir`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || 'Error al desuscribirse del newsletter'
        );
      }

      return await response.json();
    } catch (error) {
      console.error('Error al desuscribirse del newsletter:', error);
      throw error;
    }
  }

  // Verificar si un email está suscrito
  async verificarSuscripcion(
    email: string
  ): Promise<ApiResponse<{ suscrito: boolean }>> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/newsletter/verificar/${encodeURIComponent(email)}`,
        {
          method: 'GET',
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al verificar suscripción');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al verificar suscripción:', error);
      throw error;
    }
  }

  // Admin: Obtener todos los suscriptores
  async obtenerTodos(): Promise<ApiResponse<Newsletter[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/newsletter/admin/todos`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener suscriptores');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener suscriptores:', error);
      throw error;
    }
  }

  // Admin: Obtener estadísticas
  async obtenerEstadisticas(): Promise<
    ApiResponse<{
      total: number;
      activos: number;
      inactivos: number;
      nuevosEsteMes: number;
    }>
  > {
    try {
      const response = await fetch(
        `${API_BASE_URL}/newsletter/admin/estadisticas`,
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
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }

  // Admin: Cambiar estado de suscriptor
  async cambiarEstado(
    id: number,
    activo: boolean
  ): Promise<ApiResponse<Newsletter>> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/newsletter/admin/${id}/estado`,
        {
          method: 'PATCH',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ activo }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cambiar estado');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      throw error;
    }
  }

  // Admin: Eliminar suscriptor
  async eliminar(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await fetch(`${API_BASE_URL}/newsletter/admin/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar suscriptor');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al eliminar suscriptor:', error);
      throw error;
    }
  }
}

export const newsletterService = new NewsletterService();
