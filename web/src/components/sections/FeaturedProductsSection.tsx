'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/common/ProductCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Star, Filter, SortAsc } from 'lucide-react';
import { Product, products } from '@/lib/products';

interface FeaturedProductsSectionProps {
  products?: Product[];
  title?: string;
  subtitle?: string;
  showFilters?: boolean;
  maxProducts?: number;
}

const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  products: productsProp = products,
  title = 'Productos Destacados',
  subtitle = 'Descubre nuestra selección de productos artesanales más populares',
  showFilters = false,
  maxProducts = 8,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter products by category
  const filteredProducts =
    selectedCategory === 'all'
      ? productsProp.slice(0, maxProducts)
      : productsProp
          .filter(
            (product) =>
              product.category.toLowerCase() === selectedCategory.toLowerCase()
          )
          .slice(0, maxProducts);

  // Get unique categories
  const categories = Array.from(
    new Set(productsProp.map((product) => product.category))
  );

  return (
    <section className="py-16 bg-gradient-to-b from-white to-[#F5EFD7]/20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#CC9F53]/10 px-4 py-2 rounded-full text-[#CC9F53] font-medium text-sm mb-4">
            <Star className="h-4 w-4" />
            Productos Destacados
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#3A3A3A] mb-4">
            {title}
          </h2>

          <div className="w-20 h-1 bg-[#CC9F53] mx-auto mb-6"></div>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Category Filters */}
        {showFilters && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Badge
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              className={`cursor-pointer px-4 py-2 ${
                selectedCategory === 'all'
                  ? 'bg-[#CC9F53] text-white'
                  : 'text-[#CC9F53] hover:bg-[#CC9F53]/10'
              }`}
              onClick={() => setSelectedCategory('all')}
            >
              Todos
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className={`cursor-pointer px-4 py-2 ${
                  selectedCategory === category
                    ? 'bg-[#CC9F53] text-white'
                    : 'text-[#CC9F53] hover:bg-[#CC9F53]/10'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 mb-12">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              className="transform transition-all duration-300 hover:scale-[1.02]"
            />
          ))}
        </div>

        {/* Show More Button */}
        <div className="text-center">
          <Link href="/productos">
            <Button size="lg" className="group">
              Ver Todos los Productos
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Product Highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-lg bg-[#F5EFD7]/30">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#CC9F53]/20 rounded-full mb-4">
              <Star className="h-6 w-6 text-[#CC9F53]" />
            </div>
            <h3 className="text-lg font-semibold text-[#3A3A3A] mb-2">
              Calidad Premium
            </h3>
            <p className="text-gray-600">
              Productos seleccionados con los más altos estándares de calidad
            </p>
          </div>

          <div className="text-center p-6 rounded-lg bg-[#F5EFD7]/30">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#CC9F53]/20 rounded-full mb-4">
              <Filter className="h-6 w-6 text-[#CC9F53]" />
            </div>
            <h3 className="text-lg font-semibold text-[#3A3A3A] mb-2">
              100% Artesanal
            </h3>
            <p className="text-gray-600">
              Elaborados a mano con técnicas tradicionales y recetas familiares
            </p>
          </div>

          <div className="text-center p-6 rounded-lg bg-[#F5EFD7]/30">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#CC9F53]/20 rounded-full mb-4">
              <SortAsc className="h-6 w-6 text-[#CC9F53]" />
            </div>
            <h3 className="text-lg font-semibold text-[#3A3A3A] mb-2">
              Ingredientes Locales
            </h3>
            <p className="text-gray-600">
              Utilizamos solo ingredientes frescos y naturales del valle
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsSection;
