import React, { useEffect } from 'react';
import { AlertTriangle, Package, X, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface StockAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'warning' | 'error' | 'info';
  productName: string;
  availableStock?: number;
  requestedQuantity?: number;
  message?: string;
}

export const StockAlertModal: React.FC<StockAlertModalProps> = ({
  isOpen,
  onClose,
  type,
  productName,
  availableStock = 0,
  requestedQuantity,
  message,
}) => {
  // Cerrar modal con Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Configuración visual según el tipo
  const getModalConfig = () => {
    switch (type) {
      case 'warning':
        return {
          icon: AlertTriangle,
          iconColor: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          buttonColor: 'bg-amber-500 hover:bg-amber-600',
          title: 'Stock Limitado',
          iconBg: 'bg-amber-100',
        };
      case 'error':
        return {
          icon: Package,
          iconColor: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          buttonColor: 'bg-red-500 hover:bg-red-600',
          title: 'Producto Agotado',
          iconBg: 'bg-red-100',
        };
      case 'info':
      default:
        return {
          icon: ShoppingCart,
          iconColor: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          buttonColor: 'bg-blue-500 hover:bg-blue-600',
          title: 'Información de Stock',
          iconBg: 'bg-blue-100',
        };
    }
  };

  const config = getModalConfig();
  const IconComponent = config.icon;

  // Mensaje por defecto si no se proporciona uno personalizado
  const getDefaultMessage = () => {
    if (message) return message;

    switch (type) {
      case 'warning':
        return `Solo quedan ${availableStock} unidades disponibles de ${productName}. ${
          requestedQuantity ? `No puedes agregar ${requestedQuantity} unidades.` : ''
        }`;
      case 'error':
        return `Lo sentimos, ${productName} está agotado en este momento.`;
      case 'info':
      default:
        return `Información sobre ${productName}.`;
    }
  };

  const displayMessage = getDefaultMessage();

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleBackdropClick}
    >
      <div
        className={`
          bg-white rounded-2xl shadow-2xl w-full max-w-md 
          transform transition-all duration-300 ease-out
          animate-in fade-in slide-in-from-bottom-4
          ${config.borderColor} border-2
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="stock-alert-title"
      >
        {/* Header con ícono y título */}
        <div className={`${config.bgColor} p-6 rounded-t-2xl border-b ${config.borderColor}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-full ${config.iconBg}`}>
                <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
              </div>
              <h2 
                id="stock-alert-title" 
                className="text-xl font-semibold text-gray-800"
              >
                {config.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-white/70"
              aria-label="Cerrar alerta"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido del mensaje */}
        <div className="p-6">
          <p className="text-gray-700 text-base leading-relaxed mb-4">
            {displayMessage}
          </p>

          {/* Información adicional de stock para advertencias */}
          {type === 'warning' && availableStock > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Stock disponible:
                </span>
                <span className={`text-sm font-bold ${
                  availableStock <= 5 ? 'text-amber-600' : 'text-green-600'
                }`}>
                  {availableStock} unidades
                </span>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex space-x-3">
            {type === 'warning' && (
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 py-3 px-4 rounded-lg border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                Ajustar cantidad
              </Button>
            )}
            
            <Button
              onClick={onClose}
              className={`flex-1 text-white font-medium py-3 px-4 rounded-lg transition-colors ${config.buttonColor}`}
            >
              {type === 'warning' ? 'Entendido' : type === 'error' ? 'Buscar otros productos' : 'Cerrar'}
            </Button>
          </div>
        </div>

        {/* Footer con sugerencia para productos agotados */}
        {type === 'error' && (
          <div className="bg-gray-50 px-6 py-4 rounded-b-2xl border-t">
            <p className="text-sm text-gray-600 text-center">
              💡 Te notificaremos cuando este producto esté disponible nuevamente
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
