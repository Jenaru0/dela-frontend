'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { pedidosService, Pedido } from '@/services/pedidos.service';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { CheckCircle, XCircle, Package, Truck, MapPin, CreditCard, Calendar, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

export default function PedidoDetallePage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const pedidoId = params.id as string;
  const isSuccess = searchParams.get('success') === 'true';

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (!isAuthenticated) return; // Esperar a que termine de cargar

    const cargarPedido = async () => {
      try {
        setLoading(true);
        const response = await pedidosService.obtenerPorId(parseInt(pedidoId));
        setPedido(response.data);
        
        if (isSuccess) {
          toast.success('¡Pedido creado exitosamente!');
        }
      } catch (error: unknown) {
        console.error('Error al cargar pedido:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error al cargar el pedido';
        setError(errorMessage);
        toast.error('Error al cargar el pedido');
      } finally {
        setLoading(false);
      }
    };

    if (pedidoId) {
      cargarPedido();
    }
  }, [pedidoId, isAuthenticated, authLoading, router, isSuccess]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // El useEffect ya redirige
  }

  if (error || !pedido) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Error al cargar el pedido
          </h1>
          <p className="text-gray-600 mb-4">
            {error || 'No se pudo encontrar el pedido solicitado'}
          </p>
          <Button onClick={() => router.push('/pedidos')}>
            Volver a mis pedidos
          </Button>
        </div>
      </div>
    );
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE':
        return 'text-yellow-600 bg-yellow-100';
      case 'CONFIRMADO':
        return 'text-blue-600 bg-blue-100';
      case 'PROCESANDO':
        return 'text-purple-600 bg-purple-100';
      case 'ENVIADO':
        return 'text-indigo-600 bg-indigo-100';
      case 'ENTREGADO':
        return 'text-green-600 bg-green-100';
      case 'CANCELADO':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getEstadoPagoColor = (estado: string) => {
    switch (estado) {
      case 'COMPLETADO':
        return 'text-green-600 bg-green-100';
      case 'PENDIENTE':
        return 'text-yellow-600 bg-yellow-100';
      case 'RECHAZADO':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/pedidos')}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a mis pedidos
          </Button>

          {isSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-green-800">
                    ¡Pedido creado exitosamente!
                  </h3>
                  <p className="text-sm text-green-700 mt-1">
                    Tu pedido ha sido procesado y recibirás un email de confirmación.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Pedido #{pedido.numero}
              </h1>
              <p className="text-gray-600 mt-1">
                Realizado el {new Date(pedido.fechaPedido).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(pedido.estado)}`}>
                {pedido.estado}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Productos */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Productos ({pedido.detallePedidos.length})
              </h3>
              <div className="space-y-4">
                {pedido.detallePedidos.map((detalle) => (
                  <div key={detalle.id} className="flex items-center space-x-4 border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                      {detalle.producto.imagen ? (
                        <Image
                          src={detalle.producto.imagen}
                          alt={detalle.producto.nombre}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Package className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {detalle.producto.nombre}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Cantidad: {detalle.cantidad} x ${detalle.precioUnitario.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ${detalle.subtotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dirección de entrega */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                {pedido.metodoEnvio === 'DELIVERY' ? (
                  <Truck className="w-5 h-5 mr-2" />
                ) : (
                  <MapPin className="w-5 h-5 mr-2" />
                )}
                {pedido.metodoEnvio === 'DELIVERY' ? 'Dirección de Entrega' : 'Recojo en Tienda'}
              </h3>
              {pedido.metodoEnvio === 'DELIVERY' ? (
                <div className="text-gray-700">
                  <p className="font-medium">{pedido.direccion.alias}</p>
                  <p>{pedido.direccion.direccion}</p>
                  <p>{pedido.direccion.ciudad}, {pedido.direccion.departamento}</p>
                </div>
              ) : (
                <div className="text-gray-700">
                  <p>Tu pedido estará disponible para recojo en nuestra tienda.</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Te notificaremos cuando esté listo.
                  </p>
                </div>
              )}
            </div>

            {/* Información de pago */}
            {pedido.pagos && pedido.pagos.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Información de Pago
                </h3>
                {pedido.pagos.map((pago) => (
                  <div key={pago.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Método: {pago.metodoPago}</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEstadoPagoColor(pago.estado)}`}>
                        {pago.estado}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Monto: ${pago.monto.toFixed(2)}</p>
                      <p>Referencia: {pago.referencia}</p>
                      <p>Fecha: {new Date(pago.creadoEn).toLocaleDateString('es-ES')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Resumen del Pedido
              </h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${pedido.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Envío</span>
                  <span className="text-gray-900">
                    {pedido.envioMonto === 0 ? 'Gratis' : `$${pedido.envioMonto.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Impuestos</span>
                  <span className="text-gray-900">${pedido.impuestos.toFixed(2)}</span>
                </div>
                {pedido.descuentoMonto > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento</span>
                    <span>-${pedido.descuentoMonto.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-medium text-base">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">${pedido.total.toFixed(2)}</span>
                </div>
              </div>

              {pedido.fechaEntrega && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center text-blue-800">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Fecha de entrega estimada</span>
                  </div>
                  <p className="text-blue-700 text-sm mt-1">
                    {new Date(pedido.fechaEntrega).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}

              {pedido.notasCliente && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Notas del cliente
                  </h4>
                  <p className="text-sm text-gray-700">{pedido.notasCliente}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
