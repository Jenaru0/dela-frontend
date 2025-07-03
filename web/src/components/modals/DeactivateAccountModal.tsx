import React, { useEffect } from 'react';
import { UserX, X, AlertTriangle, Shield, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface DeactivateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const DeactivateAccountModal: React.FC<DeactivateAccountModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
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

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleBackdropClick}
    >
      <div
        className={`
          bg-white rounded-2xl shadow-2xl w-full max-w-md 
          transform transition-all duration-300 ease-out
          animate-in fade-in slide-in-from-bottom-4
          border-red-200 border-2
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="deactivate-modal-title"
      >
        {/* Header con ícono y título */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-t-2xl border-b border-red-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-full bg-red-100">
                <UserX className="w-6 h-6 text-red-600" />
              </div>
              <h2 
                id="deactivate-modal-title" 
                className="text-xl font-semibold text-gray-800"
              >
                Desactivar Cuenta
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

        {/* Contenido del mensaje */}
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <p className="text-gray-700 text-base font-medium">
              ¿Estás seguro de que quieres desactivar tu cuenta?
            </p>
          </div>
          
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Esta es una acción permanente que no se puede deshacer. Al desactivar tu cuenta:
          </p>

          {/* Lista de consecuencias */}
          <div className="mb-6 space-y-3">
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Trash2 className="w-4 h-4 text-red-500" />
                <span>Perderás acceso permanente a tu perfil</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trash2 className="w-4 h-4 text-red-500" />
                <span>Se eliminará tu historial de pedidos</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trash2 className="w-4 h-4 text-red-500" />
                <span>Se borrarán todas tus direcciones guardadas</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trash2 className="w-4 h-4 text-red-500" />
                <span>Se eliminarán tus reseñas y favoritos</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-red-500" />
                <span>No podrás recuperar estos datos posteriormente</span>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs text-red-700 font-medium">
                ⚠️ ATENCIÓN: Esta acción es irreversible. Si solo necesitas un descanso, considera cerrar sesión temporalmente.
              </p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 text-white bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Desactivando...
                </>
              ) : (
                'Sí, desactivar cuenta'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
