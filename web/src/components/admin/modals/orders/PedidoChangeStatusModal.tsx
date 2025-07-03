'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { 
  X, 
  Package, 
  CheckCircle, 
  AlertCircle,
  Edit3,
  Clock,
  Truck,
  XCircle
} from 'lucide-react';
import { Pedido } from '@/services/pedidos.service';
import { pedidosService } from '@/services/pedidos.service';
import { EstadoPedido, EstadoPedidoLabels, EstadoPedidoColors } from '@/types/enums';

interface PedidoChangeStatusModalProps {
  pedido: Pedido;
  isOpen: boolean;
  onClose: () => void;
  onStatusChanged: () => void;
}

const PedidoChangeStatusModal: React.FC<PedidoChangeStatusModalProps> = ({ 
  pedido, 
  isOpen, 
  onClose, 
  onStatusChanged 
}) => {
  const [selectedStatus, setSelectedStatus] = useState<EstadoPedido>(pedido.estado);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'ENTREGADO':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'ENVIADO':
        return <Truck className="h-4 w-4 text-blue-600" />;
      case 'PROCESANDO':
        return <Package className="h-4 w-4 text-orange-600" />;
      case 'CONFIRMADO':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'PENDIENTE':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'CANCELADO':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };
  const estadosDisponibles: { value: EstadoPedido; label: string; description: string; color: string; bgColor: string }[] = [
    { 
      value: EstadoPedido.PENDIENTE, 
      label: EstadoPedidoLabels[EstadoPedido.PENDIENTE], 
      description: 'Esperando confirmación',
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-50 border-yellow-200'
    },
    { 
      value: EstadoPedido.CONFIRMADO, 
      label: EstadoPedidoLabels[EstadoPedido.CONFIRMADO], 
      description: 'Listo para procesar',
      color: 'text-blue-700',
      bgColor: 'bg-blue-50 border-blue-200'
    },
    { 
      value: EstadoPedido.PROCESANDO, 
      label: EstadoPedidoLabels[EstadoPedido.PROCESANDO], 
      description: 'Preparando productos',
      color: 'text-orange-700',
      bgColor: 'bg-orange-50 border-orange-200'
    },
    { 
      value: EstadoPedido.ENVIADO, 
      label: EstadoPedidoLabels[EstadoPedido.ENVIADO], 
      description: 'En camino',
      color: 'text-purple-700',
      bgColor: 'bg-purple-50 border-purple-200'
    },
    { 
      value: EstadoPedido.ENTREGADO, 
      label: EstadoPedidoLabels[EstadoPedido.ENTREGADO], 
      description: 'Entregado exitosamente',
      color: 'text-green-700',
      bgColor: 'bg-green-50 border-green-200'
    },
    { 
      value: EstadoPedido.CANCELADO, 
      label: EstadoPedidoLabels[EstadoPedido.CANCELADO], 
      description: 'Cancelado',
      color: 'text-red-700',
      bgColor: 'bg-red-50 border-red-200'
    },
  ];

  const handleStatusChange = async () => {
    if (selectedStatus === pedido.estado) {
      onClose();
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      await pedidosService.cambiarEstado(pedido.id, selectedStatus);
      
      // Si hay notas, se podrían enviar al backend en una actualización futura
      if (notes.trim()) {
        console.log('Notas del cambio de estado:', notes);
      }
      
      onStatusChanged();
      onClose();
    } catch (error) {
      console.error('Error al cambiar estado del pedido:', error);
      setError('Error al cambiar el estado del pedido. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setSelectedStatus(pedido.estado);
      setNotes('');
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={handleClose} />
        
        <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#CC9F53] to-[#b08a3c] rounded-xl text-white shadow-lg">
                <Edit3 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#3A3A3A]">
                  Actualizar Estado
                </h2>
                <p className="text-[#9A8C61] text-sm flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Pedido #{pedido.numero}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2"
              disabled={isLoading}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Estado Actual */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#3A3A3A]">Estado Actual</h3>
                <div className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold border-2 ${EstadoPedidoColors[pedido.estado as keyof typeof EstadoPedidoColors]}`}>
                  {getStatusIcon(pedido.estado)}
                  <span className="ml-2">{EstadoPedidoLabels[pedido.estado as keyof typeof EstadoPedidoLabels]}</span>
                </div>
              </div>
              
              {/* Información del pedido */}
              <div className="bg-gradient-to-r from-[#FAF3E7] to-[#F5E6C6] rounded-xl p-4 border border-[#CC9F53]/20">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[#9A8C61] font-medium">Total:</span>
                    <span className="ml-2 font-bold text-[#CC9F53]">S/ {Number(pedido.total).toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-[#9A8C61] font-medium">Fecha:</span>
                    <span className="ml-2 text-[#3A3A3A]">{new Date(pedido.creadoEn).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Nuevo Estado */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#3A3A3A] mb-4">
                Seleccionar Nuevo Estado
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {estadosDisponibles.map((estado) => (
                  <label
                    key={estado.value}
                    className={`flex items-center space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      selectedStatus === estado.value
                        ? 'border-[#CC9F53] bg-[#FAF3E7] shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={estado.value}
                      checked={selectedStatus === estado.value}
                      onChange={(e) => setSelectedStatus(e.target.value as EstadoPedido)}
                      className="w-4 h-4 text-[#CC9F53] focus:ring-[#CC9F53] focus:ring-2"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(estado.value)}
                          <span className="font-semibold text-[#3A3A3A]">{estado.label}</span>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${estado.bgColor} ${estado.color}`}>
                          {estado.label}
                        </div>
                      </div>
                      <p className="text-sm text-[#9A8C61] mt-1 ml-7">{estado.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Notas Adicionales */}
            <div className="mb-8">
              <label htmlFor="notes" className="block text-lg font-semibold text-[#3A3A3A] mb-3">
                Notas Adicionales
              </label>
              <textarea
                id="notes"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Agregar comentarios sobre el cambio de estado... (opcional)"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#CC9F53] focus:border-[#CC9F53] resize-none transition-colors"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button
                onClick={handleClose}
                variant="outline"
                className="flex-1 text-[#9A8C61] border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 font-semibold py-3 rounded-xl"
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleStatusChange}
                className="flex-1 bg-gradient-to-r from-[#CC9F53] to-[#b08a3c] hover:from-[#b08a3c] hover:to-[#9a7635] text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={isLoading || selectedStatus === pedido.estado}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Actualizando...
                  </div>
                ) : selectedStatus === pedido.estado ? (
                  'Sin cambios'
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Actualizar Estado
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PedidoChangeStatusModal;
