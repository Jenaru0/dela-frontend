'use client';

import React, { useState, useMemo, useCallback, Suspense } from 'react';
import Layout from '@/components/layout/Layout';
import ProductosPageHeader from '@/components/productos/ProductosPageHeader';
import ProductosSearchBar from '@/components/productos/ProductosSearchBar';
import ProductosFilters from '@/components/productos/ProductosFilters';
import SearchParamsHandler from '@/components/productos/SearchParamsHandler';
import CatalogoCard from '@/components/catalogo/CatalogoCard';
import CatalogoListCard from '@/components/catalogo/CatalogoListCard';
import { useCatalogo } from '@/hooks/useCatalogo';
import { useCart } from '@/contexts/CarContext';
import { useCartDrawer } from '@/contexts/CartDrawerContext';
import { useStockAlertGlobal } from '@/contexts/StockAlertContext';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/products';
import { scrollToTop } from '@/lib/scroll';

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
    stock?: number;
    stockMinimo?: number;
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
  const { showError } = useStockAlertGlobal();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [page, setPage] = useState(1);

  // Función para actualizar URL con filtros
  const updateURL = useCallback((newFilters: FilterState, newPage: number) => {
    const params = new URLSearchParams();
    
    // Agregar filtros a la URL
    if (newFilters.search.trim()) params.set('search', newFilters.search);
    if (newFilters.category) params.set('categoria', newFilters.category);
    if (newFilters.priceMin) params.set('precio_min', newFilters.priceMin);
    if (newFilters.priceMax) params.set('precio_max', newFilters.priceMax);
    if (newFilters.destacado) params.set('destacado', 'true');
    if (newFilters.disponible) params.set('disponible', 'true');
    if (newFilters.sortBy !== 'default') params.set('orden', newFilters.sortBy);
    if (newFilters.sortOrder !== 'asc') params.set('direccion', newFilters.sortOrder);
    if (newPage > 1) params.set('pagina', newPage.toString());
    
    // Actualizar URL sin recargar la página
    const newURL = params.toString() ? `?${params.toString()}` : '/productos';
    router.replace(newURL, { scroll: false });
  }, [router]);

  // Función para manejar cambios en los parámetros de URL
  const handleParamsChange = useCallback((newFilters: Partial<FilterState>, newPage?: number) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
    
    if (newPage !== undefined) {
      setPage(newPage);
    }
  }, []);

  // Función para manejar cambios en filtros
  const handleFilterChange = useCallback((key: keyof FilterState, value: string | boolean) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setPage(1); // Reset página al cambiar filtros
    updateURL(newFilters, 1);
  }, [filters, updateURL]);

  // Función para limpiar filtros
  const handleClearFilters = useCallback(() => {
    setFilters(initialFilters);
    setPage(1);
    router.replace('/productos', { scroll: false });
  }, [router]);

  // Función para cambiar página
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    updateURL(filters, newPage);
    scrollToTop();
  }, [filters, updateURL]);

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
        stock: product.stock, // ✅ Incluir información de stock
        stockMinimo: product.stockMinimo, // ✅ Incluir stock mínimo
      };

      const result = await addToCart(cartProduct);
      
      if (result.success) {
        openDrawer();
      } else {
        showError(
          'Error al agregar al carrito',
          result.error || 'No se pudo agregar el producto al carrito. Por favor, intenta nuevamente.'
        );
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      showError(
        'Error al agregar al carrito',
        'Error inesperado al agregar el producto al carrito.'
      );
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
        <ProductosPageHeader />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {' '}
          <ProductosSearchBar
            filters={filters}
            viewMode={viewMode}
            showFilters={showFilters}
            activeFiltersCount={activeFiltersCount}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            onViewModeChange={setViewMode}
            onToggleFilters={() => setShowFilters(!showFilters)}
          />
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {showFilters && (
              <div
                className={`
                lg:block
                ${showFilters ? 'block' : 'hidden'}
              `}
              >
                <ProductosFilters
                  filters={filters}
                  categorias={categorias}
                  activeFiltersCount={activeFiltersCount}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              {loading && (
                <div className="text-center py-16 sm:py-20">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#CC9F53] mx-auto mb-4"></div>
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
                <>
                  {' '}
                  <div
                    className={`${
                      viewMode === 'grid'
                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-6'
                        : 'flex flex-col gap-4'
                    }`}
                  >
                    {productosFiltrados.length === 0 && (
                      <div className="col-span-full text-center text-gray-500 py-12 sm:py-16">
                        <p className="text-sm sm:text-base">
                          No hay productos.
                        </p>
                      </div>
                    )}{' '}
                    {productosPagina.map((producto) =>
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
                    )}
                  </div>
                  {/* Paginación tipo "3 OF 10" */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-10">
                      <div className="flex items-center bg-white/95 border border-[#e7d7b6] rounded-full shadow px-4 py-1 gap-2 min-w-[150px]">
                        <button
                          className="w-8 h-8 flex items-center justify-center rounded-full border-none text-[#CC9F53] hover:bg-[#FFF9EC] transition disabled:opacity-40 disabled:cursor-not-allowed text-xl"
                          onClick={() => handlePageChange(Math.max(1, page - 1))}
                          disabled={page === 1}
                          aria-label="Página anterior"
                        >
                          <span
                            className="inline-block align-middle"
                            style={{ color: '#CC9F53' }}
                          >
                            &#60;
                          </span>
                        </button>
                        <span
                          className="font-poppins font-semibold text-base text-[#2d2418] tracking-wide select-none"
                          style={{
                            minWidth: 70,
                            textAlign: 'center',
                            letterSpacing: '0.08em',
                          }}
                        >
                          {page}{' '}
                          <span className="text-[#CC9F53] font-semibold uppercase tracking-widest">
                            DE
                          </span>{' '}
                          {totalPages}
                        </span>
                        <button
                          className="w-8 h-8 flex items-center justify-center rounded-full border-none text-[#CC9F53] hover:bg-[#FFF9EC] transition disabled:opacity-40 disabled:cursor-not-allowed text-xl"
                          onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                          disabled={page === totalPages}
                          aria-label="Página siguiente"
                        >
                          <span
                            className="inline-block align-middle"
                            style={{ color: '#CC9F53' }}
                          >
                            &#62;
                          </span>
                        </button>
                      </div>
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
