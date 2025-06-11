'use client';

import { useCart } from '@/contexts/CarContext';
import { useRouter } from 'next/navigation';
import { useCartDrawer } from '@/contexts/CartDrawerContext';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Heart, ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/lib/products';
import { useFavorites } from '@/contexts/FavoritoContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthModalGlobal } from '@/contexts/AuthModalContext';

interface ProductCardProps {
  product: Product;
  showFavorite?: boolean;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showFavorite = true,
  className,
}) => {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();
  const { open: openAuthModal } = useAuthModalGlobal();

  const fav = isFavorite(product.id);

  const handleFavoriteClick = () => {
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
  
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.oldPrice! - product.price) / product.oldPrice!) * 100
      )
    : 0;
  const { addToCart, isLoading } = useCart();
  const { openDrawer } = useCartDrawer();
  const [isAddingToCart, setIsAddingToCart] = useState(false);  const handleAddToCart = async () => {
    console.log('🔄 HandleAddToCart called', { 
      isAuthenticated, 
      product: { id: product.id, name: product.name },
      usuario: isAuthenticated ? 'user logged in' : 'no user'
    });
    
    if (!isAuthenticated) {
      console.log('❌ User not authenticated, opening auth modal');
      openAuthModal('login');
      return;
    }
    
    try {
      setIsAddingToCart(true);
      console.log('⏳ Adding product to cart...', { productId: product.id, productName: product.name });
      await addToCart(product);
      console.log('✅ Product added successfully, opening drawer');
      openDrawer();
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      alert(`Error añadiendo al carrito: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const router = useRouter();

  const handleQuickView = () => {
    router.push(`/productos/${product.id}`);
  };

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:shadow-xl hover:shadow-[#CC9F53]/10 border-[#E6D5A8]/30 hover:border-[#CC9F53]/40 bg-white ${className}`}
    >
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#F5EFD7]/80 via-white to-[#F5EFD7]/40">
        <div className="absolute inset-0 opacity-5 bg-[url('/images/pattern-bg.svg')] bg-cover bg-center" />

        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
        />

        {hasDiscount && (
          <Badge className="absolute left-3 top-3 z-10 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold shadow-lg animate-pulse">
            -{discountPercentage}% OFF
          </Badge>
        )}

        {showFavorite && (
          <Button
            variant="ghost"
            size="icon"
            className={`absolute right-3 top-3 z-10 h-9 w-9 rounded-full bg-white/90 backdrop-blur-md transition-all duration-300 hover:bg-white hover:scale-110 shadow-lg ${
              fav
                ? 'text-red-500 shadow-red-200'
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

        <Badge className="absolute bottom-3 left-3 bg-[#CC9F53]/90 text-white backdrop-blur-sm font-medium shadow-md">
          {product.category}
        </Badge>

        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="bg-white/95 text-[#CC9F53] hover:bg-[#CC9F53] hover:text-white transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg font-medium"
            onClick={handleQuickView}
          >
            Vista rápida
          </Button>
        </div>
      </div>

      <CardContent className="p-6 space-y-4">
        <Link href={`/productos/${product.id}`} className="group/link">
          <h3 className="font-bold text-lg text-[#3A3A3A] group-hover/link:text-[#CC9F53] transition-colors duration-300 mb-1 line-clamp-2 leading-tight">
            {product.name}
          </h3>
        </Link>

        <div className="space-y-1">
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-[#CC9F53] tracking-tight">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-base text-[#525252]/60 line-through font-medium">
                {formatPrice(product.oldPrice!)}
              </span>
            )}
          </div>

          {hasDiscount && (
            <p className="text-sm text-green-600 font-medium">
              Ahorras {formatPrice(product.oldPrice! - product.price)}
            </p>
          )}
        </div>
      </CardContent>      <CardFooter className="p-6 pt-0 space-y-3">
        {/* Debug info */}
        <div className="text-xs text-gray-500">
          {isAuthenticated ? '✅ Autenticado' : '❌ No autenticado'}
        </div>
        
        {/* Simple test button */}
        <button 
          className="w-full bg-red-500 text-white p-2 rounded"
          onClick={() => {
            console.log('🔥 SIMPLE BUTTON CLICKED!');
            alert('Simple button works!');
          }}
        >
          TEST SIMPLE BUTTON
        </button>
        
        <Button
          className="w-full bg-[#CC9F53] hover:bg-[#CC9F53]/90 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl hover:shadow-[#CC9F53]/20 transition-all duration-300 transform hover:scale-[1.02] group/btn disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          size="default"
          onClick={() => {
            console.log('🔥 BUTTON CLICKED! Simple test');
            alert('Button clicked!');
            handleAddToCart();
          }}
          disabled={isAddingToCart || isLoading}
        >
          <ShoppingBag className={`mr-2 h-5 w-5 transition-transform group-hover/btn:scale-110 ${isAddingToCart ? 'animate-pulse' : ''}`} />
          {isAddingToCart ? 'Añadiendo...' : 'Añadir al carrito'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
