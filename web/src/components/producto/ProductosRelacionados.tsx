'use client';

import React, { useMemo } from 'react';
import { useCatalogo } from '@/hooks/useCatalogo';
import CatalogoCard from '@/components/catalogo/CatalogoCard';
import { useCart } from '@/contexts/CarContext';
import { useCartDrawer } from '@/contexts/CartDrawerContext';
import { useStockAlertGlobal } from '@/contexts/StockAlertContext';
import { useRouter } from 'next/navigation';

interface ProductosRelacionadosProps {
  productoId: number | string;
}

interface CatalogoCardProduct {
  id: number | string;
  name: string;
  image: string;
  category: string;
  price?: number;
  priceFormatted?: string;
  shortDescription?: string;
  destacado?: boolean;
}

const ProductosRelacionados: React.FC<ProductosRelacionadosProps> = ({ 
  productoId 
}) => {const { productos, loading } = useCatalogo();
  const { addToCart } = useCart();
  const { openDrawer } = useCartDrawer();
  const { showError } = useStockAlertGlobal();
  const router = useRouter();

  // Filtrar productos relacionados
  const productosRelacionados = useMemo(() => {
    if (loading || productos.length === 0) return [];
    
    // Primero encontrar el producto actual para obtener su categoría
    const productoActual = productos.find(p => p.id.toString() === productoId.toString());    const categoriaActual = productoActual?.category;
    
    const filtrados = productos.filter(producto => {
      const esDiferente = producto.id.toString() !== productoId.toString();
      const mismaCategoria = producto.category === categoriaActual;
      
      return esDiferente && mismaCategoria;
    });
    
    return filtrados.slice(0, 4); // Mostrar máximo 4 productos
  }, [productos, productoId, loading]);

  if (loading) {
    return (
      <div className="py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CC9F53] mx-auto"></div>
          <p className="mt-2 text-gray-500">Cargando productos relacionados...</p>
        </div>
      </div>
    );
  }
  if (productosRelacionados.length === 0) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Artículos relacionados</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">No hay productos relacionados disponibles.</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = async (product: CatalogoCardProduct) => {
    try {
      const result = await addToCart({
        id: product.id.toString(),
        name: product.name,
        price: product.price || 0,
        image: product.image,
        category: product.category || 'Sin categoría',
        stock: undefined, // Dejar que el backend maneje el stock real
      });
      
      if (result.success) {
        openDrawer();
      } else {
        showError(
          'Error al agregar al carrito',
          result.error || 'No se pudo agregar el producto al carrito. Por favor, intenta nuevamente.'
        );
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      showError(
        'Error al agregar al carrito',
        'Error inesperado al agregar el producto al carrito.'
      );
    }
  };

  const handleQuickView = (product: CatalogoCardProduct) => {
    router.push(`/productos/${product.id}`);
  };
  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Artículos relacionados</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {productosRelacionados.map((producto) => (
          <CatalogoCard
            key={producto.id}
            product={producto}
            onAddToCart={handleAddToCart}
            onQuickView={handleQuickView}
            showFavorite={true}
            showStar={true}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductosRelacionados;
