'use client';

import { useEffect } from 'react';

interface ScrollToTopWrapperProps {
  children: React.ReactNode;
}

/**
 * Componente wrapper que aplica scroll hacia arriba al cargar cualquier página
 * Se usa en el layout principal para afectar toda la aplicación
 */
export default function ScrollToTopWrapper({ children }: ScrollToTopWrapperProps) {
  // Aplicar scroll hacia arriba cuando se monta el componente (recarga de página)
  useEffect(() => {
    // Hacer scroll hacia arriba suavemente al cargar la página
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, []);
  
  return <>{children}</>;
}
