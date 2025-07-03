import { useEffect, useRef, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface UseUserDataRefreshOptions {
  enabled?: boolean;
  interval?: number; // Intervalo en milisegundos para auto-refresh (0 = solo manual)
  onMount?: boolean; // Si refrescar al montar
  force?: boolean; // Si forzar el refresh ignorando cambios
}

/**
 * Hook que maneja el refresco inteligente de datos del usuario
 * Evita recargas innecesarias comparando datos antes de actualizar
 */
export const useUserDataRefresh = (options: UseUserDataRefreshOptions = {}) => {
  const {
    enabled = true,
    interval = 0, // Por defecto no hay auto-refresh
    onMount = true,
    force = false
  } = options;

  const { refrescarDatosUsuario, isAuthenticated, usuario } = useAuth();
  const lastRefreshRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastUserIdRef = useRef<number | null>(null);

  // Memoizar el ID del usuario para evitar efectos innecesarios
  const usuarioId = useMemo(() => usuario?.id || null, [usuario?.id]);

  // Función para refrescar con throttling
  const refreshWithThrottle = useCallback(async (forceRefresh = false) => {
    if (!enabled || !isAuthenticated || !usuario) return false;

    const now = Date.now();
    const timeSinceLastRefresh = now - lastRefreshRef.current;
    
    // Throttle: no refrescar más de una vez cada 5 segundos (a menos que sea forzado)
    if (!forceRefresh && timeSinceLastRefresh < 5000) {
      return false;
    }

    lastRefreshRef.current = now;
    
    try {
      const wasUpdated = await refrescarDatosUsuario(force || forceRefresh);
      return wasUpdated;
    } catch (error) {
      console.error('Error en refresh de usuario:', error);
      return false;
    }
  }, [enabled, isAuthenticated, usuario, refrescarDatosUsuario, force]);

  // Efecto para refresh al montar o cuando cambia el usuario
  useEffect(() => {
    if (!onMount || !enabled || !isAuthenticated || !usuarioId) return;

    // Solo refrescar si es un usuario diferente o es la primera vez
    const isNewUser = lastUserIdRef.current !== usuarioId;
    lastUserIdRef.current = usuarioId;

    if (isNewUser) {
      const timeout = setTimeout(() => {
        refreshWithThrottle();
      }, 500); // Delay inicial para evitar conflictos

      return () => clearTimeout(timeout);
    }
  }, [onMount, enabled, isAuthenticated, usuarioId, refreshWithThrottle]);

  // Efecto para auto-refresh por intervalo
  useEffect(() => {
    if (!enabled || !isAuthenticated || !usuarioId || interval <= 0) return;

    intervalRef.current = setInterval(() => {
      refreshWithThrottle();
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, isAuthenticated, usuarioId, interval, refreshWithThrottle]);

  // Limpiar interval al desmontar
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Función manual para refrescar
  const manualRefresh = useCallback(async (forceRefresh = false) => {
    return await refreshWithThrottle(forceRefresh);
  }, [refreshWithThrottle]);

  return { 
    refrescarDatosUsuario: manualRefresh,
    ultimoRefresh: lastRefreshRef.current
  };
};
