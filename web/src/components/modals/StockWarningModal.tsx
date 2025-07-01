'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, Package, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface StockWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'warning' | 'error' | 'outOfStock';
  productName: string;
  availableStock?: number;
  requestedQuantity?: number;
  customMessage?: string;
}

export const StockWarningModal: React.FC<StockWarningModalProps> = ({
  isOpen,
  onClose,
  type,
  productName,
  availableStock = 0,
  requestedQuantity,
  customMessage
}) => {
  // Cerrar con tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevenir scroll del body
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Configuración según el tipo de alerta
  const getModalConfig = () => {
    switch (type) {
      case 'warning':
        return {
          icon: AlertTriangle,
          iconBg: 'bg-amber-100',
          iconColor: 'text-amber-600',
          headerBg: 'bg-amber-50',
          borderColor: 'border-amber-200',
          title: 'Stock Limitado',
          buttonPrimary: 'bg-amber-500 hover:bg-amber-600',
          message: customMessage || `Solo quedan ${availableStock} unidades disponibles de ${productName}.${requestedQuantity ? ` No puedes agregar ${requestedQuantity} unidades.` : ''}`
        };
      case 'error':
        return {
          icon: AlertTriangle,
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          headerBg: 'bg-red-50',
          borderColor: 'border-red-200',
          title: 'Error de Stock',
          buttonPrimary: 'bg-red-500 hover:bg-red-600',
          message: customMessage || `Error al procesar ${productName}. Por favor intenta nuevamente.`
        };
      case 'outOfStock':
        return {
          icon: Package,
          iconBg: 'bg-gray-100',
          iconColor: 'text-gray-600',
          headerBg: 'bg-gray-50',
          borderColor: 'border-gray-200',
          title: 'Producto Agotado',
          buttonPrimary: 'bg-gray-500 hover:bg-gray-600',
          message: customMessage || `${productName} está temporalmente agotado. Te notificaremos cuando esté disponible.`
        };
      default:
        return getModalConfig(); // Fallback a warning
    }
  };

  const config = getModalConfig();
  const IconComponent = config.icon;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="stock-modal-title"
    >
      <div
        className={`
          bg-white rounded-2xl shadow-2xl w-full max-w-md
          transform transition-all duration-300 ease-out
          animate-in fade-in slide-in-from-bottom-4
          border-2 ${config.borderColor}
        `}
      >
        {/* Header */}
        <div className={`${config.headerBg} p-6 rounded-t-2xl border-b ${config.borderColor}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-full ${config.iconBg}`}>
                <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
              </div>
              <h2 
                id="stock-modal-title"
                className="text-xl font-semibold text-gray-800"
              >
                {config.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-white/70"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <p className="text-gray-700 text-base leading-relaxed mb-4">
            {config.message}
          </p>

          {/* Información de stock si está disponible */}
          {type !== 'error' && availableStock >= 0 && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Stock disponible:
                </span>
                <span className={`text-sm font-bold ${
                  availableStock === 0 
                    ? 'text-red-600' 
                    : availableStock <= 5 
                      ? 'text-amber-600' 
                      : 'text-green-600'
                }`}>
                  {availableStock} unidades
                </span>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex space-x-3">
            {type === 'warning' && (
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Ajustar cantidad
              </Button>
            )}
            <Button
              onClick={onClose}
              className={`flex-1 text-white font-medium transition-colors ${config.buttonPrimary}`}
            >
              {type === 'outOfStock' ? 'Entendido' : type === 'error' ? 'Cerrar' : 'De acuerdo'}
            </Button>
          </div>
        </div>

        {/* Footer opcional */}
        {type === 'outOfStock' && (
          <div className="bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              💡 Te notificaremos cuando este producto esté disponible nuevamente
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
