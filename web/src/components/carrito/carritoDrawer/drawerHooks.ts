import { useEffect } from "react";

// Hook para manejar el bloqueo de scroll del body
export const useBodyScrollLock = (isOpen: boolean) => {
  useEffect(() => {
    if (isOpen) {
      // Guardar el scroll actual
      const scrollPosition = window.pageYOffset;
      
      // Bloquear scroll del body
      document.body.style.cssText = `
        position: fixed;
        top: -${scrollPosition}px;
        left: 0;
        right: 0;
        overflow: hidden;
        width: 100%;
        height: 100vh;
      `;
      
      return () => {
        // Restaurar scroll
        document.body.style.cssText = '';
        window.scrollTo(0, scrollPosition);
      };
    }
  }, [isOpen]);
};

// Hook para agregar estilos de animación
export const useDrawerAnimations = (isOpen: boolean) => {
  useEffect(() => {
    if (isOpen) {
      const style = document.createElement('style');
      style.textContent = `
        @keyframes slide-in {
          from { 
            transform: translateX(100%); 
            opacity: 0;
          }
          to { 
            transform: translateX(0); 
            opacity: 1;
          }
        }
        @keyframes slide-out {
          from { 
            transform: translateX(0); 
            opacity: 1;
          }
          to { 
            transform: translateX(100%); 
            opacity: 0;
          }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-out {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        .animate-slide-in {
          animation: slide-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .animate-slide-out {
          animation: slide-out 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-fade-out {
          animation: fade-out 0.2s ease-in;
        }
      `;
      document.head.appendChild(style);
      return () => {
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      };
    }
  }, [isOpen]);
};
