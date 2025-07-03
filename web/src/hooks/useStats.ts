'use client';

import { useState, useEffect } from 'react';
import { estadisticasService } from '@/services/estadisticas.service';

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

        const estadisticas = await estadisticasService.obtener();

        setStats({
          totalProductos: estadisticas.totalProductos,
          totalCategorias: estadisticas.totalCategorias,
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
