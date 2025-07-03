'use client';

import React, { useEffect } from 'react';
import { 
  X, 
  Star, 
  User, 
  ShoppingBag, 
  MessageSquare, 
  Check,
  AlertTriangle,
  XIcon
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Resena } from '@/services/resenas.service';
import { EstadoResena } from '@/types/enums';

interface ReviewDetailModalProps {
  resena: Resena | null;
  isOpen: boolean;
  onClose: () => void;
  onChangeStatus: (id: number, status: EstadoResena) => Promise<void>;
}

export const ReviewDetailModal: React.FC<ReviewDetailModalProps> = ({
  resena,
  isOpen,
  onClose,
  onChangeStatus
}) => {
  // Bloquear scroll del fondo cuando el modal está abierto
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

  if (!isOpen || !resena) return null;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'APROBADO':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'RECHAZADO':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE':
        return 'Pendiente de revisión';
      case 'APROBADO':
        return 'Aprobada y visible';
      case 'RECHAZADO':
        return 'Rechazada y oculta';
      default:
        return estado;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Detalle de Reseña</h2>
            <p className="text-sm text-gray-500">ID: #{resena.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Estado y Fecha */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Estado</p>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${getStatusColor(resena.estado)}`}>
                  {getStatusText(resena.estado)}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Fecha de creación</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(resena.creadoEn).toLocaleDateString('es-PE')} • {new Date(resena.creadoEn).toLocaleTimeString('es-PE', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Cliente y Producto */}
            <div className="grid grid-cols-2 gap-6">
              {/* Cliente */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Cliente</p>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <p className="font-medium text-gray-900">
                    {resena.usuario?.nombres} {resena.usuario?.apellidos}
                  </p>
                </div>
              </div>

              {/* Producto */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Producto</p>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 text-gray-600" />
                  </div>
                  <p className="font-medium text-gray-900 truncate">
                    {resena.producto?.nombre}
                  </p>
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Calificación */}
            <div>
              <p className="text-sm text-gray-600 mb-3">Puntuación</p>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  {renderStars(resena.calificacion)}
                </div>
                <span className="text-base font-semibold text-gray-900">
                  {resena.calificacion} de 5
                </span>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Comentario */}
            <div>
              <p className="text-sm text-gray-600 mb-3">Comentario del cliente</p>
              {resena.comentario ? (
                <div className="bg-gray-50 rounded-md p-4">
                  <p className="text-gray-800 leading-relaxed">
                    &ldquo;{resena.comentario}&rdquo;
                  </p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <MessageSquare className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No hay comentarios</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Última actualización: {new Date(resena.actualizadoEn).toLocaleDateString('es-PE')}
          </p>
          <div className="flex items-center space-x-2">
            {resena.estado === EstadoResena.PENDIENTE && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onChangeStatus(resena.id, EstadoResena.RECHAZADO)}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <XIcon className="w-4 h-4 mr-1" />
                  Rechazar
                </Button>
                <Button
                  size="sm"
                  onClick={() => onChangeStatus(resena.id, EstadoResena.APROBADO)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Aprobar
                </Button>
              </>
            )}
            {resena.estado !== EstadoResena.PENDIENTE && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onChangeStatus(resena.id, EstadoResena.PENDIENTE)}
                className="text-orange-600 border-orange-200 hover:bg-orange-50"
              >
                <AlertTriangle className="w-4 h-4 mr-1" />
                Marcar como pendiente
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
