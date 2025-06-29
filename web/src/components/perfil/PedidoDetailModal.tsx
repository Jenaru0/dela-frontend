'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import {
  X,
  Package,
  Calendar,
  CreditCard,
  Truck,
  Star,
  Eye,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { Pedido, pedidosService } from '@/services/pedidos.service';
import {
  EstadoPedidoLabels,
  EstadoPedidoColors,
  MetodoPagoLabels,
  MetodoEnvioLabels,
} from '@/types/enums';

interface ProductoImagen {
  url: string;
  principal: boolean;
}

interface ProductoDetalle {
  imagen?: string;
  imagenes?: ProductoImagen[];
  nombre?: string;
}

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
  const [pedidoDetallado, setPedidoDetallado] = useState<Pedido | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar detalles completos del pedido cuando se abre el modal
  const loadPedidoDetails = useCallback(async () => {
    if (!pedido?.id) return;
    
    try {
      setIsLoading(true);
      setError(null);
      console.log('🔄 Cargando detalles del pedido:', pedido.id);
      
      const response = await pedidosService.obtenerPorId(pedido.id);
      console.log('✅ Detalles del pedido cargados (RESPONSE COMPLETA):', response);
      console.log('✅ Detalles del pedido DATA:', response.data);
      
      if (response.data) {
        setPedidoDetallado(response.data);
        console.log('🎯 Pedido detallado establecido:', response.data);
      } else {
        console.log('⚠️ No hay data en response, usando pedido original');
        setPedidoDetallado(pedido);
      }
    } catch (error) {
      console.error('❌ Error al cargar detalles del pedido:', error);
      setError('Error al cargar los detalles del pedido');
      // Usar los datos básicos del pedido como fallback
      console.log('🔄 Usando pedido original como fallback');
      setPedidoDetallado(pedido);
    } finally {
      setIsLoading(false);
    }
  }, [pedido]);

  useEffect(() => {
    if (isOpen && pedido) {
      loadPedidoDetails();
    } else {
      setPedidoDetallado(null);
    }
  }, [isOpen, pedido, loadPedidoDetails]);
  // Función para obtener la imagen principal del producto
  const getImagenPrincipal = (producto: ProductoDetalle | null | undefined): string => {
    console.log('🚨🚨🚨 NUEVA FUNCIÓN getImagenPrincipal EJECUTÁNDOSE 🚨🚨🚨');
    
    // Debug: mostrar la estructura del producto
    console.log('🔍 PRODUCTO COMPLETO:', producto);
    console.log('🔍 IMAGEN DIRECTA:', producto?.imagen);
    console.log('🔍 ARRAY IMAGENES:', producto?.imagenes);

    // PRIORIDAD 1: Si tiene un array de imágenes, buscar la principal ahí primero
    if (Array.isArray(producto?.imagenes) && producto.imagenes.length > 0) {
      console.log('📷 Analizando array de imágenes:', producto.imagenes);
      
      const principal = producto.imagenes.find((img: ProductoImagen) => img.principal);
      console.log('👑 Imagen marcada como principal:', principal);
      
      if (principal?.url) {
        // Si la imagen principal es una URL local que no existe, usar fallback
        if (principal.url.startsWith('/images/products/')) {
          console.log('❌ Imagen principal local detectada, usando fallback:', principal.url);
          return '/images/product-fallback.svg';
        }
        console.log('✅ USANDO IMAGEN PRINCIPAL (URL válida):', principal.url);
        return principal.url;
      }
      
      // Buscar la primera imagen del array que no sea local
      const primeraImagenValida = producto.imagenes.find(img => !img.url.startsWith('/images/products/'));
      if (primeraImagenValida?.url) {
        console.log('✅ Usando primera imagen válida del array:', primeraImagenValida.url);
        return primeraImagenValida.url;
      }
      
      console.log('❌ Todas las imágenes del array son locales, continuando...');
    }

    // PRIORIDAD 2: Si no hay imagen principal en el array, revisar imagen directa
    if (producto?.imagen && typeof producto.imagen === 'string') {
      console.log('📷 Revisando imagen directa como fallback:', producto.imagen);
      
      // Si la imagen es una URL local que no existe, usar fallback directamente
      if (producto.imagen.startsWith('/images/products/')) {
        console.log('❌ PROBLEMA: Imagen directa es local (imagen secundaria), usando fallback:', producto.imagen);
        return '/images/product-fallback.svg';
      }
      
      console.log('✅ Usando imagen directa (URL válida):', producto.imagen);
      return producto.imagen;
    }

    // Imagen por defecto
    console.log('🔄 Usando imagen por defecto');
    return '/images/product-fallback.svg';
  };

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

  // Usar pedidoDetallado si está disponible, sino el pedido básico
  const currentPedido = pedidoDetallado || pedido;
  
  // Debug: mostrar qué pedido se está usando
  console.log('🔍 PEDIDO ACTUAL SIENDO USADO:', {
    pedidoOriginal: pedido?.id,
    pedidoDetallado: pedidoDetallado?.id,
    currentPedido: currentPedido?.id,
    primerProducto: currentPedido?.detallePedidos?.[0]?.producto
  });

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
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#CC9F53] rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Pedido #{currentPedido.numero}
              </h2>
              <p className="text-xs text-gray-500">
                {new Date(currentPedido.creadoEn).toLocaleDateString('es-PE', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
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
            <div className="grid lg:grid-cols-3 gap-4">
              {/* Información del Pedido */}
              <div className="lg:col-span-2 space-y-4">
              {/* Estado Actual */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Package className="w-4 h-4 mr-2 text-[#CC9F53]" />
                    <h3 className="text-sm font-medium text-gray-700">
                      Estado del pedido
                    </h3>
                  </div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      EstadoPedidoColors[
                        currentPedido.estado as keyof typeof EstadoPedidoColors
                      ]
                    }`}
                  >
                    {
                      EstadoPedidoLabels[
                        currentPedido.estado as keyof typeof EstadoPedidoLabels
                      ]
                    }
                  </span>
                </div>
              </div>

              {/* Productos del Pedido */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-700 flex items-center">
                    <Package className="w-4 h-4 mr-2 text-[#CC9F53]" />
                    Productos ({currentPedido.detallePedidos?.length || 0})
                  </h3>
                </div>

                <div className="divide-y divide-gray-100">
                  {currentPedido.detallePedidos?.map((detalle, index) => (
                    <div
                      key={index}
                      className="p-4 hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {/* Imagen del producto más pequeña */}
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border">
                          <Image
                            src={getImagenPrincipal(detalle.producto)}
                            alt={detalle.producto?.nombre || 'Producto'}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.log(
                                'Error loading image:',
                                getImagenPrincipal(detalle.producto)
                              );
                              e.currentTarget.src =
                                '/images/product-fallback.svg';
                            }}
                          />
                        </div>

                        {/* Información del producto más compacta */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm mb-1 truncate">
                            {detalle.producto?.nombre ||
                              `Producto ID: ${detalle.productoId}`}
                          </h4>

                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>
                              <span className="font-medium">Cantidad:</span>{' '}
                              {detalle.cantidad}
                            </span>
                            <span>
                              <span className="font-medium">Precio:</span> S/{' '}
                              {Number(detalle.precioUnitario).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Subtotal compacto */}
                        <div className="text-right">
                          <div className="text-xs text-gray-500 mb-1">
                            Subtotal
                          </div>
                          <div className="text-lg font-semibold text-[#CC9F53]">
                            S/ {Number(detalle.subtotal).toFixed(2)}
                          </div>

                          {/* Botón de reseña más pequeño */}
                          {currentPedido.estado === 'ENTREGADO' && onCreateReview && (
                            <Button
                              size="sm"
                              className="bg-[#CC9F53] hover:bg-[#B8903D] text-white text-xs px-3 py-1 rounded mt-2 h-7"
                              onClick={() =>
                                onCreateReview(
                                  detalle.productoId,
                                  detalle.producto?.nombre || 'Producto'
                                )
                              }
                            >
                              <Star className="w-3 h-3 mr-1" />
                              Reseña
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Información de Envío y Pago */}
            <div className="space-y-4">
              {/* Resumen de Pago */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-4 py-3 border-b border-gray-100 bg-green-50">
                  <h3 className="text-sm font-medium text-gray-700 flex items-center">
                    <CreditCard className="w-4 h-4 mr-2 text-green-600" />
                    Resumen de Pago
                  </h3>
                </div>

                <div className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">
                        S/ {Number(currentPedido.subtotal).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Envío</span>
                      <span className="font-medium">
                        S/ {Number(currentPedido.envioMonto || 0).toFixed(2)}
                      </span>
                    </div>
                    {currentPedido.descuentoMonto &&
                      Number(currentPedido.descuentoMonto) > 0 && (
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Descuento</span>
                          <span className="font-medium text-green-600">
                            -S/ {Number(currentPedido.descuentoMonto).toFixed(2)}
                          </span>
                        </div>
                      )}
                    <div className="border-t border-gray-200 pt-2 flex justify-between">
                      <span className="font-semibold text-gray-900 text-sm">
                        Total
                      </span>
                      <span className="font-bold text-green-600">
                        S/ {Number(currentPedido.total).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-600 mb-1">
                      Método de pago
                    </div>
                    <p className="font-medium text-gray-900 text-sm">
                      {
                        MetodoPagoLabels[
                          currentPedido.metodoPago as keyof typeof MetodoPagoLabels
                        ]
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Información de Envío */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-4 py-3 border-b border-gray-100 bg-orange-50">
                  <h3 className="text-sm font-medium text-gray-700 flex items-center">
                    <Truck className="w-4 h-4 mr-2 text-orange-600" />
                    Información de Envío
                  </h3>
                </div>

                <div className="p-4">
                  <div className="mb-3">
                    <div className="text-xs text-gray-600 mb-1">
                      Método de envío
                    </div>
                    <p className="font-medium text-gray-900 text-sm">
                      {
                        MetodoEnvioLabels[
                          currentPedido.metodoEnvio as keyof typeof MetodoEnvioLabels
                        ]
                      }
                    </p>
                  </div>

                  {currentPedido.direccion && (
                    <div>
                      <div className="text-xs text-gray-600 mb-2">
                        Dirección de envío
                      </div>
                      <div className="bg-gray-50 rounded p-3 text-xs">
                        <p className="font-medium text-gray-900 mb-1">
                          {currentPedido.direccion.direccion}
                        </p>
                        <p className="text-gray-600">
                          {currentPedido.direccion.ciudad},{' '}
                          {currentPedido.direccion.departamento}
                        </p>
                        <span className="inline-block bg-white px-2 py-1 rounded border text-gray-800 font-medium mt-1">
                          {currentPedido.direccion.alias}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Fechas Importantes */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-4 py-3 border-b border-gray-100 bg-blue-50">
                  <h3 className="text-sm font-medium text-gray-700 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                    Fechas Importantes
                  </h3>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">
                      Pedido realizado
                    </div>
                    <p className="font-medium text-gray-900 text-xs">
                      {new Date(
                        currentPedido.fechaPedido || currentPedido.creadoEn
                      ).toLocaleDateString('es-PE', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {currentPedido.fechaEntrega && (
                    <div>
                      <div className="text-xs text-gray-600 mb-1">
                        Fecha de entrega
                      </div>
                      <p className="font-medium text-gray-900 text-xs">
                        {new Date(currentPedido.fechaEntrega).toLocaleDateString(
                          'es-PE',
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          }
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {currentPedido.estado !== 'PENDIENTE' && onCreateClaim && (
                <Button
                  variant="outline"
                  className="text-orange-600 border-orange-300 hover:bg-orange-50 text-sm px-3 py-2 h-8"
                  onClick={() => onCreateClaim(currentPedido.id, currentPedido.numero)}
                >
                  <MessageSquare className="w-3 h-3 mr-1" />
                  Crear Reclamo
                </Button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {currentPedido.estado === 'ENTREGADO' && (
                <Button
                  className="bg-[#CC9F53] hover:bg-[#B8903D] text-white text-sm px-3 py-2 h-8"
                  onClick={() => {
                    console.log('Descargar factura del pedido:', currentPedido.id);
                  }}
                >
                  <Eye className="w-3 h-3 mr-1" />
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
