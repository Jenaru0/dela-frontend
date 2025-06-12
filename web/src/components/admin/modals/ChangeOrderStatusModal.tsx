'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { X, Package, AlertCircle, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { Pedido, pedidosService } from '@/services/pedidos.service';
import { EstadoPedido, EstadoPedidoLabels, EstadoPedidoColors } from '@/types/enums';

interface ChangeOrderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  pedido: Pedido | null;
  onStatusChanged: () => void;
}

const ChangeOrderStatusModal: React.FC<ChangeOrderStatusModalProps> = ({
  isOpen,
  onClose,
  pedido,
  onStatusChanged,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<EstadoPedido | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [notasInternas, setNotasInternas] = useState('');

  // Bloquear scroll del body cuando el modal esté abierto
  React.useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [isOpen]);
  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen && pedido) {
      setSelectedStatus('');
      setError('');
      setNotasInternas(pedido.notasInternas || '');
    }
  }, [isOpen, pedido]);

  if (!isOpen || !pedido) return null;

  const availableStatuses = Object.values(EstadoPedido).filter(
    status => status !== pedido.estado
  );
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStatus) {
      setError('Por favor selecciona un estado');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await pedidosService.cambiarEstado(pedido.id, selectedStatus, notasInternas.trim() || undefined);
      onStatusChanged();
      onClose();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      setError('Error al cambiar el estado del pedido');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusDescription = (status: EstadoPedido): string => {
    switch (status) {
      case EstadoPedido.PENDIENTE:
        return 'El pedido está esperando confirmación o pago';
      case EstadoPedido.CONFIRMADO:
        return 'El pedido ha sido confirmado y se procederá a prepararlo';
      case EstadoPedido.PROCESANDO:
        return 'El pedido está siendo preparado';
      case EstadoPedido.ENVIADO:
        return 'El pedido ha sido enviado y está en camino';
      case EstadoPedido.ENTREGADO:
        return 'El pedido ha sido entregado exitosamente';
      case EstadoPedido.CANCELADO:
        return 'El pedido ha sido cancelado';
      default:
        return '';
    }
  };
  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE':
        return <Clock className="w-4 h-4" />;
      case 'CONFIRMADO':
        return <CheckCircle className="w-4 h-4" />;
      case 'PROCESANDO':
        return <Package className="w-4 h-4" />;
      case 'ENVIADO':
        return <Truck className="w-4 h-4" />;
      case 'ENTREGADO':
        return <CheckCircle className="w-4 h-4" />;
      case 'CANCELADO':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#ecd8ab]/30">
          <div>
            <h2 className="text-xl font-bold text-[#3A3A3A]">Cambiar Estado del Pedido</h2>
            <p className="text-[#9A8C61] mt-1">#{pedido.numero}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-[#F5E6C6]/30"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Estado actual */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#3A3A3A]">Estado Actual</label>
            <div className="bg-[#F5E6C6]/20 p-3 rounded-lg">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${EstadoPedidoColors[pedido.estado as keyof typeof EstadoPedidoColors]}`}>
                {getStatusIcon(pedido.estado)}
                <span className="ml-2">{EstadoPedidoLabels[pedido.estado as keyof typeof EstadoPedidoLabels]}</span>
              </span>
            </div>
          </div>

          {/* Nuevo estado */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#3A3A3A]">
              Nuevo Estado *
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as EstadoPedido)}
              className="w-full px-3 py-2 border border-[#ecd8ab]/50 rounded-md focus:border-[#CC9F53] focus:ring-[#CC9F53]/20 focus:outline-none"
              required
            >
              <option value="">Seleccionar estado...</option>
              {availableStatuses.map((status) => (
                <option key={status} value={status}>
                  {EstadoPedidoLabels[status]}
                </option>
              ))}
            </select>
            {error && (
              <div className="flex items-center text-red-600 text-sm mt-1">
                <AlertCircle className="w-4 h-4 mr-1" />
                {error}
              </div>
            )}
          </div>          {/* Descripción del estado seleccionado */}
          {selectedStatus && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Descripción:</strong> {getStatusDescription(selectedStatus)}
              </p>
            </div>
          )}          {/* Notas Internas */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#3A3A3A]">
              Notas Internas (Opcional)
              {pedido.notasInternas && (
                <span className="ml-2 text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded">
                  Tiene notas previas
                </span>
              )}
            </label>
            <textarea
              value={notasInternas}
              onChange={(e) => setNotasInternas(e.target.value)}
              placeholder={pedido.notasInternas ? "Editar notas internas existentes..." : "Agregar notas internas sobre este cambio de estado..."}
              className="w-full px-3 py-2 border border-[#ecd8ab]/50 rounded-md focus:border-[#CC9F53] focus:ring-[#CC9F53]/20 focus:outline-none resize-none"
              rows={3}
            />
            <p className="text-xs text-[#9A8C61]">
              Estas notas son solo visibles para el equipo administrativo
              {pedido.notasInternas && " • Se sobrescribirán las notas existentes"}
            </p>
          </div>

          {/* Warning para estados críticos */}
          {(selectedStatus === EstadoPedido.CANCELADO) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-800">Atención</p>
                  <p className="text-sm text-red-700 mt-1">
                    Esta acción cancelará el pedido. Asegúrate de que sea la decisión correcta.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#CC9F53] to-[#b08a3c] hover:from-[#b08a3c] hover:to-[#9a7635] text-white font-semibold transition-all duration-300"
              disabled={isLoading || !selectedStatus}
            >
              {isLoading ? 'Cambiando...' : 'Cambiar Estado'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangeOrderStatusModal;