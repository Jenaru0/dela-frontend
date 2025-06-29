'use client';

import { useState, useEffect } from 'react';
import { categoriasService } from '@/services/categorias.service';
import { productosService } from '@/services/productos.service';

interface Stats {
  totalProductos: number;
  totalCategorias: number;
  loading: boolean;
  error: string | null;
}

export const useStats = () => {
  const [stats, setStats] = useState<Stats>({
    totalProductos: 0,
    totalCategorias: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats(prev => ({ ...prev, loading: true, error: null }));

        // Obtener categorías activas
        const categoriasResponse = await categoriasService.obtenerActivas();
        const categorias = categoriasResponse.data;        // Obtener productos públicos para conocer el total
        const productosResponse = await productosService.obtenerPublicos(
          undefined, // filters
          1, // page
          1  // limit - Solo necesitamos el total, no los productos
        );

        setStats({
          totalProductos: productosResponse.meta.total,
          totalCategorias: categorias.length,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        setStats(prev => ({
          ...prev,
          loading: false,
          error: 'Error al cargar estadísticas',
        }));
      }
    };

    fetchStats();
  }, []);

  return stats;
};
