import React from 'react';
import { Search, Filter, Grid3X3, List } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ViewMode, FilterState } from '@/types/productos';
import { OPCIONES_ORDENAMIENTO } from '@/constants/productos';

interface ProductosSearchBarProps {
  filters: FilterState;
  viewMode: ViewMode;
  showFilters: boolean;
  activeFiltersCount: number;
  onFilterChange: (key: keyof FilterState, value: string | boolean) => void;
  onSortChange: (value: string) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onToggleFilters: () => void;
}

const ProductosSearchBar: React.FC<ProductosSearchBarProps> = ({
  filters,
  viewMode,
  showFilters,
  activeFiltersCount,
  onFilterChange,
  onSortChange,
  onViewModeChange,
  onToggleFilters,
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-8">
      {/* Búsqueda */}
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Buscar productos..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="pl-10 h-12"
          />
        </div>
      </div>

      {/* Controles */}
      <div className="flex items-center gap-4">
        {/* Filtros Toggle */}
        <Button
          variant={showFilters ? 'default' : 'outline'}
          onClick={onToggleFilters}
          className="relative"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {/* Ordenamiento */}
        <select
          value={`${filters.sortBy}:${filters.sortOrder}`}
          onChange={(e) => onSortChange(e.target.value)}
          className="h-12 px-3 border border-gray-300 rounded-md bg-white"
        >
          {OPCIONES_ORDENAMIENTO.map((opcion) => (
            <option key={opcion.value} value={opcion.value}>
              {opcion.label}
            </option>
          ))}
        </select>

        {/* Vista Toggle */}
        <div className="flex border border-gray-300 rounded-md">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
            className="rounded-r-none"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('list')}
            className="rounded-l-none"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductosSearchBar;
