'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/Button';
import { X, Package, Calendar, CreditCard, Truck, MapPin, Star, Eye, MessageSquare } from 'lucide-react';
import { Pedido } from '@/services/pedidos.service';
import { EstadoPedidoLabels, EstadoPedidoColors, MetodoPagoLabels, MetodoEnvioLabels } from '@/types/enums';

interface PedidoDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  pedido: Pedido | null;
  onCreateReview?: (productoId: number, productoNombre: string) => void;
  onCreateClaim?: (pedidoId: number, pedidoNumero: string) => void;
}

const PedidoDetailModal: React.FC<PedidoDetailModalProps> = ({
  isOpen,
  onClose,
  pedido,
  onCreateReview,
  onCreateClaim,
}) => {
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

  if (!isOpen || !pedido) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-[#CC9F53]/10 to-[#B8903D]/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#CC9F53] to-[#B8903D] rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#3A3A3A]">
                Pedido #{pedido.numero}
              </h2>
              <p className="text-sm text-gray-500">
                Realizado el {new Date(pedido.creadoEn).toLocaleDateString('es-PE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Información del Pedido */}
            <div className="lg:col-span-2 space-y-6">
              {/* Estado del Pedido */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#3A3A3A] flex items-center">
                    <Package className="w-5 h-5 mr-2 text-blue-600" />
                    Estado del Pedido
                  </h3>
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${EstadoPedidoColors[pedido.estado as keyof typeof EstadoPedidoColors]}`}>
                    {EstadoPedidoLabels[pedido.estado as keyof typeof EstadoPedidoLabels]}
                  </span>
                </div>
                
                {/* Timeline de estado (simplificado) */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-600">Pedido confirmado</span>
                  </div>
                  <div className={`flex items-center text-sm ${['PROCESANDO', 'ENVIADO', 'ENTREGADO'].includes(pedido.estado) ? '' : 'opacity-50'}`}>
                    <div className={`w-2 h-2 rounded-full mr-3 ${['PROCESANDO', 'ENVIADO', 'ENTREGADO'].includes(pedido.estado) ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                    <span className="text-gray-600">En preparación</span>
                  </div>
                  <div className={`flex items-center text-sm ${['ENVIADO', 'ENTREGADO'].includes(pedido.estado) ? '' : 'opacity-50'}`}>
                    <div className={`w-2 h-2 rounded-full mr-3 ${['ENVIADO', 'ENTREGADO'].includes(pedido.estado) ? 'bg-yellow-500' : 'bg-gray-300'}`}></div>
                    <span className="text-gray-600">En camino</span>
                  </div>
                  <div className={`flex items-center text-sm ${pedido.estado === 'ENTREGADO' ? '' : 'opacity-50'}`}>
                    <div className={`w-2 h-2 rounded-full mr-3 ${pedido.estado === 'ENTREGADO' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-gray-600">Entregado</span>
                  </div>
                </div>
              </div>

              {/* Productos del Pedido */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#3A3A3A] mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-[#CC9F53]" />
                  Productos ({pedido.detallePedidos?.length || 0})
                </h3>
                
                <div className="space-y-4">
                  {pedido.detallePedidos?.map((detalle, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-500" />
                        </div>
                        <div>
                          <h4 className="font-medium text-[#3A3A3A]">
                            {detalle.producto?.nombre || `Producto ID: ${detalle.productoId}`}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Cantidad: {detalle.cantidad} × S/ {Number(detalle.precioUnitario).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#3A3A3A]">
                          S/ {Number(detalle.subtotal).toFixed(2)}
                        </p>
                        {pedido.estado === 'ENTREGADO' && onCreateReview && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2 text-xs"
                            onClick={() => onCreateReview(detalle.productoId, detalle.producto?.nombre || 'Producto')}
                          >
                            <Star className="w-3 h-3 mr-1" />
                            Reseñar
                          </Button>
                        )}
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-center py-4">
                      No se encontraron productos en este pedido
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Información de Envío y Pago */}
            <div className="space-y-6">
              {/* Resumen de Pago */}
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#3A3A3A] mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                  Resumen de Pago
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">S/ {Number(pedido.subtotal).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Envío</span>
                    <span className="font-medium">S/ {Number(pedido.envioMonto || 0).toFixed(2)}</span>
                  </div>
                  {pedido.descuentoMonto && Number(pedido.descuentoMonto) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Descuento</span>
                      <span className="font-medium text-green-600">-S/ {Number(pedido.descuentoMonto).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-green-200 pt-2 flex justify-between">
                    <span className="font-semibold text-[#3A3A3A]">Total</span>
                    <span className="font-bold text-lg text-green-600">S/ {Number(pedido.total).toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-green-200">
                  <div className="flex items-center text-sm">
                    <CreditCard className="w-4 h-4 mr-2 text-green-600" />
                    <span className="text-gray-600">Método de pago:</span>
                  </div>
                  <p className="font-medium text-[#3A3A3A] mt-1">
                    {MetodoPagoLabels[pedido.metodoPago as keyof typeof MetodoPagoLabels]}
                  </p>
                </div>
              </div>

              {/* Información de Envío */}
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#3A3A3A] mb-4 flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-orange-600" />
                  Información de Envío
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Truck className="w-4 h-4 mr-2 text-orange-600" />
                    <span className="text-gray-600">Método:</span>
                  </div>
                  <p className="font-medium text-[#3A3A3A]">
                    {MetodoEnvioLabels[pedido.metodoEnvio as keyof typeof MetodoEnvioLabels]}
                  </p>

                  {pedido.direccion && (
                    <>
                      <div className="flex items-center text-sm mt-4">
                        <MapPin className="w-4 h-4 mr-2 text-orange-600" />
                        <span className="text-gray-600">Dirección de envío:</span>
                      </div>
                      <div className="bg-white/50 rounded-lg p-3 mt-2">
                        <p className="text-sm font-medium text-[#3A3A3A]">
                          {pedido.direccion.direccion}
                        </p>
                        <p className="text-sm text-gray-600">
                          {pedido.direccion.ciudad}, {pedido.direccion.departamento}
                        </p>
                        <p className="text-sm text-gray-600 font-medium">
                          {pedido.direccion.alias}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Fechas Importantes */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#3A3A3A] mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  Fechas Importantes
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600">Pedido realizado:</span>
                    <p className="font-medium text-[#3A3A3A]">
                      {new Date(pedido.fechaPedido || pedido.creadoEn).toLocaleDateString('es-PE', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  
                  {pedido.fechaEntrega && (
                    <div>
                      <span className="text-gray-600">Fecha de entrega:</span>
                      <p className="font-medium text-[#3A3A3A]">
                        {new Date(pedido.fechaEntrega).toLocaleDateString('es-PE', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-6 bg-gray-50/50">
          <div className="flex justify-between items-center">
            <div className="flex space-x-3">
              {/* Botón para crear reclamo - disponible para pedidos no pendientes */}
              {pedido.estado !== 'PENDIENTE' && onCreateClaim && (
                <Button
                  variant="outline"
                  className="text-orange-600 border-orange-200 hover:bg-orange-50"
                  onClick={() => onCreateClaim(pedido.id, pedido.numero)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Crear Reclamo
                </Button>
              )}
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
              >
                Cerrar
              </Button>
              {pedido.estado === 'ENTREGADO' && (
                <Button
                  className="bg-[#CC9F53] hover:bg-[#B8903D] text-white"
                  onClick={() => {
                    // TODO: Implementar descarga de factura
                    console.log('Descargar factura del pedido:', pedido.id);
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Factura
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' 
    ? createPortal(modalContent, document.body)
    : null;
};

export default PedidoDetailModal;
