const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ProductoCategoria {
  id: number;
  nombre: string;
  sku: string;
  slug: string;
  descripcion?: string;
  descripcionCorta?: string;
  precioUnitario: number;
  precioAnterior?: number;
  stock: number;
  unidadMedida?: string;
  peso?: number;
  infoNutricional?: Record<string, unknown>;
  destacado: boolean;
  categoriaId: number;
  estado: 'ACTIVO' | 'INACTIVO' | 'DESCONTINUADO';
  creadoEn: string;
  actualizadoEn: string;
  imagenes: {
    id: number;
    url: string;
    principal: boolean;
    orden?: number;
  }[];
  categoria: {
    id: number;
    nombre: string;
  };
}

export interface EstadisticasCategoria {
  totalProductos: number;
  productosActivos: number;
  productosInactivos: number;
  productosDestacados: number;
  stockTotal: number;
  valorInventario: number;
}

class CategoriaProductosService {
  async obtenerProductosPorCategoria(categoriaId: number): Promise<ProductoCategoria[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/catalogo/productos?categoriaId=${categoriaId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener productos de la categoría');
      }

      const productos = await response.json();
      return Array.isArray(productos) ? productos : [];
    } catch (error) {
      console.error('Error al obtener productos por categoría:', error);
      return [];
    }
  }

  async calcularEstadisticas(productos: ProductoCategoria[]): Promise<EstadisticasCategoria> {
    const productosActivos = productos.filter(p => p.estado === 'ACTIVO');
    const productosInactivos = productos.filter(p => p.estado !== 'ACTIVO');
    const productosDestacados = productos.filter(p => p.destacado);
    
    const stockTotal = productos.reduce((sum, p) => sum + p.stock, 0);
    const valorInventario = productos.reduce((sum, p) => sum + (p.precioUnitario * p.stock), 0);

    return {
      totalProductos: productos.length,
      productosActivos: productosActivos.length,
      productosInactivos: productosInactivos.length,
      productosDestacados: productosDestacados.length,
      stockTotal,
      valorInventario,
    };
  }
}

const categoriaProductosService = new CategoriaProductosService();
export default categoriaProductosService;
