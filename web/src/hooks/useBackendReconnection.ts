'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/auth.service';

export function useBackendReconnection() {
  const { isAuthenticated, renovarToken } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const backendWasDownRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Verificar conectividad cada 10 segundos cuando hay sesión activa
    intervalRef.current = setInterval(async () => {
      try {
        const isBackendUp = await authService.checkBackendConnectivity();
        
        if (!isBackendUp) {
          // Backend está caído
          if (!backendWasDownRef.current) {
            console.log('🔴 Backend desconectado detectado');
            backendWasDownRef.current = true;
          }
        } else {
          // Backend está funcionando
          if (backendWasDownRef.current) {
            console.log('🟢 Backend reconectado! Intentando renovar tokens...');
            backendWasDownRef.current = false;
            
            // Intentar renovar tokens cuando el backend se reconecte
            try {
              await renovarToken();
              console.log('✅ Tokens renovados exitosamente después de reconexión');
            } catch (error) {
              console.log('⚠️ No se pudieron renovar tokens después de reconexión:', error);
              // El manejo de error se hará automáticamente por el contexto de auth
            }
          }
        }
      } catch (error) {
        console.log('Error verificando conectividad del backend:', error);
      }
    }, 10000); // Verificar cada 10 segundos

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAuthenticated, renovarToken]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
}
