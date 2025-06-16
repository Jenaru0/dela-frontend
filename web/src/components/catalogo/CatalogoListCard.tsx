'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Star, Heart, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritoContext';
import { useAuthModalGlobal } from '@/contexts/AuthModalContext';

interface CatalogoListCardProps {
  product: {
    id: number | string;
    name: string;
    image: string;
    category: string;
    price?: number;
    priceFormatted?: string;
    shortDescription?: string;
    destacado?: boolean;
  };
  showFavorite?: boolean;
  showStar?: boolean;
  onAddToCart?: (product: CatalogoListCardProps['product']) => void;
  onQuickView?: (product: CatalogoListCardProps['product']) => void;
  className?: string;
}

const CatalogoListCard: React.FC<CatalogoListCardProps> = ({
  product,
  showFavorite = true,
  showStar,
  onAddToCart,
  onQuickView,
  className = '',
}) => {
  const { isAuthenticated } = useAuth();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { open: openAuthModal } = useAuthModalGlobal();
  const fav = isFavorite(product.id.toString());
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Handler para añadir a favoritos con auth
  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    if (fav) {
      removeFavorite(product.id);
    } else {
      addFavorite(product.id);
    }
  };
  // Handler para añadir al carrito con auth
  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevenir que se active el click de la tarjeta
    
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    if (onAddToCart) {
      try {
        setIsAddingToCart(true);
        await onAddToCart(product);
      } catch (error) {
        console.error('Error adding to cart:', error);
      } finally {
        setIsAddingToCart(false);
      }
    }
  };return (
    <div
      className={`group relative rounded-lg bg-white shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-gray-300 w-full cursor-pointer ${className}`}
      onClick={() => onQuickView?.(product)}
    >
      <div className="flex items-center p-5 gap-5">
        {/* Imagen del producto */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
          {/* Marca */}
          <div className="absolute left-1.5 top-1.5 z-10">
            <div className="flex items-center gap-1">
              {showStar && product.destacado && (
                <span className="rounded-full p-0.5 bg-[#CC9F53] shadow-sm">
                  <Star className="w-2.5 h-2.5 text-white fill-current" />
                </span>
              )}
              <div className="text-[8px] leading-tight bg-white/90 rounded px-1 py-0.5">
                <span className="font-bold text-[#CC9F53] block">DELA</span>
                <span className="text-gray-600 font-medium block">Lácteos</span>
              </div>
            </div>
          </div>

          <Image
            src={product.image || '/images/product-placeholder.png'}
            alt={product.name || 'Producto'}
            fill
            sizes="(max-width: 640px) 96px, 112px"
            className="object-contain p-2 transition-all duration-300 group-hover:scale-105"
          />

          <span className="absolute bottom-1.5 left-1.5 bg-[#CC9F53] text-white text-[8px] font-medium rounded px-1.5 py-0.5 z-10">
            {product.category}
          </span>
        </div>

        {/* Información del producto */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 mb-1">
                {product.name}
              </h3>
              {product.shortDescription && (
                <p className="text-sm text-gray-600 line-clamp-1">
                  {product.shortDescription}
                </p>
              )}
            </div>
            
            {/* Precio */}
            <div className="text-right flex-shrink-0">
              <span className="text-xl font-bold text-[#CC9F53]">
                {product.priceFormatted ?? 'Precio no disponible'}
              </span>
            </div>
          </div>          {/* Acciones */}
          <div className="flex items-center justify-between">            <div className="flex items-center gap-2">
              {/* Botón añadir al carrito */}
              <Button
                size="sm"
                className="h-9 px-4 text-sm bg-[#CC9F53] hover:bg-[#b08a3c] text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                title={
                  isAuthenticated
                    ? isAddingToCart
                      ? 'Añadiendo al carrito...'
                      : 'Añadir al carrito'
                    : 'Inicia sesión para añadir al carrito'
                }
              >
                <ShoppingBag className={`w-4 h-4 mr-1.5 ${isAddingToCart ? 'animate-pulse' : ''}`} />
                <span className="hidden sm:inline">
                  {isAddingToCart ? 'Añadiendo...' : 'Añadir al carrito'}
                </span>
                <span className="sm:hidden">
                  {isAddingToCart ? 'Añadiendo...' : 'Añadir'}
                </span>
              </Button>
            </div>

            {/* Botón favorito */}
            {showFavorite && (
              <Button
                variant="ghost"
                size="sm"
                className={`h-9 w-9 p-0 rounded-lg transition-all duration-200 hover:scale-105 ${
                  fav
                    ? 'text-red-500 bg-red-50 hover:bg-red-100'
                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                }`}
                onClick={handleFavoriteClick}
                aria-label={fav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
              >
                <Heart
                  className={`h-4 w-4 transition-all ${
                    fav ? 'fill-current' : ''
                  }`}
                />
              </Button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pop-fav {
          0% {
            transform: scale(1);
          }
          60% {
            transform: scale(1.18);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-pop-fav {
          animation: pop-fav 0.1s cubic-bezier(0.68, -0.6, 0.1, 0.5);
        }
      `}</style>
    </div>
  );
};

export default CatalogoListCard;
