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
}) => {  return (
    <div className="w-full lg:w-80">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sticky top-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Filtros
          </h3>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 text-sm font-medium"
            >
              <X className="h-4 w-4 mr-1" />
              Limpiar ({activeFiltersCount})
            </Button>
          )}
        </div>

        <div className="space-y-6">
          {/* Categorías */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Categorías
            </h4>
            <div className="space-y-2">
              <label className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="category"
                  value=""
                  checked={filters.category === ''}
                  onChange={(e) => onFilterChange('category', e.target.value)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                />
                <span className="ml-3 text-sm text-gray-700">
                  Todas las categorías
                </span>
              </label>
              {categorias.map((categoria) => (
                <label key={categoria.id} className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="category"
                    value={categoria.nombre}
                    checked={filters.category === categoria.nombre}
                    onChange={(e) => onFilterChange('category', e.target.value)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    {categoria.nombre}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Rango de Precios */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Rango de Precios
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">S/</span>
                <Input
                  type="number"
                  placeholder="Mín"
                  value={filters.priceMin}
                  onChange={(e) => onFilterChange('priceMin', e.target.value)}
                  className="pl-8 h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">S/</span>
                <Input
                  type="number"
                  placeholder="Máx"
                  value={filters.priceMax}
                  onChange={(e) => onFilterChange('priceMax', e.target.value)}
                  className="pl-8 h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Opciones adicionales */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Opciones adicionales
            </h4>
            <div className="space-y-3">
              <label className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={filters.destacado}
                  onChange={(e) => onFilterChange('destacado', e.target.checked)}
                  className="w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500 focus:ring-2"
                />
                <span className="ml-3 text-sm text-gray-700">
                  Solo productos destacados
                </span>
              </label>
              <label className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={filters.disponible}
                  onChange={(e) => onFilterChange('disponible', e.target.checked)}
                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                />
                <span className="ml-3 text-sm text-gray-700">
                  Solo productos disponibles
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductosFilters;