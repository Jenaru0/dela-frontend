'use client';

import React, { useState, useMemo, useCallback, Suspense } from 'react';
import Layout from '@/components/layout/Layout';
import ProductosPageHeader from '@/components/productos/ProductosPageHeader';
import ProductosSearchBar from '@/components/productos/ProductosSearchBar';
import ProductosFilters from '@/components/productos/ProductosFilters';
import ActiveFilters from '@/components/productos/ActiveFilters';
import SearchParamsHandler from '@/components/productos/SearchParamsHandler';
import CatalogoCard from '@/components/catalogo/CatalogoCard';
import CatalogoListCard from '@/components/catalogo/CatalogoListCard';
import { useCatalogo } from '@/hooks/useCatalogo';
import { useCart } from '@/contexts/CarContext';
import { useCartDrawer } from '@/contexts/CartDrawerContext';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/products';

import type { FilterState } from '@/types/productos';

// Import the CatalogoCard props type for better typing
type CatalogoCardProps = {
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
};

const initialFilters: FilterState = {
  search: '',
  category: '',
  priceMin: '',
  priceMax: '',
  destacado: false,
  disponible: false,
  sortBy: 'default',
  sortOrder: 'asc', // SOLO puede ser 'asc' o 'desc'
};

const PAGE_SIZE = 12;

export default function CatalogoProductosPage() {
  const { productos, loading, error } = useCatalogo();
  const { addToCart } = useCart();
  const { openDrawer } = useCartDrawer();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [page, setPage] = useState(1);
  // Función para manejar cambios en los parámetros de URL
  const handleParamsChange = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);

  // Extraer categorías únicas
  const categorias = useMemo(() => {
    const nombres: Record<string, boolean> = {};
    return productos
      .map((p) => p.category)
      .filter((nombre) => {
        if (!nombre || nombres[nombre]) return false;
        nombres[nombre] = true;
        return true;
      })
      .map((nombre, idx) => ({
        id: idx + 1,
        nombre,
      }));
  }, [productos]);

  // Contador de filtros activos
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.category) count++;
    if (filters.priceMin) count++;
    if (filters.priceMax) count++;
    if (filters.destacado) count++;
    if (filters.disponible) count++;
    return count;
  }, [filters]);

  // Filtrado de productos
  const productosFiltrados = useMemo(() => {
    let resultado = productos;

    // Búsqueda por nombre o descripción
    if (filters.search.trim() !== '') {
      const s = filters.search.toLowerCase();
      resultado = resultado.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          (p.shortDescription && p.shortDescription.toLowerCase().includes(s))
      );
    }

    // Filtro por categoría
    if (filters.category) {
      resultado = resultado.filter((p) => p.category === filters.category);
    }

    // Filtro por rango de precios
    const min = parseFloat(filters.priceMin);
    const max = parseFloat(filters.priceMax);
    if (!isNaN(min)) {
      resultado = resultado.filter(
        (p) => typeof p.price === 'number' && p.price >= min
      );
    }
    if (!isNaN(max)) {
      resultado = resultado.filter(
        (p) => typeof p.price === 'number' && p.price <= max
      );
    }

    // Solo destacados
    if (filters.destacado) {
      resultado = resultado.filter((p) => p.destacado);
    }

    // Solo disponibles (ajusta al campo real si lo tienes)
    if (filters.disponible) {
      resultado = resultado.filter((p) => p.disponible !== false);
    }

    // Ordenamiento
    if (filters.sortBy) {
      resultado = [...resultado].sort((a, b) => {
        let vA, vB;

        switch (filters.sortBy) {
          case 'nombre':
            vA = a.name?.toLowerCase() ?? '';
            vB = b.name?.toLowerCase() ?? '';
            break;
          case 'precioUnitario':
            vA = a.price ?? 0; // asegúrate que este campo coincide con tu normalizador
            vB = b.price ?? 0;
            break;
          case 'creadoEn':
            vA = new Date(
              (a as { createdAt?: string; creadoEn?: string }).createdAt ??
                (a as { creadoEn?: string }).creadoEn ??
                0
            ).getTime();
            vB = new Date(
              (b as { createdAt?: string; creadoEn?: string }).createdAt ??
                (b as { creadoEn?: string }).creadoEn ??
                0
            ).getTime();
            break;
          case 'destacado':
            vA = a.destacado ? 1 : 0;
            vB = b.destacado ? 1 : 0;
            break;
          default:
            vA = 0;
            vB = 0;
        }

        if (vA < vB) return filters.sortOrder === 'asc' ? -1 : 1;
        if (vA > vB) return filters.sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return resultado;
  }, [productos, filters]);

  // Paginación
  const totalPages = Math.ceil(productosFiltrados.length / PAGE_SIZE);
  const startIdx = (page - 1) * PAGE_SIZE;
  const endIdx = startIdx + PAGE_SIZE;
  const productosPagina = productosFiltrados.slice(startIdx, endIdx);

  // Handlers
  const handleFilterChange = (
    key: keyof FilterState,
    value: string | boolean
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1); // Reinicia la página al cambiar filtros
  };  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
    setPage(1); // Reinicia la página al limpiar filtros
    
    // Limpiar los parámetros de URL
    const url = new URL(window.location.href);
    url.searchParams.delete('search');
    url.searchParams.delete('categoria');
    router.replace(url.pathname, { scroll: false });
  }, [router]);

  const handleSortChange = (sortValue: string) => {
    const [sortBy, sortOrderRaw] = sortValue.split(':');
    const sortOrder: 'asc' | 'desc' = sortOrderRaw === 'desc' ? 'desc' : 'asc';
    setFilters((prev) => ({ ...prev, sortBy, sortOrder }));
    setPage(1); // Reinicia la página al cambiar orden
  };
  // Handle cart functionality
  const handleAddToCart = async (product: CatalogoCardProps['product']) => {
    console.log('🛒 Adding to cart from productos page:', product);
    try {
      // Convert CatalogoCard product format to cart format
      const cartProduct: Product = {
        id: product.id.toString(),
        name: product.name,
        price: product.price || 0,
        image: product.image || '/images/products/producto_sinimage.svg',
        category: product.category || 'Sin categoría',
        description: product.shortDescription || '',
        stock: 99, // Default stock
      };

      await addToCart(cartProduct);
      openDrawer();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // Handle quick view
  const handleQuickView = (product: CatalogoCardProps['product']) => {
    router.push(`/productos/${product.id}`);
  };
  return (
    <Layout>
      {/* Manejo de parámetros de URL */}
      <Suspense fallback={null}>
        <SearchParamsHandler onParamsChange={handleParamsChange} />
      </Suspense>
      
      <div className="min-h-screen bg-gradient-to-b from-[#F5EFD7]/20 to-white">
        <ProductosPageHeader /><div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">          <ProductosSearchBar
            filters={filters}
            viewMode={viewMode}
            showFilters={showFilters}
            activeFiltersCount={activeFiltersCount}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            onViewModeChange={setViewMode}
            onToggleFilters={() => setShowFilters(!showFilters)}
          />

          {/* Mostrar filtros activos */}
          <ActiveFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
          />

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {showFilters && (
              <div className={`
                lg:block
                ${showFilters ? 'block' : 'hidden'}
              `}>
                <ProductosFilters
                  filters={filters}
                  categorias={categorias}
                  activeFiltersCount={activeFiltersCount}
                  onFilterChange={handleFilterChange}
                  onClearFilters={clearFilters}
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              {loading && (
                <div className="text-center py-16 sm:py-20">
                  <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-[#CC9F53] mx-auto mb-4"></div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#3A3A3A] mb-2">
                    Cargando productos...
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Por favor espera mientras cargamos el catálogo
                  </p>
                </div>
              )}

              {error && (
                <div className="py-16 sm:py-20 text-center text-red-500 text-base sm:text-lg font-bold">
                  Error: {error}
                </div>
              )}

              {!loading && !error && (
                <>                  <div
                    className={`${
                      viewMode === 'grid'
                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-6'
                        : 'flex flex-col gap-4'
                    }`}
                  >
                    {productosFiltrados.length === 0 && (
                      <div className="col-span-full text-center text-gray-500 py-12 sm:py-16">
                        <p className="text-sm sm:text-base">No hay productos.</p>
                      </div>
                    )}                    {productosPagina.map((producto) => (
                      viewMode === 'grid' ? (
                        <CatalogoCard
                          key={producto.id}
                          product={producto}
                          showFavorite={true}
                          showStar={producto.destacado}
                          onAddToCart={handleAddToCart}
                          onQuickView={handleQuickView}
                        />
                      ) : (
                        <CatalogoListCard
                          key={producto.id}
                          product={producto}
                          showFavorite={true}
                          showStar={producto.destacado}
                          onAddToCart={handleAddToCart}
                          onQuickView={handleQuickView}
                        />
                      )
                    ))}
                  </div>
                  
                  {/* Paginación */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-1 sm:gap-2 mt-8 sm:mt-10 px-4">
                      <button
                        className="rounded-full px-2 sm:px-3 py-1 sm:py-2 bg-white border border-[#CC9F53] text-[#CC9F53] font-bold shadow-sm hover:bg-[#FFF9EC] transition disabled:opacity-40 disabled:cursor-not-allowed text-sm sm:text-base"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        aria-label="Página anterior"
                      >
                        <span className="inline-block align-middle">←</span>
                      </button>
                      
                      <div className="flex gap-1 overflow-x-auto max-w-xs sm:max-w-none">
                        {Array.from({ length: totalPages }, (_, i) => (
                          <button
                            key={i}
                            className={`rounded-full w-7 h-7 sm:w-9 sm:h-9 font-bold border-2 transition-all duration-150 text-sm sm:text-base flex-shrink-0
                              ${page === i + 1
                                ? 'bg-[#CC9F53] text-white border-[#CC9F53] shadow'
                                : 'bg-white text-[#CC9F53] border-[#CC9F53] hover:bg-[#FFF9EC]'}
                            `}
                            onClick={() => setPage(i + 1)}
                            aria-current={page === i + 1 ? 'page' : undefined}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                      
                      <button
                        className="rounded-full px-2 sm:px-3 py-1 sm:py-2 bg-white border border-[#CC9F53] text-[#CC9F53] font-bold shadow-sm hover:bg-[#FFF9EC] transition disabled:opacity-40 disabled:cursor-not-allowed text-sm sm:text-base"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        aria-label="Página siguiente"
                      >
                        <span className="inline-block align-middle">→</span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
