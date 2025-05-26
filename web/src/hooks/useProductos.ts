import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/lib/products';
import { FilterState, Categoria } from '@/types/productos';
import { productosService } from '@/services/productos.service';
import { INITIAL_FILTER_STATE } from '@/constants/productos';

export const useProductos = () => {
  const [productos, setProductos] = useState<Product[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTER_STATE);

  const fetchProductos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await productosService.fetchProductos(
        filters,
        currentPage
      );
      setProductos(response.data);
      setTotalPages(response.meta.totalPages);
    } catch (error) {
      console.error('Error fetching productos:', error);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage]);

  const fetchCategorias = useCallback(async () => {
    try {
      const data = await productosService.fetchCategorias();
      setCategorias(data);
    } catch (error) {
      console.error('Error fetching categorias:', error);
    }
  }, []);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  const handleFilterChange = useCallback(
    (key: keyof FilterState, value: string | boolean) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      setCurrentPage(1);
    },
    []
  );

  const handleSortChange = useCallback((value: string) => {
    const [field, order] = value.split(':');
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder: order as 'asc' | 'desc',
    }));
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(INITIAL_FILTER_STATE);
    setCurrentPage(1);
  }, []);

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'disponible' || key === 'sortBy' || key === 'sortOrder')
      return false;
    if (typeof value === 'boolean') return value;
    return value !== '';
  }).length;

  return {
    productos,
    categorias,
    loading,
    currentPage,
    totalPages,
    filters,
    activeFiltersCount,
    setCurrentPage,
    handleFilterChange,
    handleSortChange,
    clearFilters,
    refetch: fetchProductos,
  };
};
