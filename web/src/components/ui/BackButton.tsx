'use client';

import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  return (
    <Button
      onClick={() => window.history.back()}
      variant="outline"
      className="flex items-center gap-2"
    >
      <ArrowLeft className="w-4 h-4" />
      Volver atrás
    </Button>
  );
}
