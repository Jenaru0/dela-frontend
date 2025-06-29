'use client';

import { useScrollToTop } from '@/hooks/useScrollToTop';

interface ScrollToTopWrapperProps {
  children: React.ReactNode;
}

/**
 * Componente wrapper que aplica scroll hacia arriba al cargar cualquier página
 * Se usa en el layout principal para afectar toda la aplicación
 */
export default function ScrollToTopWrapper({ children }: ScrollToTopWrapperProps) {
  // Aplicar scroll hacia arriba cuando se monta el componente (recarga de página)
  useScrollToTop();
  
  return <>{children}</>;
}
