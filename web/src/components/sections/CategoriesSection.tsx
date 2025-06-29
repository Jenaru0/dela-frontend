'use client';

import React from 'react';
import Link from 'next/link';
import CategoryCard from '@/components/common/CategoryCard';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Grid3X3 } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { useStats } from '@/hooks/useStats';

interface Category {
  id: string;
  name: string;
  image: string;
  productCount: number;
  description?: string;
  featured?: boolean;
}

interface CategoriesSectionProps {
  categories?: Category[];
  showAll?: boolean;
  title?: string;
  subtitle?: string;
}

const defaultCategories: Category[] = [
  {
    id: 'leche',
    name: 'Leche DELA',
    image: 'https://dela.com.pe/img/leche__background.jpg',
    productCount: 3,
    description: 'Leche fresca de alta calidad de nuestro establo',
    featured: true,
  },
  {
    id: 'yogurt',
    name: 'Yogurt DELA',
    image: 'https://dela.com.pe/img/yogurt__background.jpg',
    productCount: 8,
    description: 'Yogures naturales y frutados, incluyendo yogurt griego',
    featured: true,
  },
  {
    id: 'quesos',
    name: 'Quesos DELA',
    image: 'https://dela.com.pe/img/queso__background.jpg',
    productCount: 12,
    description: 'Variedades de quesos artesanales frescos y madurados',
    featured: true,
  },
  {
    id: 'helados',
    name: 'Helados DELA',
    image: 'https://dela.com.pe/img/helado__background.jpg',
    productCount: 15,
    description: 'Helados elaborados con ingredientes naturales',
    featured: true,
  },
];

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories: propCategories,
  showAll = false,
  title = 'Nuestros Productos Lácteos',
  subtitle = 'Descubre la calidad y frescura de nuestros productos artesanales DELA',
}) => {
  // Obtener categorías y estadísticas reales
  const { categories: realCategories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { totalProductos, totalCategorias, loading: statsLoading, error: statsError } = useStats();

  // Usar categorías reales si están disponibles, sino usar las props o las por defecto
  const categories = realCategories.length > 0 ? realCategories : (propCategories || defaultCategories);
  
  const displayCategories = showAll
    ? categories
    : categories.filter((cat) => cat.featured).slice(0, 4);

  // Mostrar error si hay problemas con la carga de datos
  if (categoriesError) {
    console.warn('Error cargando categorías:', categoriesError);
  }
  if (statsError) {
    console.warn('Error cargando estadísticas:', statsError);
  }

  return (
    <section id="categorias" className="py-16 bg-gradient-to-b from-white to-[#F5EFD7]/20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#CC9F53]/10 px-4 py-2 rounded-full text-[#CC9F53] font-medium text-sm mb-4">
            <Grid3X3 className="h-4 w-4" />
            Nuestras Especialidades
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#3A3A3A] mb-4">
            {title}
          </h2>

          <div className="w-20 h-1 bg-[#CC9F53] mx-auto mb-6"></div>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
          {categoriesLoading ? (
            // Skeleton loading para categorías
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-xl aspect-[4/3] mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-3 rounded w-3/4"></div>
              </div>
            ))
          ) : (            displayCategories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={{
                  id: category.id.toString(),
                  name: 'nombre' in category ? category.nombre : category.name,
                  image: category.image,
                  productCount: category.productCount || 0,
                  href: `/productos?categoria=${encodeURIComponent('nombre' in category ? category.nombre : category.name)}`,
                }}
                animationDelay={index * 100}
              />
            ))
          )}
        </div>{' '}
        {/* Show All Button */}
        {!showAll && categories.length > 4 && (
          <div className="text-center">
            <Link href="/categorias">
              <Button size="lg" variant="outline" className="group">
                Ver Todas las Categorías
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        )}        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-[#CC9F53] mb-2">
              {statsLoading ? '...' : `${totalProductos || categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0)}+`}
            </div>
            <div className="text-sm md:text-base text-gray-600">
              Productos Únicos
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-[#CC9F53] mb-2">
              {statsLoading ? '...' : totalCategorias || categories.length}
            </div>
            <div className="text-sm md:text-base text-gray-600">Categorías</div>
          </div>

          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-[#CC9F53] mb-2">
              100%
            </div>
            <div className="text-sm md:text-base text-gray-600">Artesanal</div>
          </div>

          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-[#CC9F53] mb-2">
              25
            </div>
            <div className="text-sm md:text-base text-gray-600">
              Años de Experiencia
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
