'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Layout from '@/components/layout/Layout';
import { useFavorites } from '@/contexts/FavoritoContext';
import { useCart } from '@/contexts/CarContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthModalGlobal } from '@/contexts/AuthModalContext';
import { useStockAlertGlobal } from '@/contexts/StockAlertContext';
import { Button } from '@/components/ui/Button';
import { Heart, Trash2, Lock, ShoppingCart, Home, User } from 'lucide-react';
import { Producto, ImagenProducto } from '@/types/productos';
import { Favorito } from '@/types/favorito';

// Cargar el modal de forma dinámica para evitar problemas de SSR
const ClearFavoritesModal = dynamic(
  () => import('@/components/favoritos/ClearFavoritesModal'),
  {
    ssr: false,
  }
);

// Tipo para el producto cuando se añade al carrito
interface CartProductData {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
}

function getImagenPrincipal(producto: Producto): string {
  if (Array.isArray(producto.imagenes) && producto.imagenes.length > 0) {
    const principal = producto.imagenes.find(
      (img: ImagenProducto) => img.principal
    );
    return (
      principal?.url ||
      producto.imagenes[0]?.url ||
      '/images/product-placeholder.png'
    );
  }
  return '/images/product-placeholder.png';
}

// Componente para un item de favorito individual
const FavoriteItem: React.FC<{
  fav: Favorito;
  onRemove: (id: string) => void;
  onAddToCart: (product: CartProductData) => void;
}> = ({ fav, onRemove, onAddToCart }) => {
  const product = {
    id: fav.producto.id.toString(),
    name: fav.producto.nombre,
    image: getImagenPrincipal(fav.producto),
    category: fav.producto.categoria?.nombre || '',
    price: Number(fav.producto.precioUnitario),
    priceFormatted: fav.producto.precioUnitario
      ? `S/ ${fav.producto.precioUnitario}`
      : 'Precio no disponible',
  };

  return (
    <div
      className="bg-white bg-opacity-95 rounded-2xl shadow-lg border border-[#ecd8ab] p-6 transition-all duration-300 group hover:shadow-xl hover:border-[#CC9F53] hover:bg-opacity-100"
      style={{ backdropFilter: 'blur(8px)' }}
    >
      <div className="flex items-start gap-6">
        {/* Imagen del producto */}
        <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-[#F5E6C6] to-[#FAF3E7] flex items-center justify-center border-2 border-[#CC9F53] overflow-hidden flex-shrink-0">
          <Image
            src={product.image}
            alt={product.name}
            className="w-20 h-20 object-contain"
            width={80}
            height={80}
          />
        </div>

        {/* Información del producto */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="flex-1">
              <Link href={`/productos/${product.id}`}>
                <h3 className="font-bold text-xl text-[#3A3A3A] hover:text-[#CC9F53] transition-colors cursor-pointer mb-2 line-clamp-2">
                  {product.name}
                </h3>
              </Link>
              <div className="inline-flex items-center bg-[#FAF3E7] text-[#C59D5F] px-3 py-1 rounded-full text-sm font-medium mb-4">
                {product.category}
              </div>
              {/* Precio */}
              <div className="text-2xl font-bold text-[#CC9F53] mb-4">
                {product.priceFormatted}
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => onAddToCart(product)}
                className="bg-[#CC9F53] hover:bg-[#b08a3c] text-white font-semibold rounded-lg transition-all duration-300 px-6 py-2.5 shadow-lg flex items-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                Añadir al carrito
              </Button>
              <Link
                href={`/productos/${product.id}`}
                className="text-[#CC9F53] hover:text-[#b08a3c] font-medium transition-colors"
              >
                Ver detalles
              </Link>
            </div>

            {/* Botón eliminar de favoritos */}
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-red-50 hover:text-red-600 transition-all duration-200 p-2"
              title="Eliminar de favoritos"
              onClick={() => onRemove(product.id)}
            >
              <Trash2 className="h-5 w-5 text-red-400 group-hover:text-red-600" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para favoritos vacíos
const FavoritosEmpty: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-20">
    <div className="w-32 h-32 bg-gradient-to-br from-[#F5E6C6] to-[#FAF3E7] rounded-full flex items-center justify-center mb-8 shadow-lg border-2 border-[#ecd8ab]">
      <Heart className="w-16 h-16 text-[#CC9F53]" />
    </div>
    <h3 className="text-2xl font-bold text-[#3A3A3A] mb-3">
      Tu lista de favoritos está vacía
    </h3>
    <p className="text-gray-600 mb-8 text-center max-w-md">
      Guarda tus productos favoritos para acceder a ellos rápidamente y no
      perder de vista lo que más te gusta
    </p>{' '}
    <div className="flex flex-col sm:flex-row gap-3">
      {' '}
      <Link
        href="/"
        className="bg-gradient-to-r from-[#CC9F53] to-[#b08a3c] hover:from-[#b08a3c] hover:to-[#9a7635] text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg flex items-center gap-2"
      >
        <Home className="w-5 h-5" />
        Ir al inicio
      </Link>
      <Link
        href="/carrito"
        className="border-2 border-[#CC9F53] text-[#CC9F53] hover:bg-[#CC9F53] hover:text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2"
      >
        <ShoppingCart className="w-5 h-5" />
        Ver mi carrito
      </Link>
    </div>
  </div>
);

export default function FavoritosPage() {
  const { favorites, removeFavorite } = useFavorites();
  const { addToCart } = useCart();
  const { isAuthenticated, usuario, isLoading } = useAuth();
  const { open: openAuthModal } = useAuthModalGlobal();
  const { showError, showMultipleProductsError } = useStockAlertGlobal();

  // Estado para el modal de limpiar favoritos
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const handleRemoveFavorite = async (productId: string) => {
    await removeFavorite(productId);
  };

  const handleAddToCart = async (product: CartProductData) => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    
    try {
      const result = await addToCart({
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        category: product.category,
        stock: undefined, // Dejar que el backend maneje el stock real
      });
      
      if (!result.success) {
        showError(
          product.name, // Pasamos el nombre del producto aquí
          result.error || 'No se pudo agregar el producto al carrito. Por favor, intenta nuevamente.'
        );
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      showError(
        product.name, // También aquí pasamos el nombre del producto
        'Error inesperado al agregar el producto al carrito.'
      );
    }
  };

  const handleAddAllToCart = async () => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    
    const failedProducts: Array<{ name: string; message?: string }> = [];
    
    for (const fav of favorites) {
      try {
        const result = await addToCart({
          id: fav.producto.id.toString(),
          name: fav.producto.nombre,
          image: getImagenPrincipal(fav.producto),
          category: fav.producto.categoria?.nombre || '',
          price: Number(fav.producto.precioUnitario),
          stock: undefined, // Dejar que el backend maneje el stock real
        });
        
        if (!result.success) {
          failedProducts.push({
            name: fav.producto.nombre,
            message: result.error
          });
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        failedProducts.push({
          name: fav.producto.nombre,
          message: 'Error inesperado al agregar el producto al carrito.'
        });
      }
    }
    
    // Si hay productos que fallaron, mostrar el modal con múltiples productos
    if (failedProducts.length > 0) {
      if (failedProducts.length === 1) {
        // Si solo un producto falló, usar el modal de producto único
        showError(
          failedProducts[0].name,
          failedProducts[0].message || 'No se pudo agregar el producto al carrito.'
        );
      } else {
        // Si múltiples productos fallaron, usar el modal de múltiples productos
        showMultipleProductsError(
          failedProducts,
          `${failedProducts.length} de ${favorites.length} productos no se pudieron agregar al carrito por problemas de stock.`
        );
      }
    }
    
    // Opcional: Mostrar mensaje de éxito si algunos productos se agregaron correctamente
    // (esto podría ser otra notificación separada)
  };

  const handleClearAllFavorites = async () => {
    try {
      // Eliminar todos los favoritos uno por uno
      for (const fav of favorites) {
        await removeFavorite(fav.producto.id.toString());
      }
      // Aquí podrías añadir una notificación de éxito
    } catch (error) {
      console.error('Error al limpiar favoritos:', error);
      // Aquí podrías añadir una notificación de error
    }
  };

  // Mostrar loading durante la verificación inicial
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-[#F5EFD7]/30">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#CC9F53] mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-[#3A3A3A] mb-2">
              Verificando sesión...
            </h2>
            <p className="text-gray-600">
              Por favor espera mientras verificamos tu autenticación
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // Verificar autenticación
  if (!isAuthenticated || !usuario) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-[#F5EFD7]/30">
          <div className="text-center">
            <User className="h-16 w-16 text-[#CC9F53] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#3A3A3A] mb-2">
              Acceso Restringido
            </h2>
            <p className="text-gray-600 mb-6">
              Debes iniciar sesión para acceder a tu lista de favoritos
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => window.history.back()}>Volver</Button>
              <Link href="/productos">
                <Button variant="outline">Ver productos</Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Layout>
        <div className="min-h-screen py-10 bg-gradient-to-br from-[#fffbe6] via-[#fffaf1] to-[#fff]">
          <div className="container mx-auto px-2 max-w-5xl">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-[#C59D5F] tracking-tight flex items-center gap-3">
              <Heart className="w-8 h-8 text-[#CC9F53]" /> Mis Favoritos
            </h1>

            {/* ...existing code... */}

            {/* CTA y estadísticas */}
            <div className="mb-8 bg-white/80 rounded-2xl p-6 shadow-lg border border-[#ecd8ab]">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#F5E6C6] to-[#FAF3E7] rounded-xl flex items-center justify-center">
                    <Lock className="w-6 h-6 text-[#CC9F53]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-[#3A3A3A]">
                      Tus favoritos guardados
                    </h2>
                    <p className="text-[#9A8C61] text-sm">
                      Acceso rápido a tus productos preferidos
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {favorites.length > 0 && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#CC9F53]">
                        {favorites.length}
                      </div>
                      <div className="text-xs text-gray-600">
                        Productos guardados
                      </div>
                    </div>
                  )}
                  <Link
                    href="/productos"
                    className="bg-gradient-to-r from-[#CC9F53] to-[#b08a3c] hover:from-[#b08a3c] hover:to-[#9a7635] text-white font-semibold px-5 py-2.5 rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Descubrir más productos
                  </Link>
                </div>
              </div>
            </div>

            {favorites.length === 0 ? (
              <FavoritosEmpty />
            ) : (
              <div className="grid md:grid-cols-1 gap-8">
                {/* Lista de favoritos */}
                <div className="flex flex-col gap-6">
                  {favorites.map((fav) => (
                    <FavoriteItem
                      key={fav.producto.id}
                      fav={fav}
                      onRemove={handleRemoveFavorite}
                      onAddToCart={handleAddToCart}
                    />
                  ))}

                  {/* Resumen y acciones masivas */}
                  <div className="bg-gradient-to-r from-white/95 to-[#FAF3E7]/50 rounded-2xl p-6 shadow-lg border border-[#ecd8ab] mt-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#CC9F53] to-[#b08a3c] rounded-xl flex items-center justify-center">
                          <Heart className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-[#3A3A3A]">
                            {favorites.length}{' '}
                            {favorites.length === 1
                              ? 'producto favorito'
                              : 'productos favoritos'}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Realiza acciones con todos tus favoritos de una vez
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <Button
                          onClick={handleAddAllToCart}
                          className="bg-gradient-to-r from-[#CC9F53] to-[#b08a3c] hover:from-[#b08a3c] hover:to-[#9a7635] text-white font-semibold px-5 py-2.5 rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg w-full sm:w-auto"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Añadir todos al carrito ({favorites.length})
                        </Button>

                        <Button
                          variant="outline"
                          className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 transition-all duration-200 w-full sm:w-auto"
                          onClick={() => setIsClearModalOpen(true)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Limpiar lista
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>

      {/* Modal con renderizado condicional */}
      {isClearModalOpen && (
        <ClearFavoritesModal
          isOpen={isClearModalOpen}
          onClose={() => setIsClearModalOpen(false)}
          onConfirm={handleClearAllFavorites}
          favoritesCount={favorites.length}
        />
      )}
    </>
  );
}
