import React from 'react';
import { Product } from '@/lib/products';
import { ViewMode } from '@/types/productos';
import ProductCard from '@/components/common/ProductCard';
import { Button } from '@/components/ui/Button';

interface ProductosGridProps {
  productos: Product[];
  loading: boolean;
  viewMode: ViewMode;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
}

const ProductosGrid: React.FC<ProductosGridProps> = ({
  productos,
  loading,
  viewMode,
  currentPage,
  totalPages,
  onPageChange,
  onClearFilters,
}) => {
  // Debug temporal - revisar datos de productos
  console.log('🔍 ProductosGrid - Productos recibidos:', productos);
  console.log('🔍 ProductosGrid - Cantidad:', productos.length);
  if (productos.length > 0) {
    console.log('🔍 ProductosGrid - Primer producto:', productos[0]);
    console.log(
      '🔍 ProductosGrid - URL imagen primer producto:',
      productos[0].image
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        <p className="mt-4 text-neutral-600">Cargando productos...</p>
      </div>
    );
  }

  if (productos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600 text-lg">
          No se encontraron productos con los filtros seleccionados.
        </p>
        <Button onClick={onClearFilters} className="mt-4">
          Limpiar filtros
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Resultados header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-neutral-600">
          Mostrando {productos.length} productos
        </p>
      </div>

      {/* Grid de productos */}
      <div
        className={`grid gap-6 ${
          viewMode === 'grid'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1'
        }`}
      >
        {productos.map((producto) => (
          <ProductCard
            key={producto.id}
            product={producto}
            className={`transform transition-all duration-300 hover:scale-[1.02] ${
              viewMode === 'list' ? 'flex' : ''
            }`}
          />
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Anterior
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? 'default' : 'outline'}
              onClick={() => onPageChange(page)}
              className="w-10 h-10"
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Siguiente
          </Button>
        </div>
      )}
    </>
  );
};

export default ProductosGrid;
