'use client';

import { useTokenInterceptor } from '@/hooks/useTokenInterceptor';

export default function TokenInterceptor() {
  useTokenInterceptor();
  return null;
}
