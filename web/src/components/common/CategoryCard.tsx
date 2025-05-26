'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';

interface CategoryCardProps {
  category: {
    id?: string;
    name?: string;
    nombre?: string;
    image?: string;
    imagen?: string;
    productCount?: number;
    href?: string;
  };
  className?: string;
  showProductCount?: boolean;
  animationDelay?: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  className,
  showProductCount,
  animationDelay,
}) => {
  // Handle both interface formats: nombre/imagen (legacy) and name/image (new)
  const categoryName = category.name || category.nombre || 'Categoría';
  const categoryImage =
    category.image || category.imagen || '/images/category-fallback.png';
  const categoryId = category.id || categoryName.toLowerCase();
  const href = category.href || `/categorias/${categoryId}`;

  return (
    <Link
      href={href}
      className="block"
      style={{
        animationDelay: animationDelay ? `${animationDelay}ms` : undefined,
      }}
    >
      <Card
        className={`group relative overflow-hidden aspect-square transition-all duration-500 hover:scale-[1.03] hover:shadow-xl hover:shadow-[#CC9F53]/15 cursor-pointer border-[#E6D5A8]/30 hover:border-[#CC9F53]/40 ${className}`}
      >
        <div className="relative h-full w-full">
          {/* Enhanced background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#F5EFD7]/20 via-transparent to-[#CC9F53]/10" />

          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('/images/pattern-bg.svg')] bg-cover bg-center" />

          <Image
            src={categoryImage}
            alt={categoryName}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
            onError={(e) => {
              e.currentTarget.src = '/images/category-fallback.png';
            }}
          />

          {/* Enhanced overlay gradient with better contrast for text */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20 transition-all duration-500 group-hover:from-[#3A3A3A]/70 group-hover:via-[#3A3A3A]/40" />

          {/* Enhanced decorative element with DELA styling */}
          <div className="absolute top-4 right-4 h-10 w-10 rounded-full bg-gradient-to-br from-[#CC9F53]/30 to-[#F5EFD7]/40 backdrop-blur-md border border-white/20 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 shadow-lg">
            <div className="absolute inset-1 rounded-full bg-gradient-to-br from-[#CC9F53]/40 to-transparent" />
          </div>

          {/* Content overlay con el nombre de la categoría centrado y fondo para mejor contraste */}
          <CardContent className="absolute inset-0 p-6 flex items-center justify-center pointer-events-none">
            <div className="relative flex items-center justify-center">
              {/* Fondo translúcido claro para mejor contraste y elegancia */}
              <div className="absolute inset-0 bg-[#F5EFD7]/80 backdrop-blur-md rounded-2xl shadow-lg" />
              <h3 className="relative text-3xl font-extrabold text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)] tracking-wide leading-tight text-center px-6 py-3 select-none">
                {categoryName}
              </h3>
            </div>
          </CardContent>

          {/* New: Enhanced hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#CC9F53]/20 via-transparent to-[#F5EFD7]/10 opacity-0 group-hover:opacity-100 transition-all duration-500" />
        </div>
      </Card>
    </Link>
  );
};

export default CategoryCard;
