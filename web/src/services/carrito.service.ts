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
    console.log('Getting auth headers, token:', token ? 'present' : 'missing');
    
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  async getCart(): Promise<Cart> {
    const response = await fetch(`${API_BASE_URL}/carrito`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener el carrito');
    }

    return response.json();
  }
  async addItemToCart(item: AddCartItemRequest): Promise<CartItem> {
    console.log('CarritoService.addItemToCart called with:', item);
    console.log('API_BASE_URL:', API_BASE_URL);
    console.log('Headers:', this.getAuthHeaders());
    
    const response = await fetch(`${API_BASE_URL}/carrito/items`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(item),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const error = await response.json();
      console.error('API Error response:', error);
      throw new Error(error.message || 'Error al añadir producto al carrito');
    }

    const result = await response.json();
    console.log('API Success response:', result);
    return result;
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
