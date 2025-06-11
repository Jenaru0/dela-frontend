// Types for products catalog
import { Product } from '@/lib/products';

export interface FilterState {
  search: string;
  category: string;
  priceMin: string;
  priceMax: string;
  destacado: boolean;
  disponible: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface OpcionOrdenamiento {
  value: string;
  label: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ProductsResponse {
  data: Product[];
  meta: PaginationMeta;
}

export type ViewMode = 'grid' | 'list';

export interface CartProduct extends Product {
  quantity: number;
}

// Tipos en español tal como responde tu backend
export interface Categoria {
  id: number;
  nombre: string;
}

export interface ImagenProducto {
  id: number;
  productoId: number;
  url: string;
  altText?: string; // <-- asegúrate que exista y se llame así
  principal: boolean;
  orden?: number;
  creadoEn: string;
}

export interface Producto {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string;
  precioUnitario: number | string;
  precioAnterior?: number | string;
  stock: number;
  destacado: boolean;
  categoria: Categoria;
  imagenes: ImagenProducto[];
  unidadMedida?: string;
  peso?: string | number;
  infoNutricional?: Record<string, unknown>;
}
