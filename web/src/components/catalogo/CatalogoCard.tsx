'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Star, Heart, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritoContext';
import { useAuthModalGlobal } from '@/contexts/AuthModalContext';

interface CatalogoCardProps {
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
  onAddToCart?: (product: CatalogoCardProps['product']) => void;
  onQuickView?: (product: CatalogoCardProps['product']) => void;
  className?: string;
}

const CatalogoCard: React.FC<CatalogoCardProps> = ({
  product,
  showFavorite = true,
  showStar,
  onAddToCart,
  onQuickView,
  className = '',
}) => {
  const { isAuthenticated } = useAuth();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { open: openAuthModal } = useAuthModalGlobal(); // <-- Obtiene el método para abrir el modal
  const fav = isFavorite(product.id.toString());

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
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  // Handler para añadir al carrito con auth
  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevenir que se active el click de la tarjeta
    
    if (!isAuthenticated) {
      openAuthModal('login'); // <-- Abre el modal de login/registro
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
      className={`group relative rounded-2xl bg-white shadow-md border border-[#F5EFD7] overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:shadow-xl hover:shadow-[#CC9F53]/10 w-full cursor-pointer ${className}`}
      onClick={() => onQuickView?.(product)}
    >
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#F5EFD7]/80 via-white to-[#F5EFD7]/40">
        {/* Marca y Estrella */}
        <div className="absolute flex gap-1 sm:gap-2 left-2 sm:left-3 top-2 sm:top-3 z-10 items-center">
          {showStar && product.destacado && (
            <Star className="w-4 h-4 sm:w-6 sm:h-6 text-[#CC9F53] fill-[#CC9F53] drop-shadow-md" />
          )}
          <div>
            <span className="text-sm sm:text-lg font-extrabold text-[#cc9f53] leading-none block">
              DELA
            </span>
            <span className="text-[10px] sm:text-[12px] text-[#bfa97d] font-medium block -mt-1">
              Lácteos Frescos
            </span>
          </div>
        </div>

        {/* Corazón Favorito */}
        {showFavorite && (
          <Button
            variant="ghost"
            size="icon"
            className={`absolute right-2 sm:right-3 top-2 sm:top-3 z-10 h-7 w-7 sm:h-9 sm:w-9 rounded-full bg-white/90 backdrop-blur-md transition-all duration-200 hover:bg-white hover:scale-110 shadow-lg ${
              fav
                ? 'text-red-500 shadow-red-200 animate-pop-fav'
                : 'text-[#525252] hover:text-[#CC9F53]'
            }`}
            onClick={handleFavoriteClick}
            aria-label={fav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          >
            <Heart
              className={`h-3 w-3 sm:h-4 sm:w-4 transition-all ${
                fav ? 'fill-current scale-110' : ''
              }`}
            />
          </Button>
        )}

        <Image
          src={product.image || '/images/product-placeholder.png'}
          alt={product.name || 'Producto'}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-4 sm:p-8 transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
          style={{ zIndex: 1 }}
        />        <span className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-[#CC9F53]/90 text-white text-[10px] sm:text-xs font-semibold rounded-lg px-2 sm:px-3 py-[2px] z-10 shadow-sm backdrop-blur-sm">
          {product.category}
        </span>
      </div>

      <div className="px-3 sm:px-5 pt-2 pb-2 flex flex-col gap-1">        <h3 className="font-bold text-sm sm:text-base text-[#2d2418] line-clamp-2">
          {product.name}
        </h3>
        {product.shortDescription && (
          <span className="text-[11px] sm:text-[13px] text-[#7B7261] mb-1 line-clamp-2">
            {product.shortDescription}
          </span>
        )}
        <span className="text-lg sm:text-xl font-bold text-[#CC9F53] mb-1 sm:mb-2">
          {product.priceFormatted ?? 'Precio no disponible'}
        </span>
      </div>
      
      <div className="px-3 sm:px-5 pb-3 sm:pb-5">
        <Button
          className="w-full bg-[#CC9F53] hover:bg-[#b08a3c] text-white font-semibold rounded-lg transition-all duration-300 py-2 sm:py-3 shadow flex items-center justify-center gap-1 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
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
          <ShoppingBag
            className={`h-3 w-3 sm:h-5 sm:w-5 ${isAddingToCart ? 'animate-pulse' : ''}`}
          />
          <span className="hidden sm:inline">
            {isAddingToCart ? 'Añadiendo...' : 'Añadir al carrito'}
          </span>
          <span className="sm:hidden">
            {isAddingToCart ? 'Añadiendo...' : 'Añadir'}
          </span>
        </Button>
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

export default CatalogoCard;
