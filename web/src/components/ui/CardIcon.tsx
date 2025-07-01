import { CreditCard } from 'lucide-react';
import { MetodoPago } from '@/types/enums';

interface CardIconProps {
  type: MetodoPago | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CardIcon({ type, size = 'md', className = '' }: CardIconProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const baseClasses = `${sizeClasses[size]} ${className}`;

  switch (type) {
    case MetodoPago.visa:
      return (
        <div className={`${baseClasses} bg-blue-600 text-white rounded-md flex items-center justify-center font-bold`}>
          <span className="font-sans tracking-wide text-sm font-bold">VISA</span>
        </div>
      );
    
    case MetodoPago.master:
      return (
        <div className={`${baseClasses} bg-white border border-gray-200 rounded-md flex items-center justify-center relative overflow-hidden`}>
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <div className="w-4 h-4 bg-yellow-500 rounded-full -ml-2 opacity-90"></div>
          </div>
        </div>
      );
    
    case MetodoPago.amex:
      return (
        <div className={`${baseClasses} bg-blue-500 text-white rounded-md flex items-center justify-center font-bold`}>
          <span className="font-sans text-sm font-bold">AMEX</span>
        </div>
      );
    
    default:
      return (
        <div className={`${baseClasses} bg-gray-100 border border-gray-200 rounded-md flex items-center justify-center`}>
          <CreditCard className="w-5 h-5 text-gray-400" />
        </div>
      );
  }
}

export function CardTypeIndicator({ detectedType, className = '' }: { detectedType: MetodoPago | null; className?: string }) {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <CardIcon type={detectedType} size="md" />
      <span className="text-sm font-medium text-gray-800">
        {detectedType ? getCardTypeName(detectedType) : 'Número de tarjeta'}
      </span>
    </div>
  );
}

function getCardTypeName(type: MetodoPago): string {
  switch (type) {
    case MetodoPago.visa:
      return 'Visa';
    case MetodoPago.master:
      return 'Mastercard';
    case MetodoPago.amex:
      return 'American Express';
    default:
      return 'Tarjeta';
  }
}
