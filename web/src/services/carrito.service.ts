import { API_BASE_URL } from '@/lib/api';

export interface CartItem {
  carritoId: number;
  productoId: number;
  cantidad: number;
  creadoEn: string;
  actualizadoEn: string;
  producto: {
    id: number;
    nombre: string;
    sku: string;
    slug: string;
    descripcion?: string;
    descripcionCorta?: string;
    precioUnitario: string;
    precioAnterior?: string;
    stock: number;
    unidadMedida?: string;
    peso?: string;
    infoNutricional?: Record<string, unknown>;
    destacado: boolean;
    categoriaId: number;
    estado: string;
    creadoEn: string;
    actualizadoEn: string;
    imagenes: Array<{
      id: number;
      productoId: number;
      url: string;
      altText?: string;
      principal: boolean;
      orden: number;
      creadoEn: string;
    }>;
    categoria: {
      id: number;
      nombre: string;
      descripcion?: string;
      slug: string;
      imagenUrl?: string;
      activo: boolean;
      creadoEn: string;
    };
  };
}

export interface Cart {
  id: number;
  usuarioId: number;
  creadoEn: string;
  actualizadoEn: string;
  items: CartItem[];
}

export interface AddCartItemRequest {
  productoId: number;
  cantidad: number;
}

export interface UpdateCartItemRequest {
  cantidad: number;
}

class CarritoService {  private getAuthHeaders() {
    const token = localStorage.getItem('token');    
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }
  async getCart(): Promise<Cart> {
    // Si no hay token, retornar carrito vacío en lugar de hacer la petición
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      return {
        id: 0,
        usuarioId: 0,
        creadoEn: new Date().toISOString(),
        actualizadoEn: new Date().toISOString(),
        items: []
      };
    }

    const response = await fetch(`${API_BASE_URL}/carrito`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Si es 401, limpiar token y retornar carrito vacío
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('usuario');
        }
        return {
          id: 0,
          usuarioId: 0,
          creadoEn: new Date().toISOString(),
          actualizadoEn: new Date().toISOString(),
          items: []
        };
      }
      throw new Error(`Error al obtener el carrito: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
  async addItemToCart(item: AddCartItemRequest): Promise<{ success: boolean; data?: CartItem; error?: string }> {
    console.log('🛒 CarritoService.addItemToCart called with:', item);
    console.log('🌐 API_BASE_URL:', API_BASE_URL);
    console.log('🔑 Headers:', this.getAuthHeaders());
    console.log('📦 Request body:', JSON.stringify(item));
    
    const response = await fetch(`${API_BASE_URL}/carrito/items`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(item),
    });

    console.log('📊 Response status:', response.status);
    console.log('✅ Response ok:', response.ok);
    console.log('📝 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let errorMessage = 'Error al añadir producto al carrito';
      
      try {
        const error = await response.json();
        
        // Verificar si el error tiene contenido útil
        if (error && typeof error === 'object' && (error.message || error.error || error.statusCode)) {
          console.log('📋 API Error Details:', {
            status: response.status,
            message: error.message,
            error: error.error,
            statusCode: error.statusCode
          });
          
          // Extraer mensaje de error según la estructura de respuesta
          if (error.message) {
            errorMessage = error.message;
          } else if (error.error) {
            errorMessage = error.error;
          } else if (typeof error === 'string') {
            errorMessage = error;
          }
        } else {
          console.log('⚠️ API returned empty or invalid error response for status:', response.status);
        }
        
        // Si no pudimos extraer un mensaje específico, usar uno basado en el status
        if (errorMessage === 'Error al añadir producto al carrito') {
          if (response.status === 400) {
            errorMessage = 'Datos de producto inválidos';
          } else if (response.status === 401) {
            errorMessage = 'Tu sesión ha expirado. Por favor inicia sesión nuevamente';
          } else if (response.status === 403) {
            errorMessage = 'No tienes permisos para realizar esta acción';
          } else if (response.status === 404) {
            errorMessage = 'Producto no encontrado';
          } else if (response.status === 409) {
            errorMessage = 'No hay suficiente stock disponible para este producto';
          } else if (response.status >= 500) {
            errorMessage = 'Error del servidor. Por favor intenta nuevamente';
          } else {
            errorMessage = `Error del servidor (${response.status}). Por favor intenta nuevamente`;
          }
        }
      } catch (parseError) {
        console.log('⚠️ Could not parse error response:', parseError);
        console.log('📄 Raw response status:', response.status);
        // Usar mensaje por defecto basado en status code
        if (response.status === 401) {
          errorMessage = 'Tu sesión ha expirado. Por favor inicia sesión nuevamente';
        } else if (response.status === 409) {
          errorMessage = 'No hay suficiente stock disponible para este producto';
        } else if (response.status >= 500) {
          errorMessage = 'Error del servidor. Por favor intenta nuevamente';
        } else {
          errorMessage = `Error del servidor (${response.status}). Por favor intenta nuevamente`;
        }
      }
      
      return { success: false, error: errorMessage };
    }

    const result = await response.json();
    console.log('✅ API Success response:', result);
    return { success: true, data: result };
  }

  async updateCartItem(productoId: number, update: UpdateCartItemRequest): Promise<CartItem> {
    const response = await fetch(`${API_BASE_URL}/carrito/items/${productoId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(update),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar producto del carrito');
    }

    return response.json();
  }

  async removeItemFromCart(productoId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/carrito/items/${productoId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al eliminar producto del carrito');
    }
  }

  async clearCart(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/carrito`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al vaciar el carrito');
    }
  }
}

export const carritoService = new CarritoService();
