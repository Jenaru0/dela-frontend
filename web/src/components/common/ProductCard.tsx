"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/products";

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
  const [isFavorite, setIsFavorite] = React.useState(false);
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.oldPrice! - product.price) / product.oldPrice!) * 100
      )
    : 0;

  return (
    <Card
      className={`group overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${className}`}
    >
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#F5EFD7] to-white">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = "/images/product-fallback.png";
          }}
        />

        {/* Discount badge */}
        {hasDiscount && (
          <Badge variant="destructive" className="absolute left-2 top-2 z-10">
            -{discountPercentage}%
          </Badge>
        )}

        {/* Favorite button */}
        {showFavorite && (
          <Button
            variant="ghost"
            size="icon"
            className={`absolute right-2 top-2 z-10 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm transition-all hover:bg-white ${
              isFavorite ? "text-red-500" : "text-gray-400"
            }`}
            onClick={() => setIsFavorite(!isFavorite)}
            aria-label={
              isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"
            }
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
          </Button>
        )}

        {/* Category badge */}
        <Badge variant="secondary" className="absolute bottom-2 left-2">
          {product.category}
        </Badge>
      </div>

      <CardContent className="p-4">
        <Link href={`/productos/${product.id}`} className="group">
          <h3 className="font-semibold text-[#3A3A3A] group-hover:text-[#CC9F53] transition-colors mb-2 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating stars */}
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${
                i < 4 ? "fill-[#CC9F53] text-[#CC9F53]" : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">(4.0)</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-bold text-[#CC9F53]">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.oldPrice!)}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button className="w-full" size="sm">
          <ShoppingBag className="mr-2 h-4 w-4" />
          Añadir al carrito
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
