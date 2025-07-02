import { API_BASE_URL } from '@/lib/api';

export interface Estadisticas {
  totalProductos: number;
  totalCategorias: number;
}

class EstadisticasService {
  async obtener(): Promise<Estadisticas> {
    try {
      const response = await fetch(`${API_BASE_URL}/catalogo/estadisticas`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener estadísticas');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }
}

export const estadisticasService = new EstadisticasService();
