import { EstadoPedido, MetodoPago, MetodoEnvio } from '@/types/enums';
import { authService } from './auth.service';

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
  precioUnitario: number;
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
  envioMonto: number; // Cambié de costoEnvio a envioMonto para coincidir con Prisma
  descuentoMonto: number; // Cambié de descuento a descuentoMonto
  total: number;
  promocionCodigo?: string;
  notasCliente?: string;
  notasInternas?: string;
  fechaPedido: string;
  fechaEntrega?: string;
  creadoEn: string;
  actualizadoEn: string;
  detallePedidos: DetallePedido[]; // Cambié de detalles a detallePedidos
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
  usuarioId: number;
  direccionId: number | null; // null para recojo en tienda
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
      const response = await authService.authenticatedFetch(`${API_BASE_URL}/pedidos/${id}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener pedido');
      }

      const data = await response.json();
      return data;
    } catch (error) {
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
    fechaFin?: string
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
  }  // Obtener todos los pedidos para admin (sin paginación)
  async obtenerTodosAdmin(): Promise<ApiResponse<Pedido[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/pedidos/admin/todos`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }
        throw new Error(errorData.message || 'Error al obtener pedidos');
      }
      
      let result;
      try {
        result = await response.json();
      } catch {
        throw new Error('Error al procesar la respuesta del servidor');
      }
      
      // El backend ya devuelve el formato correcto {mensaje, data}
      return result;
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      throw error;
    }
  }// Obtener todos los pedidos (admin)
  async obtenerTodos(
    filtros?: FiltrosPedidosDto
  ): Promise<ApiResponse<Pedido[]>> {
    try {
      // Construir URL base
      let url = `${API_BASE_URL}/pedidos`;

      // Solo agregar parámetros si hay filtros válidos
      if (filtros) {
        const params = new URLSearchParams();

        // Manejar cada filtro de forma segura
        if (filtros.estado) params.append('estado', filtros.estado);
        if (filtros.fechaDesde) params.append('fechaDesde', filtros.fechaDesde);
        if (filtros.fechaHasta) params.append('fechaHasta', filtros.fechaHasta);
        if (filtros.metodoPago) params.append('metodoPago', filtros.metodoPago);
        if (filtros.page) params.append('page', filtros.page.toString());
        if (filtros.limit) params.append('limit', filtros.limit.toString());

        // Solo agregar query string si hay parámetros
        const queryString = params.toString();
        if (queryString) {
          url += `?${queryString}`;
        }
      }

      const response = await fetch(url, {
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

  // Cambiar estado del pedido (admin)
  async cambiarEstado(
    id: number,
    estado: EstadoPedido,
    notasInternas?: string
  ): Promise<ApiResponse<Pedido>> {
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
        throw new Error(
          errorData.message || 'Error al cambiar estado del pedido'
        );
      }

      return await response.json();
    } catch (error) {
      console.error('Error al cambiar estado del pedido:', error);
      throw error;
    }
  }
}

export const pedidosService = new PedidosService();
