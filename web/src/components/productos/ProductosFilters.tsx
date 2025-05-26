import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { FilterState, Categoria } from '@/types/productos';

interface ProductosFiltersProps {
  filters: FilterState;
  categorias: Categoria[];
  activeFiltersCount: number;
  onFilterChange: (key: keyof FilterState, value: string | boolean) => void;
  onClearFilters: () => void;
}

const ProductosFilters: React.FC<ProductosFiltersProps> = ({
  filters,
  categorias,
  activeFiltersCount,
  onFilterChange,
  onClearFilters,
}) => {
  return (
    <div className="lg:w-80">
      <div className="bg-white rounded-lg border p-6 sticky top-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Filtros</h3>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
            >
              <X className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
          )}
        </div>

        <div className="space-y-6">
          {/* Categorías */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              Categoría
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value=""
                  checked={filters.category === ''}
                  onChange={(e) => onFilterChange('category', e.target.value)}
                  className="mr-2"
                />
                Todas las categorías
              </label>
              {categorias.map((categoria) => (
                <label key={categoria.id} className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value={categoria.nombre}
                    checked={filters.category === categoria.nombre}
                    onChange={(e) => onFilterChange('category', e.target.value)}
                    className="mr-2"
                  />
                  {categoria.nombre}
                </label>
              ))}
            </div>
          </div>

          {/* Rango de Precios */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              Rango de Precios
            </label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.priceMin}
                onChange={(e) => onFilterChange('priceMin', e.target.value)}
                className="w-full"
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.priceMax}
                onChange={(e) => onFilterChange('priceMax', e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.destacado}
                onChange={(e) => onFilterChange('destacado', e.target.checked)}
                className="mr-2"
              />
              Solo productos destacados
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.disponible}
                onChange={(e) => onFilterChange('disponible', e.target.checked)}
                className="mr-2"
              />
              Solo productos disponibles
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductosFilters;
