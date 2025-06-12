'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Hook que hace scroll hacia arriba cuando cambia la ruta
 * Útil para aplicar en componentes específicos o páginas individuales
 */
export const useScrollOnRouteChange = () => {
  const pathname = usePathname();
  
  useEffect(() => {
    // Hacer scroll hacia arriba cuando cambia la ruta
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname]);
};

export default useScrollOnRouteChange;
