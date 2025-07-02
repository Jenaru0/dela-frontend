/**
 * Utilidades para manejo de scroll
 */

/**
 * Hace scroll al top de la página de manera suave
 */
export const scrollToTop = (behavior: ScrollBehavior = 'smooth') => {
  if (typeof window !== 'undefined') {
    // Usar requestAnimationFrame para asegurar que el DOM esté listo
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior,
      });
    });
  }
};

/**
 * Hace scroll al top inmediatamente (útil para navegación)
 * Incluye múltiples métodos para máxima compatibilidad
 */
export const scrollToTopInstant = () => {
  if (typeof window !== 'undefined') {
    // Múltiples intentos para asegurar que funcione
    const scrollToTop = () => {
      // Método 1: window.scrollTo con diferentes parámetros
      window.scrollTo(0, 0);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      
      // Método 2: document.documentElement
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
        document.documentElement.scrollLeft = 0;
      }
      
      // Método 3: document.body (fallback)
      if (document.body) {
        document.body.scrollTop = 0;
        document.body.scrollLeft = 0;
      }
    };

    // Ejecutar inmediatamente
    scrollToTop();
    
    // Ejecutar en el próximo frame
    requestAnimationFrame(() => {
      scrollToTop();
    });
    
    // Ejecutar con delay adicional para asegurar
    setTimeout(() => {
      scrollToTop();
    }, 10);
  }
};


