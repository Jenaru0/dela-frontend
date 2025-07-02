import React from 'react';
import { AlertTriangle, Package, X } from 'lucide-react';
import { Button } from './Button';

interface StockAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'warning' | 'error';
  productName: string;
  availableStock: number;
  requestedQuantity?: number;
  message?: string;
}

export const StockAlertModal: React.FC<StockAlertModalProps> = ({
  isOpen,
  onClose,
  type,
  productName,
  availableStock,
  requestedQuantity,
  message,
}) => {
  // Cerrar modal con Escape
  React.useEffect(() => {
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

  // Prevenir scroll del body
  React.useEffect(() => {
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

  const isWarning = type === 'warning';
  const isError = type === 'error';

  // Configuración visual según el tipo
  const config = {
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      buttonColor: 'bg-amber-500 hover:bg-amber-600',
      title: 'Stock Limitado',
    },
    error: {
      icon: Package,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      buttonColor: 'bg-red-500 hover:bg-red-600',
      title: 'Producto Agotado',
    },
  };

  const currentConfig = config[type];
  const IconComponent = currentConfig.icon;

  // Mensaje por defecto si no se proporciona uno personalizado
  const defaultMessage = isWarning
    ? `Solo quedan ${availableStock} unidades disponibles de ${productName}. ${
        requestedQuantity ? `No puedes agregar ${requestedQuantity} unidades.` : ''
      }`
    : `Lo sentimos, ${productName} está agotado en este momento.`;

  const displayMessage = message || defaultMessage;

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
          ${currentConfig.borderColor} border-2
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="stock-alert-title"
      >
        {/* Header con ícono y título */}
        <div className={`${currentConfig.bgColor} p-6 rounded-t-2xl border-b ${currentConfig.borderColor}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full bg-white`}>
                <IconComponent className={`w-6 h-6 ${currentConfig.iconColor}`} />
              </div>
              <h2 
                id="stock-alert-title" 
                className="text-xl font-semibold text-gray-800"
              >
                {currentConfig.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-white/50"
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

          {/* Información adicional de stock */}
          {availableStock > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Stock disponible:
                </span>
                <span className={`text-sm font-bold ${
                  availableStock <= 5 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {availableStock} unidades
                </span>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex space-x-3">
            <Button
              onClick={onClose}
              className={`flex-1 text-white font-medium py-3 px-4 rounded-lg transition-colors ${currentConfig.buttonColor}`}
            >
              {isWarning ? 'Entendido' : 'Buscar otros productos'}
            </Button>
            
            {isWarning && (
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 py-3 px-4 rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Ajustar cantidad
              </Button>
            )}
          </div>
        </div>

        {/* Footer con sugerencia si es necesario */}
        {isError && (
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

// Hook personalizado para usar el modal de stock más fácilmente
export const useStockAlert = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [alertData, setAlertData] = React.useState<Omit<StockAlertModalProps, 'isOpen' | 'onClose'> | null>(null);

  const showStockAlert = (data: Omit<StockAlertModalProps, 'isOpen' | 'onClose'>) => {
    setAlertData(data);
    setIsOpen(true);
  };

  const closeAlert = () => {
    setIsOpen(false);
    setAlertData(null);
  };

  const StockAlertComponent = alertData ? (
    <StockAlertModal
      {...alertData}
      isOpen={isOpen}
      onClose={closeAlert}
    />
  ) : null;

  return {
    showStockAlert,
    closeAlert,
    StockAlertComponent,
    isOpen,
  };
};
