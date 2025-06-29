'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/Button';
import { X, Trash2, Heart, AlertTriangle } from 'lucide-react';

interface ClearFavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  favoritesCount: number;
}

const ClearFavoritesModal: React.FC<ClearFavoritesModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  favoritesCount,
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      // Guardar el scroll actual
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Restaurar scroll cuando se cierre
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup: siempre restaurar scroll cuando el componente se desmonte
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  // Manejar click en el backdrop para cerrar el modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Manejar tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
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

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100 opacity-100 border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center border border-orange-200">
              <Heart className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              Vaciar Favoritos
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 text-sm mb-4">
            Esta acción no se puede deshacer
          </p>

          {/* Info Box */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-orange-600 font-bold text-sm">!</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-base mb-2">
                  Lista para vaciar
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{favoritesCount} {favoritesCount === 1 ? 'producto' : 'productos'}</span>
                  <span>•</span>
                  <span>Lista de favoritos</span>
                </div>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-orange-100 text-orange-700">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Irreversible
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Warning Box */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-yellow-800 text-sm mb-1">
                  ¿Confirmas vaciar la lista de favoritos?
                </h4>
                <p className="text-yellow-700 text-xs leading-relaxed">
                  Todos los productos serán eliminados permanentemente y no podrás recuperarlos.
                </p>
              </div>
            </div>
          </div>

          {/* Info List */}
          <div className="mb-6">
            <h4 className="text-gray-800 font-medium text-sm mb-3 flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-xs">?</span>
              </span>
              Qué sucederá:
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-blue-600">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                Se eliminarán {favoritesCount} {favoritesCount === 1 ? 'producto' : 'productos'}
              </li>
              <li className="flex items-center gap-2 text-green-600">
                <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                Podrás agregar productos nuevamente
              </li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleConfirm}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Vaciar favoritos
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-4 rounded-xl transition-colors"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Usar portal para renderizar el modal en el body
  return typeof document !== 'undefined' 
    ? createPortal(modalContent, document.body)
    : null;
};

export default ClearFavoritesModal;
