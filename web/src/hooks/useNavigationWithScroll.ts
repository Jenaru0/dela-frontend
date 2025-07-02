'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { scrollToTopInstant } from '@/lib/scroll';

/**
 * Hook personalizado para navegación con scroll automático al top
 * Útil para mejorar la UX en transiciones entre páginas
 */
export const useNavigationWithScroll = () => {
  const router = useRouter();

  const navigateWithScroll = useCallback((path: string, options?: { replace?: boolean }) => {
    scrollToTopInstant();
    if (options?.replace) {
      router.replace(path);
    } else {
      router.push(path);
    }
  }, [router]);

  const goBackWithScroll = useCallback(() => {
    scrollToTopInstant();
    router.back();
  }, [router]);

  return {
    navigateWithScroll,
    goBackWithScroll,
    router,
  };
};
