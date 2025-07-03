'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/Button';
import { X, MessageSquare, Send, AlertCircle, Package } from 'lucide-react';

interface CreateClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (claimData: { 
    pedidoId?: number; 
    asunto: string; 
    descripcion: string; 
    tipoReclamo: string;
  }) => Promise<void>;
  pedidoId?: number;
  pedidoNumero?: string;
}

const tiposReclamo = [
  { value: 'PRODUCTO_DEFECTUOSO', label: 'Producto defectuoso' },
  { value: 'DEMORA_ENTREGA', label: 'Demora en entrega' },
  { value: 'PEDIDO_INCOMPLETO', label: 'Pedido incompleto' },
  { value: 'COBRO_INCORRECTO', label: 'Cobro incorrecto' },
  { value: 'SOLICITUD_CANCELACION', label: 'Solicitud de cancelación' },
  { value: 'SERVICIO_CLIENTE', label: 'Servicio al cliente' },
  { value: 'OTRO', label: 'Otro' },
];

const CreateClaimModal: React.FC<CreateClaimModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  pedidoId,
  pedidoNumero,
}) => {
  const [asunto, setAsunto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipoReclamo, setTipoReclamo] = useState('OTRO');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setAsunto('');
      setDescripcion('');
      setTipoReclamo('OTRO');
      setError('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  // Manejar click en el backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  // Manejar tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, isSubmitting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (asunto.trim().length < 5) {
      setError('El asunto debe tener al menos 5 caracteres');
      return;
    }

    if (descripcion.trim().length < 20) {
      setError('La descripción debe tener al menos 20 caracteres');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        ...(pedidoId && { pedidoId }),
        asunto: asunto.trim(),
        descripcion: descripcion.trim(),
        tipoReclamo,
      });
      onClose();
    } catch (error) {
      console.error('Error al crear reclamo:', error);
      setError('Error al enviar el reclamo. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-orange-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#3A3A3A]">
                Crear Reclamo
              </h2>
              <p className="text-sm text-gray-500">
                {pedidoNumero ? `Pedido #${pedidoNumero}` : 'Reclamo General'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Información del pedido */}
          {pedidoId && pedidoNumero && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Package className="w-5 h-5 text-blue-600" />
                <h3 className="font-medium text-blue-800">Información del Pedido</h3>
              </div>
              <p className="text-sm text-blue-700">
                Este reclamo se asociará con el pedido <strong>#{pedidoNumero}</strong>
              </p>
            </div>
          )}

          {/* Tipo de reclamo */}
          <div className="mb-6">
            <label htmlFor="tipoReclamo" className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Reclamo *
            </label>
            <select
              id="tipoReclamo"
              value={tipoReclamo}
              onChange={(e) => setTipoReclamo(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              disabled={isSubmitting}
            >
              {tiposReclamo.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>

          {/* Asunto */}
          <div className="mb-6">
            <label htmlFor="asunto" className="block text-sm font-medium text-gray-700 mb-2">
              Asunto *
            </label>
            <input
              type="text"
              id="asunto"
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Resumen breve del problema (mínimo 5 caracteres)"
              disabled={isSubmitting}
              maxLength={150}
            />
            <div className="mt-1 text-right">
              <span className={`text-xs ${
                asunto.length >= 5 ? 'text-green-600' : 'text-gray-400'
              }`}>
                {asunto.length}/150
              </span>
            </div>
          </div>

          {/* Descripción */}
          <div className="mb-6">
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción del Problema *
            </label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={6}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              placeholder="Describe detalladamente el problema. Incluye información relevante como fechas, condiciones del producto, etc. (mínimo 20 caracteres)"
              disabled={isSubmitting}
            />
            <div className="mt-1 text-right">
              <span className={`text-xs ${
                descripcion.length >= 20 ? 'text-green-600' : 'text-gray-400'
              }`}>
                {descripcion.length} caracteres
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Información adicional */}
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-700">
                <p className="font-medium mb-1">Información importante:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Revisaremos tu reclamo en un plazo máximo de 24 horas</li>
                  <li>• Te notificaremos por email sobre el estado de tu reclamo</li>
                  <li>• Puedes seguir el progreso desde tu perfil</li>
                  <li>• Proporciona la mayor información posible para una resolución rápida</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
              disabled={isSubmitting || asunto.trim().length < 5 || descripcion.trim().length < 20}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Reclamo
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  return typeof document !== 'undefined' 
    ? createPortal(modalContent, document.body)
    : null;
};

export default CreateClaimModal;
