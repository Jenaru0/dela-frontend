import { Product, products } from '@/lib/products';
import { FilterState, ProductsResponse } from '@/types/productos';
import { CATEGORIAS_MOCK } from '@/constants/productos';

// Usar productos reales de DELA
const MOCK_PRODUCTS: Product[] = products;

class ProductosService {
  async fetchProductos(
    filters: FilterState,
    page: number = 1
  ): Promise<ProductsResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Apply filters locally (this would be done in the backend)
    let filteredProducts = [...MOCK_PRODUCTS];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.description?.toLowerCase().includes(searchTerm) ||
          false
      );
    }

    if (filters.category && filters.category !== 'Todos los Productos') {
      filteredProducts = filteredProducts.filter(
        (p) => p.category === filters.category
      );
    }

    if (filters.priceMin) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price >= parseFloat(filters.priceMin)
      );
    }

    if (filters.priceMax) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price <= parseFloat(filters.priceMax)
      );
    }

    if (filters.destacado) {
      filteredProducts = filteredProducts.filter((p) => p.isFeatured);
    }

    if (filters.disponible) {
      filteredProducts = filteredProducts.filter((p) => (p.stock || 0) > 0);
    }

    // Apply sorting
    filteredProducts.sort((a, b) => {
      let valueA: string | number, valueB: string | number;

      switch (filters.sortBy) {
        case 'nombre':
          valueA = a.name;
          valueB = b.name;
          break;
        case 'precioUnitario':
          valueA = a.price;
          valueB = b.price;
          break;
        case 'destacado':
          valueA = a.isFeatured ? 1 : 0;
          valueB = b.isFeatured ? 1 : 0;
          break;
        default:
          valueA = a.name;
          valueB = b.name;
      }

      if (typeof valueA === 'string') {
        return filters.sortOrder === 'asc'
          ? valueA.localeCompare(valueB as string)
          : (valueB as string).localeCompare(valueA);
      } else {
        return filters.sortOrder === 'asc'
          ? (valueA as number) - (valueB as number)
          : (valueB as number) - (valueA as number);
      }
    });

    // Apply pagination
    const limit = 12;
    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return {
      data: paginatedProducts,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async fetchCategorias() {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    return CATEGORIAS_MOCK;
  }
}

export const productosService = new ProductosService();
