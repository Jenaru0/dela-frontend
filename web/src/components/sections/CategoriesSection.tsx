"use client";

import React from "react";
import Link from "next/link";
import CategoryCard from "@/components/common/CategoryCard";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Grid3X3 } from "lucide-react";

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
    id: "mieles",
    name: "Mieles Artesanales",
    image: "/images/categories/mieles.jpg",
    productCount: 15,
    description: "Mieles puras y naturales del valle",
    featured: true,
  },
  {
    id: "mermeladas",
    name: "Mermeladas",
    image: "/images/categories/mermeladas.jpg",
    productCount: 28,
    description: "Dulces caseros con frutas frescas",
    featured: true,
  },
  {
    id: "conservas",
    name: "Conservas",
    image: "/images/categories/conservas.jpg",
    productCount: 22,
    description: "Conservas tradicionales del valle",
    featured: true,
  },
  {
    id: "lacteos",
    name: "Productos Lácteos",
    image: "/images/categories/lacteos.jpg",
    productCount: 18,
    description: "Quesos y lácteos artesanales",
    featured: true,
  },
  {
    id: "embutidos",
    name: "Embutidos",
    image: "/images/categories/embutidos.jpg",
    productCount: 12,
    description: "Embutidos curados tradicionales",
  },
  {
    id: "panaderia",
    name: "Panadería",
    image: "/images/categories/panaderia.jpg",
    productCount: 25,
    description: "Panes y dulces recién horneados",
  },
];

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories = defaultCategories,
  showAll = false,
  title = "Explora Nuestras Categorías",
  subtitle = "Descubre la variedad de productos artesanales que tenemos para ti",
}) => {
  const displayCategories = showAll
    ? categories
    : categories.filter((cat) => cat.featured).slice(0, 4);

  return (
    <section className="py-16 bg-gradient-to-b from-white to-[#F5EFD7]/20">
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
        </div>
        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
          {displayCategories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={{
                id: category.id,
                name: category.name,
                image: category.image,
                productCount: category.productCount,
                href: `/categorias/${category.id}`,
              }}
              showProductCount={true}
              animationDelay={index * 100}
            />
          ))}
        </div>{" "}
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
        )}
        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-[#CC9F53] mb-2">
              {categories.reduce((sum, cat) => sum + cat.productCount, 0)}+
            </div>
            <div className="text-sm md:text-base text-gray-600">
              Productos Únicos
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-[#CC9F53] mb-2">
              {categories.length}
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
              8+
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
