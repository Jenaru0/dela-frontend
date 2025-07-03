'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import type { FilterState } from '@/types/productos';

interface SearchParamsHandlerProps {
  onParamsChange: (filters: Partial<FilterState>, page?: number) => void;
}

export default function SearchParamsHandler({ onParamsChange }: SearchParamsHandlerProps) {
  const searchParams = useSearchParams();
  const initializedRef = useRef(false);
  const lastParamsRef = useRef<string>('');

  useEffect(() => {
    // Convertir los parámetros a string para comparar
    const currentParamsString = searchParams.toString();
    
    // Solo ejecutar si los parámetros han cambiado
    if (currentParamsString === lastParamsRef.current) return;
    
    lastParamsRef.current = currentParamsString;
    initializedRef.current = true;

    // Extraer todos los filtros de la URL
    const newFilters: Partial<FilterState> = {};
    
    // Búsqueda
    const searchParam = searchParams.get('search') || searchParams.get('q');
    if (searchParam) {
      newFilters.search = searchParam;
    }
    
    // Categoría
    const categoriaParam = searchParams.get('categoria') || searchParams.get('category');
    if (categoriaParam) {
      newFilters.category = categoriaParam;
    }
    
    // Rango de precios
    const priceMinParam = searchParams.get('precio_min') || searchParams.get('min_price');
    if (priceMinParam) {
      newFilters.priceMin = priceMinParam;
    }
    
    const priceMaxParam = searchParams.get('precio_max') || searchParams.get('max_price');
    if (priceMaxParam) {
      newFilters.priceMax = priceMaxParam;
    }
    
    // Filtros booleanos
    const destacadoParam = searchParams.get('destacado') || searchParams.get('featured');
    if (destacadoParam === 'true' || destacadoParam === '1') {
      newFilters.destacado = true;
    }
    
    const disponibleParam = searchParams.get('disponible') || searchParams.get('available');
    if (disponibleParam === 'true' || disponibleParam === '1') {
      newFilters.disponible = true;
    }
    
    // Ordenamiento
    const sortByParam = searchParams.get('orden') || searchParams.get('sort');
    if (sortByParam) {
      newFilters.sortBy = sortByParam as FilterState['sortBy'];
    }
    
    const sortOrderParam = searchParams.get('direccion') || searchParams.get('order');
    if (sortOrderParam === 'asc' || sortOrderParam === 'desc') {
      newFilters.sortOrder = sortOrderParam;
    }
    
    // Página
    const pageParam = searchParams.get('pagina') || searchParams.get('page');
    let currentPage = 1;
    if (pageParam) {
      const pageNum = parseInt(pageParam);
      if (!isNaN(pageNum) && pageNum > 0) {
        currentPage = pageNum;
      }
    }

    // Aplicar los filtros
    onParamsChange(newFilters, currentPage);
  }, [searchParams, onParamsChange]);

  return null; // Este componente no renderiza nada
}
