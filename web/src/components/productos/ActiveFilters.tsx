import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { FilterState } from '@/types/productos';

interface ActiveFiltersProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string | boolean) => void;
  onClearFilters: () => void;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const activeFilters = [];

  // Verificar cada filtro activo
  if (filters.search.trim()) {
    activeFilters.push({
      key: 'search' as keyof FilterState,
      label: `Búsqueda: "${filters.search}"`,
      value: '',
    });
  }

  if (filters.category) {
    activeFilters.push({
      key: 'category' as keyof FilterState,
      label: `Categoría: ${filters.category}`,
      value: '',
    });
  }

  if (filters.priceMin) {
    activeFilters.push({
      key: 'priceMin' as keyof FilterState,
      label: `Precio mínimo: S/ ${filters.priceMin}`,
      value: '',
    });
  }

  if (filters.priceMax) {
    activeFilters.push({
      key: 'priceMax' as keyof FilterState,
      label: `Precio máximo: S/ ${filters.priceMax}`,
      value: '',
    });
  }

  if (filters.destacado) {
    activeFilters.push({
      key: 'destacado' as keyof FilterState,
      label: 'Solo destacados',
      value: false,
    });
  }

  if (filters.disponible) {
    activeFilters.push({
      key: 'disponible' as keyof FilterState,
      label: 'Solo disponibles',
      value: false,
    });
  }

  // Si no hay filtros activos, no mostrar nada
  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">
          Filtros aplicados ({activeFilters.length})
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 text-sm font-medium h-8 px-3"
        >
          <X className="h-4 w-4 mr-1" />
          Limpiar todos
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {activeFilters.map((filter, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="bg-[#CC9F53]/10 text-[#CC9F53] border border-[#CC9F53]/20 hover:bg-[#CC9F53]/20 transition-colors cursor-pointer group px-3 py-1"
            onClick={() => onFilterChange(filter.key, filter.value)}
          >
            {filter.label}
            <X className="h-3 w-3 ml-2 group-hover:text-[#CC9F53]/80" />
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default ActiveFilters;
