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
  const estadosDisponibles: { value: EstadoPedido; label: string; description: string }[] = [
    { 
      value: EstadoPedido.PENDIENTE, 
      label: 'Pendiente', 
      description: 'El pedido está pendiente de confirmación' 
    },
    { 
      value: EstadoPedido.CONFIRMADO, 
      label: 'Confirmado', 
      description: 'El pedido ha sido confirmado y está listo para procesarse' 
    },
    { 
      value: EstadoPedido.PROCESANDO, 
      label: 'Procesando', 
      description: 'El pedido está siendo preparado' 
    },
    { 
      value: EstadoPedido.ENVIADO, 
      label: 'Enviado', 
      description: 'El pedido ha sido enviado al cliente' 
    },
    { 
      value: EstadoPedido.ENTREGADO, 
      label: 'Entregado', 
      description: 'El pedido ha sido entregado exitosamente' 
    },
    { 
      value: EstadoPedido.CANCELADO, 
      label: 'Cancelado', 
      description: 'El pedido ha sido cancelado' 
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
        <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
        
        <div className="relative bg-white rounded-xl max-w-md w-full shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#CC9F53] to-[#b08a3c] rounded-full text-white">
                <Edit3 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#3A3A3A]">
                  Cambiar Estado del Pedido
                </h2>
                <p className="text-[#9A8C61] text-sm">#{pedido.numero}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
              disabled={isLoading}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Estado Actual */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#3A3A3A] mb-2">
                Estado Actual
              </label>
              <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium border ${EstadoPedidoColors[pedido.estado as keyof typeof EstadoPedidoColors]}`}>
                {getStatusIcon(pedido.estado)}
                <span className="ml-2">{EstadoPedidoLabels[pedido.estado as keyof typeof EstadoPedidoLabels]}</span>
              </div>
            </div>

            {/* Nuevo Estado */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#3A3A3A] mb-3">
                Seleccionar Nuevo Estado
              </label>
              <div className="space-y-2">
                {estadosDisponibles.map((estado) => (
                  <label
                    key={estado.value}
                    className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedStatus === estado.value
                        ? 'border-[#CC9F53] bg-[#F5E6C6]/30'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={estado.value}
                      checked={selectedStatus === estado.value}
                      onChange={(e) => setSelectedStatus(e.target.value as EstadoPedido)}
                      className="mt-1 text-[#CC9F53] focus:ring-[#CC9F53]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(estado.value)}
                        <span className="font-medium text-[#3A3A3A]">{estado.label}</span>
                      </div>
                      <p className="text-sm text-[#9A8C61] mt-1">{estado.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Notas Adicionales */}
            <div className="mb-6">
              <label htmlFor="notes" className="block text-sm font-medium text-[#3A3A3A] mb-2">
                Notas Adicionales (Opcional)
              </label>
              <textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Agregar comentarios sobre el cambio de estado..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CC9F53] focus:border-[#CC9F53] resize-none"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                onClick={handleClose}
                variant="outline"
                className="flex-1 text-[#9A8C61] border-[#E5E0C8] hover:bg-[#F5E6C6]/30"
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleStatusChange}
                className="flex-1 bg-[#CC9F53] hover:bg-[#b08a3c] text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Cambiando...
                  </div>
                ) : (
                  'Cambiar Estado'
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
