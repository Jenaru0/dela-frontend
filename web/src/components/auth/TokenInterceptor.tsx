'use client';

import { useTokenInterceptor } from '@/hooks/useTokenInterceptor';
import { useBackendReconnection } from '@/hooks/useBackendReconnection';

export default function TokenInterceptor() {
  useTokenInterceptor();
  useBackendReconnection();
  return null;
}
