import React, { useState } from 'react';
import CatalogoCard from './CatalogoCard';
import { Producto } from '@/types/productos';

interface CatalogoGridProps {
  productos: Producto[];
  onAddToCart?: (product: CatalogoCardProduct) => void;
}

type CatalogoCardProduct = {
  id: number | string;
  name: string;
  image: string;
  category: string;
  price?: number;
  priceFormatted?: string;
  shortDescription?: string;
  destacado?: boolean;
};

const mapProductoToCatalogoCard = (
  producto: Producto
): CatalogoCardProduct => ({
  id: producto.id,
  name: producto.nombre,
  image:
    producto.imagenes.find((img) => img.principal)?.url ||
    producto.imagenes[0]?.url ||
    '/images/product-placeholder.png',
  category: producto.categoria?.nombre || '',
  price: producto.precioUnitario ? Number(producto.precioUnitario) : undefined,
  priceFormatted: producto.precioUnitario
    ? `S/ ${producto.precioUnitario}`
    : 'Precio no disponible',
  shortDescription: producto.descripcion,
  destacado: producto.destacado,
});

const PAGE_SIZE = 12;

const CatalogoGrid: React.FC<CatalogoGridProps> = ({
  productos,
  onAddToCart,
}) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(productos.length / PAGE_SIZE);
  const startIdx = (page - 1) * PAGE_SIZE;
  const endIdx = startIdx + PAGE_SIZE;
  const productosPagina = productos.slice(startIdx, endIdx);

  if (!productos.length)
    return <p className="text-center py-10 text-gray-400">No hay productos.</p>;

  return (
    <section className="py-10 bg-[#FAF6EF]">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-left text-[#2d2418] mb-8">
          Catálogo de Productos
        </h2>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {productosPagina.map((producto) => (
            <CatalogoCard
              key={producto.id}
              product={mapProductoToCatalogoCard(producto)}
              showStar={false}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-10">
            <button
              className="px-4 py-2 rounded-lg bg-[#F5EFD7] text-[#CC9F53] font-semibold disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Anterior
            </button>
            <span className="text-[#7B7261] font-medium">
              Página {page} de {totalPages}
            </span>
            <button
              className="px-4 py-2 rounded-lg bg-[#F5EFD7] text-[#CC9F53] font-semibold disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CatalogoGrid;
