import React, { useEffect } from 'react';
import { AlertTriangle, Package, X, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ProductStockInfo {
  name: string;
  availableStock?: number;
  requestedQuantity?: number;
  message?: string;
}

interface StockAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'warning' | 'error' | 'info';
  productName?: string; // Para compatibilidad con un solo producto
  products?: ProductStockInfo[]; // Para múltiples productos
  availableStock?: number;
  requestedQuantity?: number;
  message?: string;
}

export const StockAlertModal: React.FC<StockAlertModalProps> = ({
  isOpen,
  onClose,
  type,
  productName,
  products,
  availableStock = 0,
  requestedQuantity,
  message,
}) => {
  // Determinar si tenemos múltiples productos
  const hasMultipleProducts = products && products.length > 0;
  const isMultipleProducts = hasMultipleProducts && products!.length > 1;
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
          iconColor: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          buttonColor: 'bg-amber-500 hover:bg-amber-600',
          title: 'Stock Completo en Carrito',
          iconBg: 'bg-orange-100',
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

    // Si tenemos múltiples productos
    if (hasMultipleProducts) {
      const productCount = products!.length;
      switch (type) {
        case 'warning':
          return `${productCount} ${productCount === 1 ? 'producto tiene' : 'productos tienen'} stock limitado. Revisa las cantidades disponibles.`;
        case 'error':
          return `${productCount} ${productCount === 1 ? 'producto ya está' : 'productos ya están'} completamente agregados a tu carrito. No es posible añadir más unidades.`;
        case 'info':
        default:
          return `Información sobre ${productCount} productos.`;
      }
    }

    // Si tenemos un solo producto (comportamiento original)
    const currentProductName = productName || (hasMultipleProducts ? products![0].name : 'este producto');
    
    switch (type) {
      case 'warning':
        return `Solo quedan ${availableStock} unidades disponibles de ${currentProductName}. ${
          requestedQuantity ? `No puedes agregar ${requestedQuantity} unidades.` : ''
        }`;
      case 'error':
        return `No es posible agregar más unidades de este producto. Usted ya cuenta con todo el inventario disponible en su carrito de compras.`;
      case 'info':
      default:
        return `Información sobre ${currentProductName}.`;
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

          {/* Lista de múltiples productos */}
          {hasMultipleProducts && (
            <div className="mb-4 space-y-3 max-h-64 overflow-y-auto">
              {products!.map((product, index) => (
                <div key={index} className={`
                  ${type === 'warning' ? 'bg-gradient-to-r from-[#FAF3E7] to-[#F5E6C6] border-[#ECD8AB]' : ''}
                  ${type === 'error' ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200' : ''}
                  ${type === 'info' ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200' : ''}
                  rounded-lg p-4 border
                `}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className={`font-semibold text-sm ${
                        type === 'warning' ? 'text-[#9A8C61]' : 
                        type === 'error' ? 'text-orange-800' : 'text-blue-800'
                      }`}>
                        {product.name}
                      </h4>
                      {product.message && (
                        <p className={`text-xs mt-1 ${
                          type === 'warning' ? 'text-[#9A8C61]' : 
                          type === 'error' ? 'text-orange-700' : 'text-blue-700'
                        }`}>
                          {product.message}
                        </p>
                      )}
                    </div>
                    
                    {/* Información de stock para múltiples productos */}
                    {type === 'warning' && product.availableStock !== undefined && (
                      <div className="ml-3 text-right">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          product.availableStock <= 5 ? 'bg-orange-100 text-orange-800' : 'bg-[#F5E6C6] text-[#9A8C61]'
                        }`}>
                          {product.availableStock} disponibles
                        </span>
                      </div>
                    )}
                    
                    {type === 'error' && (
                      <div className="ml-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          🛒 Stock completo
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Información adicional de stock para advertencias (producto único) */}
          {!hasMultipleProducts && type === 'warning' && availableStock > 0 && (
            <div className="rounded-lg p-4 mb-4 ">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#9A8C61]">
                  Stock disponible:
                </span>
                <span className={`text-sm font-bold ${
                  availableStock <= 5 ? 'text-orange-600' : 'text-[#219436]'
                }`}>
                  {availableStock} unidades
                </span>
              </div>
            </div>
          )}

          {/* Información especial para productos agotados (producto único) */}
          {!hasMultipleProducts && type === 'error' && (
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 mb-4 border border-orange-200">
              <div className="text-center mb-3">
                <h3 className="text-lg font-semibold text-orange-800 mb-1">
                  {productName || (hasMultipleProducts ? products![0].name : 'Producto')}
                </h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                  🛒 Stock completo en carrito
                </span>
              </div>
              <div className="bg-white rounded-lg p-3 border border-orange-200">
                <div className="flex items-center justify-center text-sm text-orange-700">
                  <span className="mr-2">📦</span>
                  Ya posee toda la disponibilidad de este producto
                </div>
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
                {isMultipleProducts ? 'Ajustar cantidades' : 'Ajustar cantidad'}
              </Button>
            )}
            
            {type === 'error' && (
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 py-3 px-4 rounded-lg border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                Revisar carrito
              </Button>
            )}
            
            <Button
              onClick={onClose}
              className={`flex-1 text-white font-medium py-3 px-4 rounded-lg transition-colors ${config.buttonColor}`}
            >
              {type === 'warning' ? 'Entendido' : type === 'error' ? 'Entendido' : 'Cerrar'}
            </Button>
          </div>
        </div>

        {/* Footer con mensaje motivacional para productos agotados */}
        {type === 'error' && (
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 rounded-b-2xl border-t border-orange-200">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-xl">🎉</span>
              <p className="text-sm font-medium text-orange-800 text-center">
                {isMultipleProducts 
                  ? `¡Excelente selección! Ha reservado todo el inventario disponible de ${products!.length} productos`
                  : '¡Excelente elección! Ha reservado todo el inventario disponible'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
