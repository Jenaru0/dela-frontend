'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { scrollToTopInstant } from '@/lib/scroll';

/**
 * Componente que maneja el scroll al top automáticamente en navegación
 * Debe ser usado en el layout principal
 */
export const ScrollToTopOnRouteChange = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Rutas específicas que deben hacer scroll al top
    const routesThatNeedScroll = ['/carrito', '/checkout', '/productos', '/categorias'];
    
    if (routesThatNeedScroll.some(route => pathname.includes(route))) {
      // Scroll inmediato
      scrollToTopInstant();
      
      // Scroll adicional después de que el componente se haya renderizado
      const timeoutId = setTimeout(() => {
        scrollToTopInstant();
      }, 150);
      
      return () => clearTimeout(timeoutId);
    }
  }, [pathname]);

  return null; // Este componente no renderiza nada
};
