'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import {
  X,
  Package,
  User,
  MapPin,
  CreditCard,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  XCircle,
  Receipt,
  History,
  FileText,
} from 'lucide-react';
import { Pedido } from '@/services/pedidos.service';
import { pedidosService } from '@/services/pedidos.service';
import {
  EstadoPedidoLabels,
  EstadoPedidoColors,
  MetodoPagoLabels,
  MetodoEnvioLabels,
} from '@/types/enums';

interface EnhancedPedidoDetailModalProps {
  pedido: Pedido;
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'general' | 'productos' | 'cliente' | 'admin' | 'historial';

const EnhancedPedidoDetailModal: React.FC<EnhancedPedidoDetailModalProps> = ({
  pedido,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadPedidoDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await pedidosService.obtenerPorId(pedido.id);
      console.log('Detalles del pedido cargados:', response.data);
    } catch (error) {
      console.error('Error al cargar detalles del pedido:', error);
      setError('Error al cargar los detalles del pedido');
    } finally {
      setIsLoading(false);
    }
  }, [pedido.id]);

  useEffect(() => {
    if (isOpen && pedido) {
      loadPedidoDetails();
    }
  }, [isOpen, pedido, loadPedidoDetails]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(amount);
  };

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
  const tabs = [
    { id: 'general', label: 'Información General', icon: Receipt, count: null },
    {
      id: 'productos',
      label: 'Productos',
      icon: Package,
      count: pedido.detallePedidos?.length || 0,
    },
    { id: 'cliente', label: 'Cliente', icon: User, count: null },
    { id: 'admin', label: 'Información Admin', icon: FileText, count: null },
    { id: 'historial', label: 'Historial', icon: History, count: null },
  ] as const;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />

        <div className="relative bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#CC9F53] to-[#b08a3c] rounded-full text-white">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#3A3A3A]">
                  Pedido #{pedido.numero}
                </h2>
                <p className="text-[#9A8C61] text-sm">
                  Cliente: {pedido.usuario?.nombres} {pedido.usuario?.apellidos}
                </p>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 border ${
                    EstadoPedidoColors[
                      pedido.estado as keyof typeof EstadoPedidoColors
                    ]
                  }`}
                >
                  {getStatusIcon(pedido.estado)}
                  <span className="ml-1">
                    {
                      EstadoPedidoLabels[
                        pedido.estado as keyof typeof EstadoPedidoLabels
                      ]
                    }
                  </span>
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-0 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-[#CC9F53] text-[#CC9F53]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                    {tab.count !== null && (
                      <span
                        className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded-full ${
                          activeTab === tab.id
                            ? 'bg-[#CC9F53] text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CC9F53]"></div>
                <span className="ml-3 text-[#9A8C61]">
                  Cargando detalles del pedido...
                </span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 mb-2">Error al cargar datos</p>
                <p className="text-gray-500 text-sm">{error}</p>
                <Button
                  onClick={loadPedidoDetails}
                  className="mt-4"
                  variant="outline"
                >
                  Reintentar
                </Button>
              </div>
            ) : (
              <>
                {/* General Tab */}
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-[#3A3A3A] mb-4">
                          Información del Pedido
                        </h3>
                        <div className="flex items-center space-x-3">
                          <Package className="h-5 w-5 text-[#CC9F53]" />
                          <div>
                            <p className="text-sm text-[#9A8C61]">
                              Número de Pedido
                            </p>
                            <p className="font-medium text-[#3A3A3A]">
                              {pedido.numero}
                            </p>
                          </div>
                        </div>{' '}
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-[#CC9F53]" />
                          <div>
                            <p className="text-sm text-[#9A8C61]">
                              Fecha del Pedido
                            </p>
                            <p className="font-medium text-[#3A3A3A]">
                              {formatDate(
                                pedido.fechaPedido || pedido.creadoEn
                              )}
                            </p>
                          </div>
                        </div>
                        {pedido.fechaEntrega && (
                          <div className="flex items-center space-x-3">
                            <Truck className="h-5 w-5 text-[#CC9F53]" />
                            <div>
                              <p className="text-sm text-[#9A8C61]">
                                Fecha de Entrega
                              </p>
                              <p className="font-medium text-[#3A3A3A]">
                                {formatDate(pedido.fechaEntrega)}
                              </p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center space-x-3">
                          <CreditCard className="h-5 w-5 text-[#CC9F53]" />
                          <div>
                            <p className="text-sm text-[#9A8C61]">
                              Método de Pago
                            </p>
                            <p className="font-medium text-[#3A3A3A]">
                              {
                                MetodoPagoLabels[
                                  pedido.metodoPago as keyof typeof MetodoPagoLabels
                                ]
                              }
                            </p>
                          </div>
                        </div>{' '}
                        <div className="flex items-center space-x-3">
                          <Truck className="h-5 w-5 text-[#CC9F53]" />
                          <div>
                            <p className="text-sm text-[#9A8C61]">
                              Método de Envío
                            </p>
                            <p className="font-medium text-[#3A3A3A]">
                              {
                                MetodoEnvioLabels[
                                  pedido.metodoEnvio as keyof typeof MetodoEnvioLabels
                                ]
                              }
                            </p>
                          </div>
                        </div>
                        {pedido.promocionCodigo && (
                          <div className="flex items-center space-x-3">
                            <Receipt className="h-5 w-5 text-[#CC9F53]" />
                            <div>
                              <p className="text-sm text-[#9A8C61]">
                                Cupón de Descuento
                              </p>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-[#3A3A3A] bg-[#F5E6C6]/40 px-3 py-1 rounded-lg border border-[#CC9F53]/30">
                                  {pedido.promocionCodigo}
                                </span>
                                <span className="text-sm text-green-600 font-medium">
                                  -{formatCurrency(Number(pedido.descuentoMonto))}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-[#3A3A3A] mb-4">
                          Resumen de Montos
                        </h3>

                        <div className="bg-[#F5E6C6]/20 rounded-lg p-4 space-y-3">
                          <div className="flex justify-between">
                            <span className="text-[#9A8C61]">Subtotal:</span>
                            <span className="font-medium text-[#3A3A3A]">
                              {formatCurrency(Number(pedido.subtotal) || 0)}
                            </span>
                          </div>{' '}
                          <div className="flex justify-between">
                            <span className="text-[#9A8C61]">Envío:</span>
                            <span className="font-medium text-[#3A3A3A]">
                              {formatCurrency(Number(pedido.envioMonto) || 0)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#9A8C61]">Impuestos:</span>
                            <span className="font-medium text-[#3A3A3A]">
                              {formatCurrency(Number(pedido.impuestos) || 0)}
                            </span>
                          </div>{' '}
                          {Number(pedido.descuentoMonto) > 0 && (
                            <>
                              <div className="flex justify-between">
                                <span className="text-[#9A8C61]">
                                  Descuento:
                                </span>
                                <span className="font-medium text-green-600">
                                  -{formatCurrency(Number(pedido.descuentoMonto))}
                                </span>
                              </div>
                              {pedido.promocionCodigo && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-[#9A8C61]">
                                    Cupón utilizado:
                                  </span>
                                  <span className="font-medium text-[#CC9F53] bg-[#F5E6C6]/30 px-2 py-1 rounded text-xs">
                                    {pedido.promocionCodigo}
                                  </span>
                                </div>
                              )}
                            </>
                          )}
                          <div className="border-t pt-2 flex justify-between">
                            <span className="font-semibold text-[#3A3A3A]">
                              Total:
                            </span>
                            <span className="font-bold text-lg text-[#CC9F53]">
                              {formatCurrency(Number(pedido.total))}
                            </span>
                          </div>
                        </div>

                        {pedido.notasCliente && (
                          <div>
                            <p className="text-sm text-[#9A8C61] mb-1">
                              Notas del Cliente:
                            </p>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-[#3A3A3A] text-sm">
                                {pedido.notasCliente}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}{' '}
                {/* Productos Tab */}
                {activeTab === 'productos' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#3A3A3A]">
                      Productos del Pedido
                    </h3>
                    {pedido.detallePedidos &&
                    pedido.detallePedidos.length > 0 ? (
                      <>
                        <div className="space-y-3">
                          {pedido.detallePedidos.map((detalle, index) => (
                            <div
                              key={index}
                              className="border border-[#ecd8ab]/30 rounded-lg p-4 hover:bg-[#F5E6C6]/10 transition-colors"
                            >
                              <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                  {detalle.producto?.imagen ? (
                                    <Image
                                      src={detalle.producto.imagen}
                                      alt={detalle.producto.nombre}
                                      width={64}
                                      height={64}
                                      className="w-16 h-16 object-cover rounded-lg"
                                    />
                                  ) : (
                                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                      <Package className="h-8 w-8 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-[#3A3A3A] mb-1">
                                    {detalle.producto.nombre}
                                  </h4>
                                  <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                      <p className="text-[#9A8C61]">Cantidad</p>
                                      <p className="font-medium">
                                        {detalle.cantidad}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-[#9A8C61]">
                                        Precio Unitario
                                      </p>
                                      <p className="font-medium">
                                        {formatCurrency(Number(detalle.precioUnitario))}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-[#9A8C61]">Subtotal</p>
                                      <p className="font-medium text-[#CC9F53]">
                                        {formatCurrency(Number(detalle.subtotal))}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Total de productos */}
                        <div className="bg-[#F5E6C6]/20 rounded-lg p-4 mt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-[#3A3A3A]">
                              Total de Productos ({pedido.detallePedidos.length}{' '}
                              artículos):
                            </span>
                            <span className="text-xl font-bold text-[#CC9F53]">
                              {formatCurrency(Number(pedido.subtotal) || 0)}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">
                          No hay productos en este pedido
                        </p>
                      </div>
                    )}
                  </div>
                )}
                {/* Cliente Tab */}
                {activeTab === 'cliente' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-[#3A3A3A] mb-4">
                          Información del Cliente
                        </h3>

                        <div className="flex items-center space-x-3">
                          <User className="h-5 w-5 text-[#CC9F53]" />
                          <div>
                            <p className="text-sm text-[#9A8C61]">
                              Nombre Completo
                            </p>
                            <p className="font-medium text-[#3A3A3A]">
                              {pedido.usuario?.nombres}{' '}
                              {pedido.usuario?.apellidos}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <User className="h-5 w-5 text-[#CC9F53]" />
                          <div>
                            <p className="text-sm text-[#9A8C61]">Email</p>
                            <p className="font-medium text-[#3A3A3A]">
                              {pedido.usuario?.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-[#3A3A3A] mb-4">
                          Dirección de Entrega
                        </h3>

                        <div className="flex items-start space-x-3">
                          <MapPin className="h-5 w-5 text-[#CC9F53] mt-1" />
                          <div className="flex-1">
                            {pedido.direccion && (
                              <div className="bg-[#F5E6C6]/20 rounded-lg p-4">
                                <p className="font-medium text-[#3A3A3A] mb-1">
                                  {pedido.direccion.alias}
                                </p>
                                <p className="text-[#3A3A3A] mb-1">
                                  {pedido.direccion.direccion}
                                </p>
                                <p className="text-sm text-[#9A8C61]">
                                  {pedido.direccion.ciudad},{' '}
                                  {pedido.direccion.departamento}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Información Admin Tab */}
                {activeTab === 'admin' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-[#3A3A3A]">
                      Información Administrativa
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Notas Internas */}
                      <div className="md:col-span-2">
                        <div className="border border-[#ecd8ab]/30 rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <FileText className="h-5 w-5 text-[#CC9F53]" />
                            <h4 className="font-semibold text-[#3A3A3A]">
                              Notas Internas
                            </h4>
                          </div>
                          {pedido.notasInternas ? (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                              <p className="text-amber-800 text-sm whitespace-pre-wrap">
                                {pedido.notasInternas}
                              </p>
                            </div>
                          ) : (
                            <p className="text-[#9A8C61] text-sm italic">
                              No hay notas internas para este pedido
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Fechas Importantes */}
                      <div>
                        <div className="border border-[#ecd8ab]/30 rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <Calendar className="h-5 w-5 text-[#CC9F53]" />
                            <h4 className="font-semibold text-[#3A3A3A]">
                              Fechas Importantes
                            </h4>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm text-[#9A8C61]">
                                Fecha del Pedido:
                              </p>
                              <p className="font-medium text-[#3A3A3A]">
                                {formatDate(
                                  pedido.fechaPedido || pedido.creadoEn
                                )}
                              </p>
                            </div>
                            {pedido.fechaEntrega && (
                              <div>
                                <p className="text-sm text-[#9A8C61]">
                                  Fecha de Entrega:
                                </p>
                                <p className="font-medium text-[#3A3A3A]">
                                  {formatDate(pedido.fechaEntrega)}
                                </p>
                              </div>
                            )}
                            <div>
                              <p className="text-sm text-[#9A8C61]">
                                Última Actualización:
                              </p>
                              <p className="font-medium text-[#3A3A3A]">
                                {formatDate(pedido.actualizadoEn)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Información de Pagos */}
                      <div>
                        <div className="border border-[#ecd8ab]/30 rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <CreditCard className="h-5 w-5 text-[#CC9F53]" />
                            <h4 className="font-semibold text-[#3A3A3A]">
                              Estado de Pagos
                            </h4>
                          </div>
                          {pedido.pagos && pedido.pagos.length > 0 ? (
                            <div className="space-y-2">
                              {pedido.pagos.map((pago, index) => (
                                <div
                                  key={index}
                                  className="bg-[#F5E6C6]/20 rounded-lg p-3"
                                >
                                  <div className="flex justify-between items-start mb-1">
                                    <span className="text-sm font-medium text-[#3A3A3A]">
                                      {formatCurrency(pago.monto)}
                                    </span>
                                    <span
                                      className={`text-xs px-2 py-1 rounded-full ${
                                        pago.estado === 'COMPLETADO'
                                          ? 'bg-green-100 text-green-800'
                                          : pago.estado === 'FALLIDO'
                                          ? 'bg-red-100 text-red-800'
                                          : 'bg-yellow-100 text-yellow-800'
                                      }`}
                                    >
                                      {pago.estado}
                                    </span>
                                  </div>
                                  <p className="text-xs text-[#9A8C61]">
                                    {pago.metodoPago} • {pago.referencia}
                                  </p>
                                  <p className="text-xs text-[#9A8C61]">
                                    {formatDate(pago.creadoEn)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[#9A8C61] text-sm italic">
                              No hay información de pagos disponible
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Identificadores del Sistema */}
                      <div className="md:col-span-2">
                        <div className="border border-[#ecd8ab]/30 rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <AlertCircle className="h-5 w-5 text-[#CC9F53]" />
                            <h4 className="font-semibold text-[#3A3A3A]">
                              Identificadores del Sistema
                            </h4>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-[#9A8C61]">ID del Pedido:</p>
                              <p className="font-mono text-[#3A3A3A]">
                                #{pedido.id}
                              </p>
                            </div>
                            <div>
                              <p className="text-[#9A8C61]">ID del Usuario:</p>
                              <p className="font-mono text-[#3A3A3A]">
                                #{pedido.usuarioId}
                              </p>
                            </div>
                            <div>
                              <p className="text-[#9A8C61]">ID de Dirección:</p>
                              <p className="font-mono text-[#3A3A3A]">
                                #{pedido.direccionId}
                              </p>
                            </div>
                            <div>
                              <p className="text-[#9A8C61]">
                                Número de Pedido:
                              </p>
                              <p className="font-mono text-[#3A3A3A]">
                                {pedido.numero}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Historial Tab */}
                {activeTab === 'historial' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#3A3A3A]">
                      Historial del Pedido
                    </h3>
                    <div className="space-y-4">
                      <div className="border border-[#ecd8ab]/30 rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <Calendar className="h-5 w-5 text-[#CC9F53]" />
                          <div>
                            <p className="font-medium text-[#3A3A3A]">
                              Pedido Creado
                            </p>
                            <p className="text-sm text-[#9A8C61]">
                              {formatDate(pedido.creadoEn)}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-[#9A8C61] ml-8">
                          El pedido ha sido registrado en el sistema
                        </p>
                      </div>

                      <div className="border border-[#ecd8ab]/30 rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <Clock className="h-5 w-5 text-[#CC9F53]" />
                          <div>
                            <p className="font-medium text-[#3A3A3A]">
                              Última Actualización
                            </p>
                            <p className="text-sm text-[#9A8C61]">
                              {formatDate(pedido.actualizadoEn)}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-[#9A8C61] ml-8">
                          Estado actual:{' '}
                          {
                            EstadoPedidoLabels[
                              pedido.estado as keyof typeof EstadoPedidoLabels
                            ]
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <div className="flex justify-end">
              <Button
                onClick={onClose}
                variant="outline"
                className="text-[#9A8C61] border-[#E5E0C8] hover:bg-[#F5E6C6]/30"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPedidoDetailModal;
