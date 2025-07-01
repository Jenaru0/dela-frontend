'use client';

import { useState, useCallback } from 'react';
import { reclamosService, CreateReclamoDto, Reclamo } from '@/services/reclamos.service';

interface UseReclamosReturn {
  isLoading: boolean;
  error: string | null;
  crearReclamo: (datos: CreateReclamoDto) => Promise<Reclamo>;
  clearError: () => void;
}

export const useReclamos = (): UseReclamosReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const crearReclamo = useCallback(async (datos: CreateReclamoDto): Promise<Reclamo> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await reclamosService.crear(datos);
      return response.data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : typeof err === 'object' && err !== null && 'response' in err
          ? (err as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message || 
            (err as { message?: string }).message || 
            'Error al crear el reclamo'
          : 'Error al crear el reclamo';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    crearReclamo,
    clearError,
  };
};
