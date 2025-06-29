import { API_BASE_URL } from '@/lib/api';

export interface ApiResponse<T> {
  mensaje: string;
  data: T;
}

export interface UserActivity {
  direcciones: UserAddress[];
  pedidos: UserOrder[];
  reclamos: UserClaim[];
  reviews: UserReview[];
  favoritos: UserFavorite[];
}

export interface UserAddress {
  id: number;
  alias: string;
  direccion: string;
  distrito: string;
  provincia: string;
  codigoPostal?: string;
  referencia?: string;
  predeterminada: boolean;
  activa: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

export interface UserOrder {
  id: number;
  numero: string;
  usuarioId: number;
  subtotal: number;
  impuestos: number;
  envioMonto: number;
  descuentoMonto: number;
  total: number;
  promocionCodigo?: string;
  estado: 'PENDIENTE' | 'CONFIRMADO' | 'PROCESANDO' | 'ENVIADO' | 'ENTREGADO' | 'CANCELADO';
  metodoPago: 'TARJETA_CREDITO' | 'TARJETA_DEBITO' | 'TRANSFERENCIA' | 'EFECTIVO' | 'YAPE' | 'PLIN';
  metodoEnvio: 'DELIVERY' | 'RECOJO_TIENDA';
  fechaPedido: string;
  fechaEntrega?: string;
  notasCliente?: string;
  notasInternas?: string;
  creadoEn: string;
  actualizadoEn: string;
  detallePedidos?: OrderItem[];
}

export interface OrderItem {
  id: number;
  pedidoId: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  producto: {
    id: number;
    nombre: string;
    sku: string;
    slug: string;
  };
}

export interface UserClaim {
  id: number;
  usuarioId: number;
  pedidoId?: number;
  asunto: string;
  descripcion: string;
  estado: 'ABIERTO' | 'EN_PROCESO' | 'RESUELTO' | 'RECHAZADO';
  tipoReclamo: 'DEMORA_ENTREGA' | 'PRODUCTO_DEFECTUOSO' | 'PEDIDO_INCOMPLETO' | 'COBRO_INCORRECTO' | 'SOLICITUD_CANCELACION' | 'SERVICIO_CLIENTE' | 'OTRO';
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  fechaCierre?: string;
  creadoEn: string;
  actualizadoEn: string;
  pedido?: {
    numero: string;
  };
}

export interface UserReview {
  id: number;
  usuarioId: number;
  productoId: number;
  calificacion: number;
  comentario?: string;
  estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
  creadoEn: string;
  actualizadoEn: string;
  producto: {
    id: number;
    nombre: string;
    slug: string;
  };
}

export interface UserFavorite {
  usuarioId: number;
  productoId: number;
  creadoEn: string;
  producto: {
    id: number;
    nombre: string;
    slug: string;
    precioUnitario: number;
    imagenes: Array<{
      id: number;
      url: string;
      altText?: string;
      principal: boolean;
    }>;
  };
}

class AdminService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Obtener actividad completa de un usuario (para admin)
  async obtenerActividadUsuario(userId: number): Promise<ApiResponse<UserActivity>> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/usuarios/${userId}/actividad`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener actividad del usuario');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener actividad del usuario:', error);
      throw error;
    }
  }

  // Obtener direcciones de un usuario (para admin)
  async obtenerDireccionesUsuario(userId: number): Promise<ApiResponse<UserAddress[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/usuarios/${userId}/direcciones`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener direcciones del usuario');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener direcciones del usuario:', error);
      throw error;
    }
  }

  // Obtener pedidos de un usuario (para admin)
  async obtenerPedidosUsuario(userId: number): Promise<ApiResponse<UserOrder[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/usuarios/${userId}/pedidos`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener pedidos del usuario');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener pedidos del usuario:', error);
      throw error;
    }
  }

  // Obtener reclamos de un usuario (para admin)
  async obtenerReclamosUsuario(userId: number): Promise<ApiResponse<UserClaim[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/usuarios/${userId}/reclamos`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener reclamos del usuario');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener reclamos del usuario:', error);
      throw error;
    }
  }

  // Obtener reseñas de un usuario (para admin)
  async obtenerReviewsUsuario(userId: number): Promise<ApiResponse<UserReview[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/usuarios/${userId}/reviews`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener reseñas del usuario');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener reseñas del usuario:', error);
      throw error;
    }
  }

  // Obtener favoritos de un usuario (para admin)
  async obtenerFavoritosUsuario(userId: number): Promise<ApiResponse<UserFavorite[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/usuarios/${userId}/favoritos`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener favoritos del usuario');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener favoritos del usuario:', error);
      throw error;
    }
  }
}

export const adminService = new AdminService();
