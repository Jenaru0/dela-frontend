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
    <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center mb-6 sm:mb-8">
      {/* Búsqueda - Toma todo el espacio disponible */}
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Buscar productos por nombre, categoría o descripción..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="pl-12 h-12 bg-white border border-gray-200 rounded-lg text-base placeholder:text-gray-400 focus:border-[#CC9F53] focus:ring-1 focus:ring-[#CC9F53] shadow-sm"
          />
        </div>
      </div>

      {/* Filtros avanzados */}
      <Button
        variant="outline"
        onClick={onToggleFilters}
        className={`px-4 py-3 h-12 border border-[#CC9F53] rounded-lg text-sm font-medium transition-all duration-200 ${
          showFilters 
            ? 'bg-[#CC9F53] text-white border-[#CC9F53] shadow-sm' 
            : 'bg-white text-[#CC9F53] hover:bg-[#FFF9EC] hover:border-[#CC9F53]'
        }`}
      >
        <Filter className="h-4 w-4 mr-2" />
        Filtros avanzados
        {activeFiltersCount > 0 && (
          <Badge className="ml-2 bg-white text-[#CC9F53] text-xs px-1.5 py-0.5">
            {activeFiltersCount}
          </Badge>
        )}
      </Button>

      {/* Ordenar por */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Ordenar por:</span>
        <select
          value={`${filters.sortBy}:${filters.sortOrder}`}
          onChange={(e) => onSortChange(e.target.value)}
          className="h-12 px-3 pr-8 border border-gray-200 rounded-lg bg-white text-sm font-medium text-gray-700 focus:border-[#CC9F53] focus:ring-1 focus:ring-[#CC9F53] appearance-none cursor-pointer min-w-[140px] shadow-sm"
          style={{
            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 8px center',
            backgroundSize: '16px'
          }}
        >
          {OPCIONES_ORDENAMIENTO.map((opcion) => (
            <option key={opcion.value} value={opcion.value}>
              {opcion.label}
            </option>
          ))}
        </select>
      </div>

      {/* Vista */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Vista:</span>
        <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewModeChange('grid')}
            className={`px-4 py-3 h-12 rounded-none border-0 text-sm font-medium transition-all duration-200 ${
              viewMode === 'grid'
                ? 'bg-[#CC9F53] text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Grid3X3 className="h-4 w-4 mr-2" />
            Cuadrícula
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewModeChange('list')}
            className={`px-4 py-3 h-12 rounded-none border-0 border-l border-gray-200 text-sm font-medium transition-all duration-200 ${
              viewMode === 'list'
                ? 'bg-[#CC9F53] text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <List className="h-4 w-4 mr-2" />
            Lista
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductosSearchBar;
