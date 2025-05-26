'use client';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import ProductosPageHeader from '@/components/productos/ProductosPageHeader';
import ProductosSearchBar from '@/components/productos/ProductosSearchBar';
import ProductosFilters from '@/components/productos/ProductosFilters';
import ProductosGrid from '@/components/productos/ProductosGrid';
import { useProductos } from '@/hooks/useProductos';
import { ViewMode } from '@/types/productos';

export default function ProductosPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const {
    productos,
    categorias,
    loading,
    currentPage,
    totalPages,
    filters,
    activeFiltersCount,
    setCurrentPage,
    handleFilterChange,
    handleSortChange,
    clearFilters,
  } = useProductos();

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-[#F5EFD7]/20 to-white">
        <ProductosPageHeader />

        <div className="container mx-auto px-4 md:px-6 py-8">
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

          <div className="flex flex-col lg:flex-row gap-8">
            {showFilters && (
              <ProductosFilters
                filters={filters}
                categorias={categorias}
                activeFiltersCount={activeFiltersCount}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
              />
            )}

            <div className="flex-1">
              <ProductosGrid
                productos={productos}
                loading={loading}
                viewMode={viewMode}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                onClearFilters={clearFilters}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
