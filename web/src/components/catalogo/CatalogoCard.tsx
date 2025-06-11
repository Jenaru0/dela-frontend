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
  const handleAddToCart = async () => {
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
  };

  return (
    <div
      className={`group relative rounded-2xl bg-white shadow-md border border-[#F5EFD7] overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:shadow-xl hover:shadow-[#CC9F53]/10 w-full ${className}`}
    >
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#F5EFD7]/80 via-white to-[#F5EFD7]/40">
        {/* Marca y Estrella */}
        <div className="absolute flex gap-2 left-3 top-3 z-10 items-center">
          {showStar && product.destacado && (
            <span className="rounded-full p-1 bg-[#CC9F53] shadow">
              <Star className="w-5 h-5 text-white" />
            </span>
          )}
          <div>
            <span className="text-lg font-extrabold text-[#cc9f53] leading-none block">
              DELA
            </span>
            <span className="text-[12px] text-[#bfa97d] font-medium block -mt-1">
              Lácteos Frescos
            </span>
          </div>
        </div>

        {/* Corazón Favorito */}
        {showFavorite && (
          <Button
            variant="ghost"
            size="icon"
            className={`absolute right-3 top-3 z-10 h-9 w-9 rounded-full bg-white/90 backdrop-blur-md transition-all duration-200 hover:bg-white hover:scale-110 shadow-lg ${
              fav
                ? 'text-red-500 shadow-red-200 animate-pop-fav'
                : 'text-[#525252] hover:text-[#CC9F53]'
            }`}
            onClick={handleFavoriteClick}
            aria-label={fav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          >
            <Heart
              className={`h-4 w-4 transition-all ${
                fav ? 'fill-current scale-110' : ''
              }`}
            />
          </Button>
        )}

        <Image
          src={product.image || '/images/product-placeholder.png'}
          alt={product.name || 'Producto'}
          fill
          className="object-contain p-8 transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
          style={{ zIndex: 1 }}
        />

        <span className="absolute bottom-3 left-3 bg-[#CC9F53]/90 text-white text-xs font-semibold rounded-lg px-3 py-[2px] z-10 shadow-sm backdrop-blur-sm">
          {product.category}
        </span>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <Button
            variant="ghost"
            size="sm"
            className={`
              bg-white/95 text-[#CC9F53]
              hover:bg-[#CC9F53] hover:text-white
              shadow-lg font-medium
              transition-all duration-300
              opacity-0 scale-95
              group-hover:opacity-100 group-hover:scale-100
              pointer-events-auto
            `}
            style={{ transition: 'all 0.23s cubic-bezier(.68,-0.6,.32,1.6)' }}
            onClick={() => onQuickView?.(product)}
          >
            Vista rápida
          </Button>
        </div>
      </div>

      <div className="px-5 pt-2 pb-2 flex flex-col gap-1">
        <h3 className="font-bold text-base text-[#2d2418]">{product.name}</h3>
        {product.shortDescription && (
          <span className="text-[13px] text-[#7B7261] mb-1">
            {product.shortDescription}
          </span>
        )}
        <span className="text-xl font-bold text-[#CC9F53] mb-2">
          {product.priceFormatted ?? 'Precio no disponible'}
        </span>
      </div>
      <div className="px-5 pb-5">
        {' '}
        <Button
          className="w-full bg-[#CC9F53] hover:bg-[#b08a3c] text-white font-semibold rounded-lg transition-all duration-300 py-3 shadow flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
            className={`h-5 w-5 ${isAddingToCart ? 'animate-pulse' : ''}`}
          />
          {isAddingToCart ? 'Añadiendo...' : 'Añadir al carrito'}
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
