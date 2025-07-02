import { API_BASE_URL } from '@/lib/api';
import { DireccionValidada, VerificacionCobertura, ApiResponse } from '@/types/direcciones';

class GeocodingService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  /**
   * Buscar direcciones con autocompletado
   */
  async buscarDirecciones(query: string, limit: number = 5): Promise<DireccionValidada[]> {
    try {
      if (!query || query.trim().length < 3) {
        return [];
      }

      const params = new URLSearchParams({
        q: query.trim(),
        limit: limit.toString(),
      });

      const response = await fetch(`${API_BASE_URL}/geocoding/search?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al buscar direcciones');
      }

      const data: ApiResponse<DireccionValidada[]> = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error al buscar direcciones:', error);
      return [];
    }
  }

  /**
   * Validar una dirección específica
   */
  async validarDireccion(direccion: string): Promise<{ data: DireccionValidada | null; esValida: boolean }> {
    try {
      if (!direccion || direccion.trim().length < 5) {
        return { data: null, esValida: false };
      }

      const params = new URLSearchParams({
        address: direccion.trim(),
      });

      const response = await fetch(`${API_BASE_URL}/geocoding/validate?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al validar dirección');
      }

      const data = await response.json();
      return {
        data: data.data,
        esValida: data.esValida || false,
      };
    } catch (error) {
      console.error('Error al validar dirección:', error);
      return { data: null, esValida: false };
    }
  }

  /**
   * Geocodificación inversa - obtener dirección desde coordenadas
   */
  async obtenerDireccionDesdeCoordenadas(latitud: number, longitud: number): Promise<DireccionValidada | null> {
    try {
      const params = new URLSearchParams({
        lat: latitud.toString(),
        lng: longitud.toString(),
      });

      const response = await fetch(`${API_BASE_URL}/geocoding/reverse?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en geocodificación inversa');
      }

      const data: ApiResponse<DireccionValidada> = await response.json();
      return data.data || null;
    } catch (error) {
      console.error('Error en geocodificación inversa:', error);
      return null;
    }
  }

  /**
   * Verificar cobertura en una ubicación
   */
  async verificarCobertura(latitud: number, longitud: number): Promise<VerificacionCobertura> {
    try {
      const params = new URLSearchParams({
        lat: latitud.toString(),
        lng: longitud.toString(),
      });

      const response = await fetch(`${API_BASE_URL}/geocoding/coverage?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al verificar cobertura');
      }

      const data = await response.json();
      return {
        tieneCobertura: data.tieneCobertura || false,
        coordenadas: data.coordenadas || { latitud, longitud },
        mensaje: data.mensaje || 'Verificación completada',
      };
    } catch (error) {
      console.error('Error al verificar cobertura:', error);
      return {
        tieneCobertura: false,
        coordenadas: { latitud, longitud },
        mensaje: 'Error al verificar cobertura',
      };
    }
  }

  /**
   * Debounced search para autocompletado
   */
  private searchTimeouts: Map<string, NodeJS.Timeout> = new Map();

  async buscarDireccionesDebounced(
    query: string,
    callback: (direcciones: DireccionValidada[]) => void,
    delay: number = 300
  ): Promise<void> {
    // Cancelar búsqueda anterior
    const timeoutId = this.searchTimeouts.get('search');
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Programar nueva búsqueda
    const newTimeoutId = setTimeout(async () => {
      const direcciones = await this.buscarDirecciones(query);
      callback(direcciones);
      this.searchTimeouts.delete('search');
    }, delay);

    this.searchTimeouts.set('search', newTimeoutId);
  }

  /**
   * Obtener ubicación actual del usuario
   */
  async obtenerUbicacionActual(): Promise<{ latitud: number; longitud: number } | null> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Tu navegador no soporta geolocalización'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitud: position.coords.latitude,
            longitud: position.coords.longitude,
          });
        },
        (error) => {
          let errorMessage = 'No se pudo obtener tu ubicación actual';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Permiso de ubicación denegado. Habilita la geolocalización en tu navegador.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Información de ubicación no disponible.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Tiempo de espera agotado al obtener ubicación.';
              break;
          }
          
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000, // Aumentar timeout a 15 segundos
          maximumAge: 60000, // 1 minuto
        }
      );
    });
  }

  /**
   * Calcular distancia entre dos puntos (en kilómetros)
   */
  calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(valor: number): number {
    return valor * (Math.PI / 180);
  }
}

export const geocodingService = new GeocodingService();
