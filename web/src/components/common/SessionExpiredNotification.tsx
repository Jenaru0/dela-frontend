'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function SessionExpiredNotification() {
  const [showNotification, setShowNotification] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleSessionExpired = () => {
      setShowNotification(true);
      // Auto-ocultar después de 5 segundos
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    };

    window.addEventListener('auth:session-expired', handleSessionExpired);
    
    return () => {
      window.removeEventListener('auth:session-expired', handleSessionExpired);
    };
  }, []);

  // Si el usuario está autenticado, no mostrar notificación
  useEffect(() => {
    if (isAuthenticated) {
      setShowNotification(false);
    }
  }, [isAuthenticated]);

  if (!showNotification) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <p className="font-medium">Sesión expirada</p>
          <p className="text-sm opacity-90">Por favor, inicia sesión nuevamente</p>
        </div>
        <button
          onClick={() => setShowNotification(false)}
          className="flex-shrink-0 ml-2 text-white hover:text-red-200"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}
