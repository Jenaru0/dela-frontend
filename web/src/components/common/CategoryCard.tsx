"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

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
  const categoryName = category.name || category.nombre || "Categoría";
  const categoryImage =
    category.image || category.imagen || "/images/category-fallback.png";
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
        className={`group relative overflow-hidden aspect-square transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer ${className}`}
      >
        <div className="relative h-full w-full">
          <Image
            src={categoryImage}
            alt={categoryName}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.src = "/images/category-fallback.png";
            }}
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-all duration-300 group-hover:from-black/40" />

          {/* Content overlay */}
          <CardContent className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="text-lg font-semibold mb-1 transition-transform duration-300 group-hover:translate-y-[-2px]">
              {categoryName}
            </h3>

            {showProductCount && category.productCount && (
              <p className="text-sm opacity-80 mb-2">
                {category.productCount} productos
              </p>
            )}
            <div className="flex items-center text-sm opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-[-2px]">
              <span>Ver productos</span>
              <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </CardContent>

          {/* Decorative element */}
          <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-[#CC9F53]/20 backdrop-blur-sm transition-all duration-300 group-hover:bg-[#CC9F53]/30 group-hover:scale-110" />
        </div>
      </Card>
    </Link>
  );
};

export default CategoryCard;
