'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import type { FilterState } from '@/types/productos';

interface SearchParamsHandlerProps {
  onParamsChange: (filters: Partial<FilterState>) => void;
}

export default function SearchParamsHandler({ onParamsChange }: SearchParamsHandlerProps) {
  const searchParams = useSearchParams();
  const initializedRef = useRef(false);
  const lastParamsRef = useRef<string>('');

  useEffect(() => {
    // Convertir los parámetros a string para comparar
    const currentParamsString = searchParams.toString();
    
    // Solo ejecutar si los parámetros han cambiado y no es la primera vez (a menos que haya parámetros)
    if (currentParamsString === lastParamsRef.current) return;
    
    // Si es la primera vez y no hay parámetros, no hacer nada
    if (!initializedRef.current && !currentParamsString) {
      initializedRef.current = true;
      return;
    }
    
    lastParamsRef.current = currentParamsString;
    initializedRef.current = true;

    const searchParam = searchParams.get('search');
    const categoriaParam = searchParams.get('categoria');
    
    const newFilters: Partial<FilterState> = {};
    
    if (searchParam) {
      newFilters.search = searchParam;
    }
    
    if (categoriaParam) {
      newFilters.category = categoriaParam;
    }

    // Solo llamar onParamsChange si hay filtros que aplicar
    if (Object.keys(newFilters).length > 0) {
      onParamsChange(newFilters);
    }
  }, [searchParams, onParamsChange]);

  return null; // Este componente no renderiza nada
}
