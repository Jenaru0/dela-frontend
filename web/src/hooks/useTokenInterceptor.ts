'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/auth.service';

export function useTokenInterceptor() {
  const { renovarToken, cerrarSesion } = useAuth();

  useEffect(() => {
    // Interceptar peticiones fetch para manejar tokens expirados
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      try {
        let response = await originalFetch(...args);

        // Si obtenemos un 401 en una petición autenticada
        if (response.status === 401) {
          const [url, options] = args;
          
          // Verificar si la petición tenía un token de autorización
          const hasAuthHeader = options?.headers && 
            (typeof options.headers === 'object' && 'Authorization' in options.headers);

          if (hasAuthHeader) {
            try {
              // Intentar renovar el token
              await renovarToken();
              
              // Reintentar la petición original con el nuevo token
              const newOptions = {
                ...options,
                headers: {
                  ...options.headers,
                  Authorization: `Bearer ${authService.getToken()}`,
                },
              };
              
              response = await originalFetch(url, newOptions);
            } catch {
              // Si la renovación falla, cerrar sesión
              await cerrarSesion();
            }
          }
        }

        return response;
      } catch (error) {
        throw error;
      }
    };

    // Limpiar al desmontar
    return () => {
      window.fetch = originalFetch;
    };
  }, [renovarToken, cerrarSesion]);
}
