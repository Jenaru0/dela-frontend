'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/Button';
import { X, Star, MessageSquare, Send, AlertCircle } from 'lucide-react';

interface CreateReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reviewData: { productoId: number; calificacion: number; comentario: string }) => Promise<void>;
  productoId: number;
  productoNombre: string;
}

const CreateReviewModal: React.FC<CreateReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  productoId,
  productoNombre,
}) => {
  const [calificacion, setCalificacion] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comentario, setComentario] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setCalificacion(0);
      setHoverRating(0);
      setComentario('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (calificacion === 0) {
      setError('Por favor selecciona una calificación');
      return;
    }

    if (comentario.trim().length < 10) {
      setError('El comentario debe tener al menos 10 caracteres');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        productoId,
        calificacion,
        comentario: comentario.trim(),
      });
      onClose();
    } catch (error: unknown) {
      console.error('Error al crear reseña:', error);
      
      // Usar el mensaje del error si está disponible, sino usar uno genérico
      const errorMessage = error instanceof Error ? error.message : 'Error al enviar la reseña. Por favor intenta de nuevo.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return 'Muy malo';
      case 2: return 'Malo';
      case 3: return 'Regular';
      case 4: return 'Bueno';
      case 5: return 'Excelente';
      default: return 'Selecciona una calificación';
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 transform transition-all duration-300 scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-[#CC9F53]/10 to-[#B8903D]/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#CC9F53] to-[#B8903D] rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#3A3A3A]">
                Escribir Reseña
              </h2>
              <p className="text-sm text-gray-500">
                Comparte tu experiencia con este producto
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
        <form onSubmit={handleSubmit} className="p-6">
          {/* Producto */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Producto
            </label>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-[#3A3A3A]">{productoNombre}</p>
            </div>
          </div>

          {/* Calificación */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Calificación *
            </label>
            <div className="flex items-center space-x-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 hover:scale-110 transition-transform"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setCalificacion(star)}
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoverRating || calificacion)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300 hover:text-yellow-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className={`text-sm font-medium ${
              calificacion > 0 ? 'text-[#CC9F53]' : 'text-gray-500'
            }`}>
              {getRatingText(hoverRating || calificacion)}
            </p>
          </div>

          {/* Comentario */}
          <div className="mb-6">
            <label htmlFor="comentario" className="block text-sm font-medium text-gray-700 mb-2">
              Comentario *
            </label>
            <div className="relative">
              <textarea
                id="comentario"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CC9F53] focus:border-transparent resize-none"
                placeholder="Cuéntanos sobre tu experiencia con este producto... (mínimo 10 caracteres)"
                disabled={isSubmitting}
              />
              <div className="absolute bottom-2 right-2 flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-gray-400" />
                <span className={`text-xs ${
                  comentario.length >= 10 ? 'text-green-600' : 'text-gray-400'
                }`}>
                  {comentario.length}/10
                </span>
              </div>
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
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Información sobre las reseñas:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Tu reseña será revisada antes de publicarse</li>
                  <li>• Puedes editar tu reseña después de enviarla</li>
                  <li>• Las reseñas ayudan a otros clientes a tomar decisiones</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3">
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
              className="flex-1 bg-[#CC9F53] hover:bg-[#B8903D] text-white"
              disabled={isSubmitting || calificacion === 0 || comentario.trim().length < 10}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Reseña
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

export default CreateReviewModal;
