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
  unidadMedida?: string;
  peso?: number;
  estado: 'ACTIVO' | 'INACTIVO' | 'AGOTADO';
  destacado: boolean;
  categoriaId: number;
  categoria: {
    id: number;
    nombre: string;
  };
  imagenes: ProductoImagen[];
  creadoEn: string;
  actualizadoEn: string;
  // Conteos reales de la base de datos
  _count?: {
    reviews: number;
    favoritos: number;
  };
  // Datos completos si los necesitas
  favoritos?: Array<{
    usuarioId: number;
  }>;
  reviews?: Array<{
    id: number;
    calificacion: number;
    comentario?: string;
    usuario: {
      nombres: string;
      apellidos: string;
    };
  }>;
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
  slug: string;
  precioUnitario: number;
  precioAnterior?: number;
  stock: number;
  stockMinimo?: number; // CORRECCIÓN: Debe ser opcional como en el backend
  unidadMedida?: string;
  peso?: number;
  estado?: 'ACTIVO' | 'INACTIVO' | 'AGOTADO';
  destacado?: boolean;
  categoriaId: number;
}

export interface UpdateProductoDto {
  nombre?: string;
  descripcion?: string;
  sku?: string;
  slug?: string;
  precioUnitario?: number;
  precioAnterior?: number;
  stock?: number;
  stockMinimo?: number;
  unidadMedida?: string;
  peso?: number;
  estado?: 'ACTIVO' | 'INACTIVO' | 'AGOTADO';
  destacado?: boolean;
  categoriaId?: number;
}

export interface CreateProductoImagenDto {
  productoId?: number; // Agregado para coincidir con el backend
  url: string;
  altText?: string; // Habilitado para accesibilidad
  principal?: boolean;
  orden?: number;
}

export interface ApiResponse<T> {
  mensaje: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}

export interface ProductoFilters {
  busqueda?: string; // CORREGIDO: cambiar 'search' por 'busqueda' para coincidir con el backend
  categoriaId?: number;
  estado?: string;
  destacado?: boolean;
  stock?: string;
}

class ProductosService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }  // Obtener productos con paginación (ADMIN)
  async obtenerConPaginacion(page: number = 1, limit: number = 10, filtros: ProductoFilters = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    // Agregar filtros que no sean undefined o vacíos
    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });

    const response = await fetch(`${API_BASE_URL}/productos?${params.toString()}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
      throw new Error(errorData.message || 'Error al obtener productos');
    }
    
    return response.json();
  }

  // Obtener todos los productos (ADMIN) - Versión que maneja múltiples páginas
  async obtenerTodos(filtros: ProductoFilters = {}) {
    let allProducts: ProductoAdmin[] = [];
    let currentPage = 1;
    let hasMorePages = true;
    const limit = 50; // Límite máximo permitido

    while (hasMorePages) {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString()
      });

      // Agregar filtros que no sean undefined o vacíos
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });

      const response = await fetch(`${API_BASE_URL}/productos?${params.toString()}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
        throw new Error(errorData.message || 'Error al obtener productos');
      }
      
      const pageData = await response.json();
      
      // Agregar productos de esta página
      allProducts = [...allProducts, ...pageData.data];
      
      // Verificar si hay más páginas
      const totalPages = Math.ceil(pageData.total / limit);
      hasMorePages = currentPage < totalPages;
      currentPage++;
    }

    // Retornar en el mismo formato que una página normal
    return {
      data: allProducts,
      total: allProducts.length
    };
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
    }  }
  // Crear nuevo producto (ADMIN)
  async crear(datos: CreateProductoDto): Promise<ApiResponse<ProductoAdmin>> {
    try {
      console.log('🔨 Creando producto:', {
        nombre: datos.nombre,
        sku: datos.sku,
        categoriaId: datos.categoriaId,
        precio: datos.precioUnitario
      });

      const response = await fetch(`${API_BASE_URL}/productos`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(datos),
      });

      console.log('📡 Respuesta del servidor:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
        console.error('❌ Error del servidor al crear producto:', {
          status: response.status,
          error: errorData
        });
        throw new Error(errorData.message || `Error HTTP ${response.status}: ${response.statusText}`);
      }      const result = await response.json();
      console.log('✅ Producto creado exitosamente:', {
        hasResult: !!result,
        hasData: !!result?.data,
        dataId: result?.data?.id,
        dataType: typeof result?.data?.id,
        fullResult: result
      });// Validar que la respuesta tenga la estructura esperada
      if (!result || !result.data || typeof result.data.id !== 'number') {
        console.error('❌ Respuesta inválida del servidor:', result);
        throw new Error('El servidor no devolvió los datos del producto correctamente');
      }

      return result;
    } catch (error) {
      console.error('❌ Error al crear producto:', {
        error: error instanceof Error ? error.message : 'Error desconocido',
        datos: {
          nombre: datos.nombre,
          sku: datos.sku,
          categoriaId: datos.categoriaId
        }
      });
      throw error;
    }
  }  /**
   * Crear producto con imágenes - MÉTODO MEJORADO
   * 1. Crea el producto primero
   * 2. Luego agrega las imágenes una por una
   * 3. La primera imagen se marca como principal
   */
  async crearConImagenes(datos: CreateProductoDto, imageUrls: string[]): Promise<ApiResponse<ProductoAdmin>> {
    try {
      console.log('🎯 Iniciando creación de producto con imágenes:', {
        producto: datos.nombre,
        imagenesCount: imageUrls.length,
        imagenes: imageUrls.map(url => url.substring(0, 50) + '...')
      });

      // PASO 1: Crear el producto SIN imágenes
      console.log('📦 Paso 1: Creando producto base...');
      const productoResponse = await this.crear(datos);
      
      if (!productoResponse.data?.id) {
        console.error('❌ Error: El producto no se creó correctamente', productoResponse);
        throw new Error('No se pudo crear el producto correctamente - respuesta inválida');
      }
      
      const producto = productoResponse.data;
      console.log('✅ Producto base creado:', { id: producto.id, nombre: producto.nombre });

      // PASO 2: Si hay imágenes, agregarlas secuencialmente
      if (imageUrls.length > 0) {
        console.log('📸 Paso 2: Agregando imágenes...');
        
        // Agregar imágenes una por una de forma secuencial (no paralela)
        for (let i = 0; i < imageUrls.length; i++) {
          const url = imageUrls[i];
          const esPrincipal = i === 0; // Solo la primera es principal
          
          console.log(`📷 Agregando imagen ${i + 1}/${imageUrls.length}:`, {
            url: url.substring(0, 50) + '...',
            principal: esPrincipal,
            orden: i
          });
          
          try {            const imagenDto: CreateProductoImagenDto = {
              url,
              altText: `Imagen del producto ${datos.nombre}`, // Alt text descriptivo
              principal: esPrincipal,
              orden: i,
            };
            
            // Esperar a que cada imagen se agregue completamente
            const imagenResult = await this.agregarImagen(producto.id, imagenDto);
            console.log(`✅ Imagen ${i + 1} agregada:`, {
              imagenId: imagenResult.data?.id,
              principal: esPrincipal
            });
            
            // Pequeña pausa entre imágenes para evitar problemas de concurrencia
            await new Promise(resolve => setTimeout(resolve, 100));
            
          } catch (error) {
            console.error(`❌ Error al agregar imagen ${i + 1}:`, error);
            // Continuar con las demás imágenes aunque una falle
          }
        }

        // PASO 3: Obtener el producto completo con todas sus imágenes
        console.log('🔄 Paso 3: Obteniendo producto con imágenes...');
        try {
          const productoCompleto = await this.obtenerPorId(producto.id);
          console.log('✅ Producto completo obtenido:', {
            id: productoCompleto.data?.id,
            imagenesCount: productoCompleto.data?.imagenes?.length || 0,
            imagenPrincipal: productoCompleto.data?.imagenes?.find(img => img.principal)?.url?.substring(0, 50) + '...'
          });
          return productoCompleto;
        } catch (error) {
          console.warn('⚠️ Error al obtener producto completo, retornando producto base:', error);
          return productoResponse;
        }
      } else {
        console.log('ℹ️ No hay imágenes para agregar');
      }

      return productoResponse;
    } catch (error) {
      console.error('❌ Error general al crear producto con imágenes:', error);
      throw error;
    }
  }
  // Actualizar producto (ADMIN)
  async actualizar(id: number, datos: UpdateProductoDto): Promise<ApiResponse<ProductoAdmin>> {
    try {      // Filtrar campos que no están permitidos en el DTO de actualización
      const datosLimpios: UpdateProductoDto = {
        ...(datos.nombre && { nombre: datos.nombre }),
        ...(datos.descripcion !== undefined && { descripcion: datos.descripcion }),
        ...(datos.sku && { sku: datos.sku }),
        ...(datos.slug && { slug: datos.slug }),
        ...(datos.precioUnitario !== undefined && { precioUnitario: datos.precioUnitario }),
        ...(datos.precioAnterior !== undefined && { precioAnterior: datos.precioAnterior }),
        ...(datos.stock !== undefined && { stock: datos.stock }),
        ...(datos.stockMinimo !== undefined && { stockMinimo: datos.stockMinimo }),
        ...(datos.unidadMedida !== undefined && { unidadMedida: datos.unidadMedida }),
        ...(datos.peso !== undefined && { peso: datos.peso }),
        ...(datos.estado && { estado: datos.estado }),
        ...(datos.destacado !== undefined && { destacado: datos.destacado }),
        ...(datos.categoriaId && { categoriaId: datos.categoriaId }),      };

      console.log('Datos limpios a enviar al backend:', datosLimpios);

      const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(datosLimpios),
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
  // Cambiar estado (ADMIN)
  async cambiarEstado(id: number, estado: 'ACTIVO' | 'INACTIVO' | 'AGOTADO'): Promise<ApiResponse<ProductoAdmin>> {
    try {
      const response = await fetch(`${API_BASE_URL}/productos/${id}/estado`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ estado }),
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
  }  // Gestión de imágenes
  async agregarImagen(productoId: number, imagen: CreateProductoImagenDto): Promise<ApiResponse<ProductoImagen>> {
    try {
      console.log('📷 Agregando imagen al producto:', {
        productoId,
        url: imagen.url?.substring(0, 50) + '...',
        principal: imagen.principal,
        orden: imagen.orden
      });

      // Verificar que el productoId sea válido
      if (!productoId || isNaN(productoId)) {
        throw new Error(`ID de producto inválido: ${productoId}`);
      }

      // Construir la URL completa
      const fullUrl = `${API_BASE_URL}/productos/${productoId}/imagenes`;
      console.log('🌐 URL completa para agregar imagen:', fullUrl);

      // Asegurar que el productoId esté en el DTO
      const imagenCompleta = {
        ...imagen,
        productoId: productoId
      };      console.log('📦 Datos a enviar:', JSON.stringify(imagenCompleta, null, 2));

      const headers = this.getAuthHeaders();
      console.log('📋 Headers a enviar:', headers);

      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(imagenCompleta),
      });

      console.log('📡 Respuesta del servidor:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
        console.error('❌ Error en respuesta del servidor:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(errorData.message || `Error HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Imagen agregada exitosamente:', {
        imagenId: result.data?.id,
        principal: result.data?.principal
      });

      return result;    } catch (error) {
      console.error('❌ Error al agregar imagen:', {
        productoId,
        error: error instanceof Error ? error.message : 'Error desconocido',
        imagen: {
          url: imagen.url?.substring(0, 50) + '...',
          principal: imagen.principal,
          orden: imagen.orden
        }
      });
      throw error;
    }
  }

  async actualizarImagen(imagenId: number, datos: { principal?: boolean; orden?: number; altText?: string; url?: string }): Promise<ApiResponse<ProductoImagen>> {
    try {
      console.log('🔄 Actualizando imagen:', { imagenId, datos });

      const response = await fetch(`${API_BASE_URL}/productos/imagenes/${imagenId}`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(datos),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
        console.error('❌ Error en respuesta del servidor:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(errorData.message || `Error HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Imagen actualizada exitosamente:', result);

      return result;
    } catch (error) {
      console.error('❌ Error al actualizar imagen:', {
        imagenId,
        error: error instanceof Error ? error.message : 'Error desconocido',
        datos
      });
      throw error;
    }
  }
  async eliminarImagen(productoId: number, imagenId: number): Promise<ApiResponse<void>> {
    try {
      console.log('🗑️ Eliminando imagen:', { productoId, imagenId });
      
      const response = await fetch(`${API_BASE_URL}/productos/imagenes/${imagenId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      console.log('📡 Respuesta del servidor:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
        console.error('❌ Error del servidor:', errorData);
        throw new Error(errorData.message || `Error HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Imagen eliminada exitosamente');
      return result;
    } catch (error) {
      console.error('❌ Error al eliminar imagen:', {
        error: error instanceof Error ? error.message : 'Error desconocido',
        productoId,
        imagenId
      });
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

  // LEGACY: Mantener compatibilidad
  async fetchCategorias() {
    try {
      const response = await fetch(`${API_BASE_URL}/categoria/activas`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener categorías');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      return [];
    }
  }
}

export const productosService = new ProductosService();

// Utilidades para manejo de imágenes
export const imageUtils = {
  /**
   * Convierte URLs de Cloudinary a objetos CreateProductoImagenDto
   */
  urlsToImageDtos(urls: string[]): CreateProductoImagenDto[] {
    return urls.map((url, index) => ({
      url,
      altText: `Imagen del producto ${index + 1}`,
      principal: index === 0, // Solo la primera imagen es principal
      orden: index
    }));
  },

  /**
   * Valida si una URL es de Cloudinary
   */
  isCloudinaryUrl(url: string): boolean {
    return url.includes('cloudinary.com') || url.includes('res.cloudinary.com');
  },

  /**
   * Extrae el public_id de una URL de Cloudinary
   */
  extractPublicId(url: string): string | null {
    const match = url.match(/\/v\d+\/(.+)\./);
    return match ? match[1] : null;
  },

  /**
   * Genera diferentes tamaños de una imagen de Cloudinary
   */
  getImageVariants(url: string) {
    if (!this.isCloudinaryUrl(url)) {
      return {
        thumbnail: url,
        small: url,
        medium: url,
        large: url,
        original: url
      };
    }

    const publicId = this.extractPublicId(url);
    if (!publicId) return { original: url };

    const baseUrl = url.split('/upload/')[0] + '/upload/';
    
    return {
      thumbnail: `${baseUrl}w_150,h_150,c_fill/${publicId}`,
      small: `${baseUrl}w_300,h_300,c_fill/${publicId}`,
      medium: `${baseUrl}w_600,h_600,c_fill/${publicId}`,
      large: `${baseUrl}w_1200,h_1200,c_fill/${publicId}`,
      original: url
    };
  },

  /**
   * Optimiza una URL de Cloudinary para un tamaño específico
   */
  optimizeImageUrl(url: string, width: number, height?: number): string {
    if (!this.isCloudinaryUrl(url)) return url;

    const publicId = this.extractPublicId(url);
    if (!publicId) return url;

    const baseUrl = url.split('/upload/')[0] + '/upload/';
    const transformation = height 
      ? `w_${width},h_${height},c_fill,f_auto,q_auto`
      : `w_${width},c_scale,f_auto,q_auto`;

    return `${baseUrl}${transformation}/${publicId}`;
  }
};
