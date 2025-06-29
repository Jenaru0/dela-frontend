'use client';

import { useEffect } from 'react';

/**
 * Hook personalizado que hace scroll hacia arriba cuando se monta el componente
 * Útil para cuando se recarga la página (F5) o se navega entre páginas
 */
export const useScrollToTop = () => {
  useEffect(() => {
    // Hacer scroll hacia arriba suavemente al cargar la página
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, []);
};

/**
 * Hook que hace scroll hacia arriba al cambiar de ruta
 * Para usar en navegación entre páginas
 */
export const useScrollToTopOnRouteChange = () => {
  useEffect(() => {
    // Hacer scroll hacia arriba inmediatamente al cambiar de ruta
    window.scrollTo(0, 0);
  }, []);
};
