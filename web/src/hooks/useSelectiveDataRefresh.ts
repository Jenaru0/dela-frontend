import { useCallback, useRef } from 'react';

interface DataLoaderConfig<T> {
  loader: () => Promise<T>;
  shouldReload?: (newData: unknown, oldData: T) => boolean;
  throttleMs?: number;
}

/**
 * Hook para manejo selectivo de recarga de datos
 * Permite decidir qué datos recargar basado en cambios específicos
 */
export const useSelectiveDataRefresh = () => {
  const lastLoadTimesRef = useRef<Map<string, number>>(new Map());
  const lastDataRef = useRef<Map<string, unknown>>(new Map());

  const loadData = useCallback(async <T>(
    key: string,
    config: DataLoaderConfig<T>,
    triggerData?: unknown
  ): Promise<T | null> => {
    const now = Date.now();
    const lastLoadTime = lastLoadTimesRef.current.get(key) || 0;
    const throttleMs = config.throttleMs || 5000;

    // Throttling por tiempo
    if (now - lastLoadTime < throttleMs) {
      return (lastDataRef.current.get(key) as T) || null;
    }

    // Verificar si realmente necesita recargar
    if (config.shouldReload && triggerData) {
      const lastData = lastDataRef.current.get(key) as T;
      if (lastData && !config.shouldReload(triggerData, lastData)) {
        return lastData;
      }
    }

    try {
      const newData = await config.loader();
      lastLoadTimesRef.current.set(key, now);
      lastDataRef.current.set(key, newData);
      return newData;
    } catch (error) {
      console.error(`Error loading data for key ${key}:`, error);
      return (lastDataRef.current.get(key) as T) || null;
    }
  }, []);

  const clearCache = useCallback((key?: string) => {
    if (key) {
      lastLoadTimesRef.current.delete(key);
      lastDataRef.current.delete(key);
    } else {
      lastLoadTimesRef.current.clear();
      lastDataRef.current.clear();
    }
  }, []);

  const getCachedData = useCallback(<T>(key: string): T | null => {
    return (lastDataRef.current.get(key) as T) || null;
  }, []);

  return {
    loadData,
    clearCache,
    getCachedData
  };
};

// Configuraciones predefinidas para datos comunes
export const dataRefreshConfigs = {
  // Las direcciones solo se recargan si cambió el ID del usuario
  direcciones: {
    shouldReload: () => {
      // Solo recargar direcciones si es un usuario completamente diferente
      // No recargar por cambios en nombre, teléfono, etc.
      return false; // Las direcciones se manejan independientemente
    },
    throttleMs: 10000 // 10 segundos de throttle
  },

  // Los pedidos se recargan solo si es necesario
  pedidos: {
    shouldReload: () => {
      return false; // Los pedidos se manejan independientemente
    },
    throttleMs: 15000 // 15 segundos de throttle
  },

  // Los favoritos solo si cambió el usuario
  favoritos: {
    shouldReload: (newUserData: unknown, oldUserData: unknown) => {
      const newUser = newUserData as { id?: number };
      const oldUser = oldUserData as { id?: number };
      return newUser?.id !== oldUser?.id;
    },
    throttleMs: 8000 // 8 segundos de throttle
  }
};
