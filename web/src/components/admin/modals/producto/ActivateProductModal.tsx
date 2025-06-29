import React from 'react';
import { ProductoAdmin } from '@/services/productos-admin.service';
import { Button } from '@/components/ui/Button';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';

interface ActivateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  producto: ProductoAdmin;
  isActivating: boolean;
}

const ActivateProductModal: React.FC<ActivateProductModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  producto,
  isActivating,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#ecd8ab]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#3A3A3A]">Activar Producto</h2>
              <p className="text-sm text-[#9A8C61]">Confirmar activación</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isActivating}
            className="p-2 hover:bg-[#F5E6C6]/30 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-[#9A8C61]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-semibold text-[#3A3A3A]">
                ¿Está seguro que desea activar este producto?
              </h3>
            </div>
            
            <div className="bg-[#F5E6C6]/20 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-[#F5E6C6]/50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-[#CC9F53]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-[#3A3A3A] mb-1">
                    {producto.nombre}
                  </h4>
                  <p className="text-sm text-[#9A8C61] mb-2">
                    SKU: {producto.sku}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-300">
                      Inactivo
                    </span>
                    <span className="text-[#9A8C61]">→</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                      Activo
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-800 mb-1">
                    Al activar este producto:
                  </p>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• El producto estará visible en el catálogo público</li>
                    <li>• Los clientes podrán agregarlo al carrito</li>
                    <li>• Aparecerá en los resultados de búsqueda</li>
                    <li>• Se incluirá en las estadísticas de productos activos</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isActivating}
              className="border-[#CC9F53] text-[#CC9F53] hover:bg-[#CC9F53] hover:text-white disabled:opacity-50"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={onConfirm}
              disabled={isActivating}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-300 disabled:opacity-50"
            >
              {isActivating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Activando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Sí, Activar Producto
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivateProductModal;
