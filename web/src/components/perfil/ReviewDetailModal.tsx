'use client';

import React, { useEffect } from 'react';
import { X, Star, Calendar, Package, MessageSquare, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Resena } from '@/services/resenas.service';
import { EstadoResenaLabels } from '@/types/enums';

interface ReviewDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  resena: Resena | null;
}

const ReviewDetailModal: React.FC<ReviewDetailModalProps> = ({
  isOpen,
  onClose,
  resena
}) => {
  console.log('🔍 ReviewDetailModal - isOpen:', isOpen, 'resena:', resena);
  
  // Manejar el bloqueo del scroll del body
  useEffect(() => {
    if (isOpen) {
      // Bloquear scroll del body cuando se abre el modal
      document.body.style.overflow = 'hidden';
    } else {
      // Restaurar scroll del body cuando se cierra el modal
      document.body.style.overflow = 'unset';
    }

    // Cleanup: restaurar scroll cuando el componente se desmonte
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  if (!isOpen || !resena) return null;

  // Función para obtener el icono del estado
  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'APROBADO':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'PENDIENTE':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'RECHAZADO':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  // Función para obtener el color del estado
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'APROBADO':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'PENDIENTE':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'RECHAZADO':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fadeIn">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-xl rounded-2xl p-6 transform transition-all duration-300 animate-slideUp">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#CC9F53]/10 rounded-full flex items-center justify-center">
                <Star className="h-5 w-5 text-[#CC9F53]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Detalle de Reseña
                </h3>
                <p className="text-gray-600 text-sm">
                  Información completa de tu reseña
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Producto */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <Package className="h-5 w-5 text-[#CC9F53]" />
                <h4 className="font-semibold text-gray-900">Producto Reseñado</h4>
              </div>
              <p className="text-gray-700 font-medium">
                {resena.producto?.nombre || `Producto ID: ${resena.productoId}`}
              </p>
            </div>

            {/* Calificación */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Star className="h-5 w-5 text-[#CC9F53]" />
                <h4 className="font-semibold text-gray-900">Calificación</h4>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-6 w-6 ${
                        star <= resena.calificacion
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {resena.calificacion}/5
                </span>
                <span className="text-gray-600">
                  ({resena.calificacion === 5 ? 'Excelente' :
                    resena.calificacion === 4 ? 'Muy bueno' :
                    resena.calificacion === 3 ? 'Bueno' :
                    resena.calificacion === 2 ? 'Regular' : 'Malo'})
                </span>
              </div>
            </div>

            {/* Comentario */}
            {resena.comentario && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <MessageSquare className="h-5 w-5 text-[#CC9F53]" />
                  <h4 className="font-semibold text-gray-900">Comentario</h4>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {resena.comentario}
                  </p>
                </div>
              </div>
            )}

            {/* Estado y Fechas */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Estado */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  {getEstadoIcon(resena.estado)}
                  <h4 className="font-semibold text-gray-900">Estado</h4>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getEstadoColor(resena.estado)}`}>
                    {EstadoResenaLabels[resena.estado as keyof typeof EstadoResenaLabels]}
                  </span>
                </div>
                {resena.estado === 'PENDIENTE' && (
                  <p className="text-xs text-gray-600 mt-2">
                    Tu reseña está siendo revisada por nuestro equipo
                  </p>
                )}
                {resena.estado === 'RECHAZADO' && (
                  <p className="text-xs text-red-600 mt-2">
                    Tu reseña no cumplió con nuestras políticas de contenido
                  </p>
                )}
              </div>

              {/* Fecha de creación */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Calendar className="h-5 w-5 text-[#CC9F53]" />
                  <h4 className="font-semibold text-gray-900">Fecha de Creación</h4>
                </div>
                <p className="text-gray-700">
                  {new Date(resena.creadoEn).toLocaleDateString('es-PE', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-gray-600 text-sm">
                  {new Date(resena.creadoEn).toLocaleTimeString('es-PE', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>

            {/* Información adicional */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-xs font-bold">i</span>
                </div>
                <div>
                  <h5 className="font-medium text-blue-900 mb-1">
                    Información sobre las reseñas
                  </h5>
                  <p className="text-blue-800 text-sm leading-relaxed">
                    Las reseñas son revisadas por nuestro equipo para garantizar que cumplan con nuestras 
                    políticas de contenido. Una vez aprobadas, serán visibles para otros usuarios en la 
                    página del producto.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-[#CC9F53] text-[#CC9F53] hover:bg-[#CC9F53] hover:text-white"
            >
              Cerrar
            </Button>
          </div>
        </div>
    </div>
  );
};

export default ReviewDetailModal;
