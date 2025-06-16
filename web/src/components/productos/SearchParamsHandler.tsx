'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import type { FilterState } from '@/types/productos';

interface SearchParamsHandlerProps {
  onParamsChange: (filters: Partial<FilterState>) => void;
}

export default function SearchParamsHandler({ onParamsChange }: SearchParamsHandlerProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const searchParam = searchParams.get('search');
    const categoriaParam = searchParams.get('categoria');
    
    const newFilters: Partial<FilterState> = {};
    
    if (searchParam) {
      newFilters.search = searchParam;
    }
    
    if (categoriaParam) {
      newFilters.category = categoriaParam;
    }

    if (Object.keys(newFilters).length > 0) {
      onParamsChange(newFilters);
    }
  }, [searchParams, onParamsChange]);

  return null; // Este componente no renderiza nada
}
