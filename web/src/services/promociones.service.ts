import { apiGet, apiPost } from '@/lib/api';

export interface Promocion {
  id: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  tipo: 'PORCENTAJE' | 'MONTO_FIJO' | 'ENVIO_GRATIS' | 'PRODUCTO_GRATIS';
  valor: number;
  montoMinimo?: number;
  usoMaximo?: number;
  usoActual: number;
  activo: boolean;
  inicioValidez: string;
  finValidez: string;
  creadoEn: string;
  actualizadoEn: string;
}

export interface ValidarPromocionResponse {
  valid: boolean;
  promocion?: Promocion;
  message?: string;
}

export interface CalcularDescuentoResponse {
  promocion: Promocion;
  descuento: number;
}

export const promocionesService = {
  async validarPromocion(codigo: string, montoCompra?: number): Promise<ValidarPromocionResponse> {
    try {
      const params = new URLSearchParams();
      if (montoCompra !== undefined) {
        params.append('montoCompra', montoCompra.toString());
      }
      
      const response = await apiGet<Promocion>(`/promociones/validar/${codigo}?${params.toString()}`);
      return {
        valid: true,
        promocion: response,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Código de promoción no válido';
      return {
        valid: false,
        message: errorMessage,
      };
    }
  },

  async calcularDescuento(codigo: string, subtotal: number): Promise<CalcularDescuentoResponse> {
    const response = await apiPost<CalcularDescuentoResponse>(`/promociones/calcular-descuento`, {
      codigo,
      subtotal,
    });
    return response;
  },

  async obtenerPromociones(vigente: boolean = true): Promise<Promocion[]> {
    const params = new URLSearchParams();
    if (vigente) {
      params.append('vigente', 'true');
    }
    
    const response = await apiGet<Promocion[]>(`/promociones?${params.toString()}`);
    return response;
  },
};
