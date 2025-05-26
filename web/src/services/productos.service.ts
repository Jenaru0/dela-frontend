import { Product } from '@/lib/products';
import { FilterState, ProductsResponse } from '@/types/productos';

// Mock data - replace with real API calls
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Queso Artesanal del Valle',
    price: 25.9,
    oldPrice: 32.0,
    image: '/images/products/product-1.svg',
    category: 'Lácteos',
    rating: 4.8,
    reviews: 124,
    isNew: false,
    isFeatured: true,
    description: 'Queso artesanal elaborado con leche fresca del valle',
    stock: 15,
  },
  {
    id: '2',
    name: 'Miel de Abeja Pura',
    price: 18.5,
    image: '/images/products/product-2.svg',
    category: 'Mieles',
    rating: 4.9,
    reviews: 87,
    isNew: true,
    isFeatured: true,
    description: 'Miel pura de abejas del valle, 100% natural',
    stock: 8,
  },
  {
    id: '3',
    name: 'Mermelada de Fresa Casera',
    price: 12.9,
    oldPrice: 15.5,
    image: '/images/products/product-3.svg',
    category: 'Mermeladas',
    rating: 4.7,
    reviews: 56,
    isNew: false,
    isFeatured: false,
    description: 'Mermelada casera de fresas frescas del valle',
    stock: 22,
  },
  {
    id: '4',
    name: 'Conserva de Duraznos',
    price: 22.0,
    image: '/images/products/product-4.svg',
    category: 'Conservas',
    rating: 4.6,
    reviews: 43,
    isNew: false,
    isFeatured: true,
    description: 'Duraznos en almíbar, conserva artesanal',
    stock: 12,
  },
  {
    id: '5',
    name: 'Yogurt Natural Cremoso',
    price: 8.5,
    image: '/images/products/product-5.svg',
    category: 'Lácteos',
    rating: 4.5,
    reviews: 78,
    isNew: false,
    isFeatured: false,
    description: 'Yogurt natural sin azúcar añadida',
    stock: 30,
  },
  {
    id: '6',
    name: 'Miel de Eucalipto',
    price: 22.0,
    oldPrice: 28.0,
    image: '/images/products/product-6.svg',
    category: 'Mieles',
    rating: 4.8,
    reviews: 62,
    isNew: true,
    isFeatured: true,
    description: 'Miel de eucalipto con propiedades medicinales',
    stock: 15,
  },
];

class ProductosService {
  async fetchProductos(
    filters: FilterState,
    page: number = 1
  ): Promise<ProductsResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // In a real app, this would be:
    // const params = new URLSearchParams({
    //   busqueda: filters.search,
    //   categoriaId: filters.category,
    //   precioMin: filters.priceMin,
    //   precioMax: filters.priceMax,
    //   destacado: filters.destacado.toString(),
    //   disponible: filters.disponible.toString(),
    //   orderBy: filters.sortBy,
    //   sortOrder: filters.sortOrder,
    //   page: page.toString(),
    //   limit: '12'
    // });
    // const response = await fetch(`/api/productos?${params}`);
    // return response.json();

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

    if (filters.category) {
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

    // In a real app:
    // const response = await fetch('/api/productos/categorias');
    // return response.json();

    return [
      { id: '1', nombre: 'Lácteos' },
      { id: '2', nombre: 'Conservas' },
      { id: '3', nombre: 'Mermeladas' },
      { id: '4', nombre: 'Mieles' },
    ];
  }
}

export const productosService = new ProductosService();
