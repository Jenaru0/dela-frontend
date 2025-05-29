'use client';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useProductos } from '@/hooks/useProductos';
import { ViewMode } from '@/types/productos';

export default function CarritoPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const {
  } = useProductos();

  return (
    <Layout>
        <div>Categorias</div>
    </Layout>
  );
}
