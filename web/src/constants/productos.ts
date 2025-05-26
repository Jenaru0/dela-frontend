import { OpcionOrdenamiento, Categoria } from '@/types/productos';

export const OPCIONES_ORDENAMIENTO: OpcionOrdenamiento[] = [
  { value: 'nombre:asc', label: 'Nombre A-Z' },
  { value: 'nombre:desc', label: 'Nombre Z-A' },
  { value: 'precioUnitario:asc', label: 'Precio: Menor a Mayor' },
  { value: 'precioUnitario:desc', label: 'Precio: Mayor a Menor' },
  { value: 'creadoEn:desc', label: 'Más Recientes' },
  { value: 'destacado:desc', label: 'Destacados Primero' },
];

export const CATEGORIAS_MOCK: Categoria[] = [
  { id: '1', nombre: 'Lácteos' },
  { id: '2', nombre: 'Conservas' },
  { id: '3', nombre: 'Mermeladas' },
  { id: '4', nombre: 'Mieles' },
];

export const INITIAL_FILTER_STATE = {
  search: '',
  category: '',
  priceMin: '',
  priceMax: '',
  destacado: false,
  disponible: true,
  sortBy: 'nombre',
  sortOrder: 'asc' as const,
};

export const ITEMS_PER_PAGE = 12;
