import { EstadoPedido, MetodoPago, MetodoEnvio } from '@/types/enums';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface DetallePedido {
  id: number;
  productoId: number;
  cantidad: number;
  precio: number; // Este viene como precioUnitario del backend, mapeado a precio
  subtotal: number;
  producto: {
    id: number;
    nombre: string;
    imagen?: string; // URL de la imagen principal
    precio: number;
  };
}

export interface Pedido {
  id: number;
  numero: string;
  usuarioId: number;
  direccionId: number;
  estado: EstadoPedido;
  metodoPago: MetodoPago;
  metodoEnvio: MetodoEnvio;
  subtotal: number;
  impuestos: number;
  costoEnvio: number;
  descuento: number;
  total: number;
  promocionCodigo?: string;
  notasCliente?: string;
  notasInternas?: string;
  fechaPedido: string;
  fechaEntrega?: string;
  creadoEn: string;
  actualizadoEn: string;
  detalles: DetallePedido[];
  detallePedidos?: DetallePedido[]; // Alias for backwards compatibility
  direccion: {
    id: number;
    alias: string;
    direccion: string;
    ciudad: string;
    departamento: string;
  };
  usuario?: {
    id: number;
    nombres: string;
    apellidos: string;
    email: string;
  };
  pagos?: Array<{
    id: number;
    monto: number;
    estado: string;
    metodoPago: string;
    referencia: string;
    creadoEn: string;
  }>;
}

export interface CreatePedidoDto {
  direccionId: number;
  detalles: {
    productoId: number;
    cantidad: number;
  }[];
  metodoPago: MetodoPago;
  metodoEnvio: MetodoEnvio;
  promocionCodigo?: string;
  notasCliente?: string;
}

export interface FiltrosPedidosDto {
  estado?: EstadoPedido;
  fechaDesde?: string;
  fechaHasta?: string;
  metodoPago?: MetodoPago;
  page?: number;
  limit?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ApiResponse<T> {
  mensaje: string;
  data: T;
}

class PedidosService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Crear nuevo pedido
  async crear(datos: CreatePedidoDto): Promise<ApiResponse<Pedido>> {
    try {
      const response = await fetch(`${API_BASE_URL}/pedidos`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(datos),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear pedido');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al crear pedido:', error);
      throw error;
    }
  }

  // Obtener mis pedidos
  async obtenerMisPedidos(): Promise<ApiResponse<Pedido[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/pedidos/mis-pedidos`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener pedidos');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      throw error;
    }
  }

  // Obtener pedido por ID
  async obtenerPorId(id: number): Promise<ApiResponse<Pedido>> {
    try {
      const response = await fetch(`${API_BASE_URL}/pedidos/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener pedido');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener pedido:', error);
      throw error;
    }
  }

  // Obtener pedidos con paginación (ADMIN)
  async obtenerConPaginacion(
    page: number = 1,
    limit: number = 10,
    search?: string,
    estado?: EstadoPedido,
    fechaInicio?: string,
    fechaFin?: string,
  ): Promise<PaginatedResponse<Pedido>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (search) params.append('search', search);
      if (estado) params.append('estado', estado);
      if (fechaInicio) params.append('fechaInicio', fechaInicio);
      if (fechaFin) params.append('fechaFin', fechaFin);

      const response = await fetch(
        `${API_BASE_URL}/pedidos/admin/paginacion?${params}`,
        {
          method: 'GET',
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener pedidos');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener pedidos con paginación:', error);
      throw error;
    }
  }

  // Obtener todos los pedidos para admin (sin paginación)
  async obtenerTodosAdmin(): Promise<ApiResponse<Pedido[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/pedidos/admin/todos`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener pedidos');
      }      const result = await response.json();
      return {
        mensaje: 'Pedidos obtenidos correctamente',
        data: result.data || result
      };
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      throw error;
    }
  }

  // Obtener todos los pedidos (admin)
  async obtenerTodos(filtros?: FiltrosPedidosDto): Promise<ApiResponse<Pedido[]>> {
    try {
      const params = new URLSearchParams();
      if (filtros) {
        Object.entries(filtros).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }

      const response = await fetch(`${API_BASE_URL}/pedidos?${params.toString()}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener pedidos');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      throw error;
    }
  }  // Cambiar estado del pedido (admin)
  async cambiarEstado(id: number, estado: EstadoPedido, notasInternas?: string): Promise<ApiResponse<Pedido>> {
    try {
      const body: { estado: EstadoPedido; notasInternas?: string } = { estado };
      
      // Si se proporcionan notas internas, incluirlas en el cuerpo
      if (notasInternas !== undefined) {
        body.notasInternas = notasInternas;
      }
      
      const response = await fetch(`${API_BASE_URL}/pedidos/${id}/estado`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cambiar estado del pedido');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al cambiar estado del pedido:', error);
      throw error;
    }
  }
}

export const pedidosService = new PedidosService();
