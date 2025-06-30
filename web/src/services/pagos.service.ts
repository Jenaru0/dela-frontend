import { MetodoPago } from '@/types/enums';

export interface TipoIdentificacion {
  id: string;
  name: string;
  type: string;
  min_length: number;
  max_length: number;
}

export interface MetodoPagoMercadoPago {
  id: string;
  name: string;
  payment_type_id: string;
  status: string;
  secure_thumbnail: string;
  thumbnail: string;
  deferred_capture: string;
  settings: unknown[];
  additional_info_needed: string[];
  min_allowed_amount: number;
  max_allowed_amount: number;
  accreditation_time: number;
  financial_institutions: unknown[];
  processing_modes: string[];
}

export interface DatosTarjeta {
  numeroTarjeta: string;
  fechaExpiracion: string;
  codigoSeguridad: string;
  nombreTitular: string;
  tipoDocumento: string;
  numeroDocumento: string;
  email: string;
}

export interface CrearPagoDto {
  pedidoId: number;
  monto: number;
  metodoPago: MetodoPago;
  token?: string; // Token de MercadoPago para tarjeta
  datosTarjeta?: DatosTarjeta;
}

export interface RespuestaPago {
  id: number;
  pedidoId: number;
  monto: number;
  estado: string;
  metodoPago: string;
  referencia: string;
  mercadopagoId?: number;
  detallesPago?: unknown;
  creadoEn: string;
  actualizadoEn: string;
}

export interface ApiResponse<T> {
  mensaje: string;
  data: T;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class PagosService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Obtener métodos de pago disponibles
  async obtenerMetodosPago(): Promise<ApiResponse<MetodoPagoMercadoPago[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/pagos/metodos-pago`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener métodos de pago');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener métodos de pago:', error);
      throw error;
    }
  }

  // Obtener tipos de identificación
  async obtenerTiposIdentificacion(): Promise<ApiResponse<TipoIdentificacion[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/pagos/tipos-identificacion`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener tipos de identificación');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener tipos de identificación:', error);
      throw error;
    }
  }

  // Crear pago con tarjeta
  async crearPagoConTarjeta(datos: CrearPagoDto): Promise<ApiResponse<RespuestaPago>> {
    try {
      const response = await fetch(`${API_BASE_URL}/pagos/con-tarjeta`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(datos),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al procesar el pago');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al crear pago:', error);
      throw error;
    }
  }

  // Obtener estado de un pago
  async obtenerEstadoPago(pagoId: number): Promise<ApiResponse<RespuestaPago>> {
    try {
      const response = await fetch(`${API_BASE_URL}/pagos/${pagoId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener estado del pago');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener estado del pago:', error);
      throw error;
    }
  }
}

export const pagosService = new PagosService();
