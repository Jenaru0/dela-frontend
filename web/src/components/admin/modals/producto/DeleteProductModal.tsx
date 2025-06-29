import React, { useEffect } from 'react';
import { X, AlertTriangle, Package, EyeOff, Star, ShoppingBag } from 'lucide-react';
import { ProductoAdmin } from '@/services/productos-admin.service';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  producto: ProductoAdmin;
  isDeleting?: boolean;
}

const DeleteProductModal: React.FC<DeleteProductModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  producto,
  isDeleting = false
}) => {  // Función para obtener imagen principal
  const getImagenPrincipal = (imagenes: ProductoAdmin['imagenes']) => {
    const imagenPrincipal = imagenes?.find(img => img.principal);
    return imagenPrincipal?.url || imagenes?.[0]?.url || null;
  };

  // Bloqueo de scroll del body cuando el modal está abierto
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

  // Cerrar modal al presionar Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isDeleting) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, isDeleting]);

  // Cerrar modal al hacer click fuera (en el overlay)
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isDeleting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const imagenPrincipal = getImagenPrincipal(producto.imagenes);  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-auto border border-gray-200">
        {/* Header profesional */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <EyeOff className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Desactivar Producto</h2>
                <p className="text-sm text-gray-500">Esta acción es reversible</p>
              </div>
            </div>
            {!isDeleting && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Contenido compacto */}
        <div className="p-6">
          {/* Información del producto */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                  {imagenPrincipal ? (
                    <Image
                      src={imagenPrincipal}
                      alt={producto.nombre}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <ShoppingBag className={`w-8 h-8 text-gray-400 fallback-icon ${imagenPrincipal ? 'hidden' : ''}`} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate mb-1">
                  {producto.nombre}
                </h4>                <div className="flex items-center space-x-3 text-sm text-gray-500 mb-2">
                  <span>SKU: {producto.sku}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-emerald-600">
                    {formatPrice(producto.precioUnitario)}
                  </div>
                  {producto.destacado && (
                    <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Destacado
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Advertencia simple */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-900 mb-1">
                  ¿Confirmas la desactivación?
                </h3>
                <p className="text-sm text-amber-800">
                  El producto no será visible para los clientes, pero podrás reactivarlo más tarde.
                </p>
              </div>
            </div>
          </div>

          {/* Información sobre la acción */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h5 className="font-medium text-blue-900 text-sm mb-2 flex items-center">
              <Package className="w-4 h-4 mr-2" />
              Qué sucederá:
            </h5>
            <ul className="space-y-1 text-sm text-blue-800">
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                No aparecerá en la tienda
              </li>
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                Se conservarán todos los datos
              </li>
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></div>
                Podrás reactivarlo cuando quieras
              </li>
            </ul>
          </div>
        </div>

        {/* Botones profesionales */}
        <div className="px-6 pb-6 border-t border-gray-100">
          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Desactivando...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <EyeOff className="w-4 h-4" />
                  <span>Desactivar</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteProductModal;