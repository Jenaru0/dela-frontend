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
<<<<<<< HEAD
  precio: number; // Este viene como precioUnitario del backend, mapeado a precio
=======
  precioUnitario: number;
>>>>>>> develops
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
<<<<<<< HEAD
  costoEnvio: number;
  descuento: number;
=======
  envioMonto: number; // Cambié de costoEnvio a envioMonto para coincidir con Prisma
  descuentoMonto: number; // Cambié de descuento a descuentoMonto
>>>>>>> develops
  total: number;
  promocionCodigo?: string;
  notasCliente?: string;
  notasInternas?: string;
  fechaPedido: string;
  fechaEntrega?: string;
  creadoEn: string;
  actualizadoEn: string;
<<<<<<< HEAD
  detalles: DetallePedido[];
  detallePedidos?: DetallePedido[]; // Alias for backwards compatibility
=======
  detallePedidos: DetallePedido[]; // Cambié de detalles a detallePedidos
>>>>>>> develops
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
<<<<<<< HEAD
    fechaFin?: string,
=======
    fechaFin?: string
>>>>>>> develops
  ): Promise<PaginatedResponse<Pedido>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
<<<<<<< HEAD
      
=======

>>>>>>> develops
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
<<<<<<< HEAD
  }

  // Obtener todos los pedidos para admin (sin paginación)
  async obtenerTodosAdmin(): Promise<ApiResponse<Pedido[]>> {
    try {
=======
  }  // Obtener todos los pedidos para admin (sin paginación)
  async obtenerTodosAdmin(): Promise<ApiResponse<Pedido[]>> {
    try {
      console.log('🔍 Frontend: Iniciando obtenerTodosAdmin');
      console.log('🔍 Frontend: URL:', `${API_BASE_URL}/pedidos/admin/todos`);
      console.log('🔍 Frontend: Headers:', this.getAuthHeaders());
      
>>>>>>> develops
      const response = await fetch(`${API_BASE_URL}/pedidos/admin/todos`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

<<<<<<< HEAD
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
=======
      console.log('🔍 Frontend: Response status:', response.status);
      console.log('🔍 Frontend: Response ok:', response.ok);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.error('❌ Frontend: Error al parsear respuesta de error:', parseError);
          throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }
        console.error('❌ Frontend: Error data:', errorData);
        throw new Error(errorData.message || 'Error al obtener pedidos');
      }
      
      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        console.error('❌ Frontend: Error al parsear respuesta exitosa:', parseError);
        throw new Error('Error al procesar la respuesta del servidor');
      }
      
      console.log('✅ Frontend: Success data:', result);
      
      // El backend ya devuelve el formato correcto {mensaje, data}
      return result;
    } catch (error) {
      console.error('❌ Frontend: Error completo:', error);
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
>>>>>>> develops
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
<<<<<<< HEAD
  }  // Cambiar estado del pedido (admin)
  async cambiarEstado(id: number, estado: EstadoPedido, notasInternas?: string): Promise<ApiResponse<Pedido>> {
    try {
      const body: { estado: EstadoPedido; notasInternas?: string } = { estado };
      
=======
  }

  // Cambiar estado del pedido (admin)
  async cambiarEstado(
    id: number,
    estado: EstadoPedido,
    notasInternas?: string
  ): Promise<ApiResponse<Pedido>> {
    try {
      const body: { estado: EstadoPedido; notasInternas?: string } = { estado };

>>>>>>> develops
      // Si se proporcionan notas internas, incluirlas en el cuerpo
      if (notasInternas !== undefined) {
        body.notasInternas = notasInternas;
      }
<<<<<<< HEAD
      
=======

>>>>>>> develops
      const response = await fetch(`${API_BASE_URL}/pedidos/${id}/estado`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
<<<<<<< HEAD
        throw new Error(errorData.message || 'Error al cambiar estado del pedido');
=======
        throw new Error(
          errorData.message || 'Error al cambiar estado del pedido'
        );
>>>>>>> develops
      }

      return await response.json();
    } catch (error) {
      console.error('Error al cambiar estado del pedido:', error);
      throw error;
    }
  }
}

export const pedidosService = new PedidosService();
