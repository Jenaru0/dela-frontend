import { API_BASE_URL } from '@/lib/api';
import { FilterState, ProductsResponse } from '@/types/productos';

export interface ProductoAdmin {
  id: number;
  nombre: string;
  descripcion?: string;
  sku: string;
  slug: string;
  precioUnitario: number;
  precioAnterior?: number;
  stock: number;
  stockMinimo: number;
  peso?: number;
  dimensiones?: string;
  activo: boolean;
  destacado: boolean;
  nuevo: boolean;
  categoriaId: number;
  categoria: {
    id: number;
    nombre: string;
  };
  imagenes: ProductoImagen[];
  creadoEn: string;
  actualizadoEn: string;
  _count?: {
    resenas: number;
    favoritos: number;
  };
}

export interface ProductoImagen {
  id: number;
  url: string;
  altText?: string;
  principal: boolean;
  orden: number;
}

export interface CreateProductoDto {
  nombre: string;
  descripcion?: string;
  sku: string;
  precioUnitario: number;
  precioAnterior?: number;
  stock: number;
  stockMinimo: number;
  peso?: number;
  dimensiones?: string;
  activo?: boolean;
  destacado?: boolean;
  nuevo?: boolean;
  categoriaId: number;
  imagenes?: CreateProductoImagenDto[];
}

export interface UpdateProductoDto {
  nombre?: string;
  descripcion?: string;
  sku?: string;
  precioUnitario?: number;
  precioAnterior?: number;
  stock?: number;
  stockMinimo?: number;
  peso?: number;
  dimensiones?: string;
  activo?: boolean;
  destacado?: boolean;
  nuevo?: boolean;
  categoriaId?: number;
}

export interface CreateProductoImagenDto {
  url: string;
  altText?: string;
  principal?: boolean;
  orden?: number;
}

export interface ApiResponse<T> {
  mensaje: string;
  data: T;
}

class ProductosService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Obtener todos los productos (ADMIN)
  async obtenerTodos(): Promise<ApiResponse<ProductoAdmin[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/productos/admin`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener productos');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  }

  // Obtener productos públicos (para frontend)
  async obtenerPublicos(
    filters?: FilterState,
    page: number = 1,
    limit: number = 12
  ): Promise<ProductsResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters?.search && { busqueda: filters.search }),
        ...(filters?.category && { categoriaId: filters.category }),
        ...(filters?.priceMin && { precioMin: filters.priceMin.toString() }),
        ...(filters?.priceMax && { precioMax: filters.priceMax.toString() }),
      });

      const response = await fetch(`${API_BASE_URL}/productos?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener productos');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  }

  // Obtener producto por ID
  async obtenerPorId(id: number): Promise<ApiResponse<ProductoAdmin>> {
    try {
      const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener producto');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener producto:', error);
      throw error;
    }
  }

  // Crear nuevo producto (ADMIN)
  async crear(datos: CreateProductoDto): Promise<ApiResponse<ProductoAdmin>> {
    try {
      const response = await fetch(`${API_BASE_URL}/productos`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(datos),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear producto');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  }

  // Actualizar producto (ADMIN)
  async actualizar(id: number, datos: UpdateProductoDto): Promise<ApiResponse<ProductoAdmin>> {
    try {
      const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(datos),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar producto');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  }

  // Eliminar producto (ADMIN)
  async eliminar(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar producto');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  }

  // Actualizar stock (ADMIN)
  async actualizarStock(id: number, stock: number): Promise<ApiResponse<ProductoAdmin>> {
    try {
      const response = await fetch(`${API_BASE_URL}/productos/${id}/stock`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ stock }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar stock');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al actualizar stock:', error);
      throw error;
    }
  }

  // Cambiar estado (activo/inactivo) (ADMIN)
  async cambiarEstado(id: number, activo: boolean): Promise<ApiResponse<ProductoAdmin>> {
    try {
      const response = await fetch(`${API_BASE_URL}/productos/${id}/estado`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ activo }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cambiar estado del producto');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al cambiar estado del producto:', error);
      throw error;
    }
  }

  // Gestión de imágenes
  async agregarImagen(productoId: number, imagen: CreateProductoImagenDto): Promise<ApiResponse<ProductoImagen>> {
    try {
      const response = await fetch(`${API_BASE_URL}/productos/${productoId}/imagenes`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(imagen),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al agregar imagen');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al agregar imagen:', error);
      throw error;
    }
  }

  async eliminarImagen(productoId: number, imagenId: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/productos/${productoId}/imagenes/${imagenId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar imagen');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      throw error;
    }
  }

  async establecerImagenPrincipal(productoId: number, imagenId: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/productos/${productoId}/imagenes/${imagenId}/principal`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al establecer imagen principal');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al establecer imagen principal:', error);
      throw error;
    }
  }

  // LEGACY: Mantener compatibilidad con el código existente
  async fetchProductos(
    filters: FilterState,
    page: number = 1
  ): Promise<ProductsResponse> {
    return this.obtenerPublicos(filters, page);
  }

  async fetchCategorias() {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    return [
      { id: '1', nombre: 'Lácteos' },
      { id: '2', nombre: 'Conservas' },
      { id: '3', nombre: 'Mermeladas' },
      { id: '4', nombre: 'Mieles' },
    ];
  }
}

export const productosService = new ProductosService();
