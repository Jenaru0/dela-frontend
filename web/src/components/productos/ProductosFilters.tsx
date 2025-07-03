import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
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
  const [priceError, setPriceError] = useState<string>('');

  // Validación del rango de precios
  const validatePriceRange = (minValue: string, maxValue: string) => {
    const min = parseFloat(minValue);
    const max = parseFloat(maxValue);

    // Si ambos están vacíos, no hay error
    if (!minValue && !maxValue) {
      setPriceError('');
      return true;
    }

    // Validar valores negativos
    if (minValue && min < 0) {
      setPriceError('El precio mínimo no puede ser negativo');
      return false;
    }

    if (maxValue && max < 0) {
      setPriceError('El precio máximo no puede ser negativo');
      return false;
    }

    // Validar que el mínimo no sea mayor que el máximo
    if (minValue && maxValue && min > max) {
      setPriceError('El precio mínimo no puede ser mayor que el máximo');
      return false;
    }

    setPriceError('');
    return true;
  };

  // Manejar cambios en el precio mínimo
  const handlePriceMinChange = (value: string) => {
    // Solo permitir números y punto decimal
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    // Evitar múltiples puntos decimales
    const parts = numericValue.split('.');
    const validValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : numericValue;
    
    // Si el valor es válido, actualizar
    if (validatePriceRange(validValue, filters.priceMax)) {
      onFilterChange('priceMin', validValue);
    } else {
      // Actualizar solo si no es negativo
      const numValue = parseFloat(validValue);
      if (!validValue || numValue >= 0) {
        onFilterChange('priceMin', validValue);
      }
    }
  };

  // Manejar cambios en el precio máximo
  const handlePriceMaxChange = (value: string) => {
    // Solo permitir números y punto decimal
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    // Evitar múltiples puntos decimales
    const parts = numericValue.split('.');
    const validValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : numericValue;
    
    // Si el valor es válido, actualizar
    if (validatePriceRange(filters.priceMin, validValue)) {
      onFilterChange('priceMax', validValue);
    } else {
      // Actualizar solo si no es negativo
      const numValue = parseFloat(validValue);
      if (!validValue || numValue >= 0) {
        onFilterChange('priceMax', validValue);
      }
    }
  };

  // Validar cuando cambien los filtros externos
  useEffect(() => {
    validatePriceRange(filters.priceMin, filters.priceMax);
  }, [filters.priceMin, filters.priceMax]);  return (
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
                  type="text"
                  placeholder="Mín"
                  value={filters.priceMin}
                  onChange={(e) => handlePriceMinChange(e.target.value)}
                  className={`pl-8 h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                    priceError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">S/</span>
                <Input
                  type="text"
                  placeholder="Máx"
                  value={filters.priceMax}
                  onChange={(e) => handlePriceMaxChange(e.target.value)}
                  className={`pl-8 h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                    priceError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                />
              </div>
            </div>
            {priceError && (
              <div className="mt-2 flex items-center text-red-600 text-xs">
                <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                <span>{priceError}</span>
              </div>
            )}
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