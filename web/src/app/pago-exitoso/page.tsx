'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { CheckCircle, ShoppingBag, Home, CreditCard, MapPin, Package } from 'lucide-react';
import { pedidosService, Pedido } from '@/services/pedidos.service';
import { CardIcon } from '@/components/ui/CardIcon';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

// Función helper para formatear fechas
const formatearFecha = (fecha: string) => {
  const date = new Date(fecha);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

function PagoExitosoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pedidoId = searchParams.get('pedidoId');

  // Verificar autenticación
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
      return;
    }
  }, [isAuthenticated, authLoading, router]);

  // Cargar datos del pedido
  useEffect(() => {
    const cargarDatos = async () => {
      if (!pedidoId) {
        setError('No se especificó el pedido');
        setLoading(false);
        return;
      }

      try {
        console.log('📡 Cargando pedido con ID:', pedidoId);
        const response = await pedidosService.obtenerPorId(parseInt(pedidoId));
        console.log('✅ Respuesta del servicio:', response);
        
        // El backend puede devolver el formato {data: ...} o directamente el pedido
        const pedidoData = response.data || response;
        
        if (pedidoData && pedidoData.id) {
          setPedido(pedidoData);
          setError(null);
          console.log('✅ Pedido establecido correctamente:', pedidoData);
        } else {
          console.error('❌ Respuesta sin datos válidos:', response);
          setError('No se encontró información del pedido');
        }
      } catch (error) {
        console.error('❌ Error cargando datos del pedido:', error);
        
        if (error instanceof Error) {
          if (error.message.includes('401') || error.message.includes('unauthorized')) {
            setError('Debes iniciar sesión para ver esta información');
          } else if (error.message.includes('404') || error.message.includes('not found')) {
            setError('El pedido no fue encontrado');
          } else {
            setError('Error al cargar la información del pedido');
          }
        } else {
          setError('Error inesperado al cargar el pedido');
        }
        
        toast.error('Error al cargar la información del pedido');
      } finally {
        setLoading(false);
      }
    };

    if (pedidoId && !authLoading && isAuthenticated) {
      cargarDatos();
    } else if (!authLoading && !isAuthenticated) {
      console.log('❌ Usuario no autenticado');
      setError('Debes iniciar sesión para ver esta información');
      setLoading(false);
    } else if (!pedidoId && !authLoading) {
      console.log('❌ No hay pedidoId en la URL');
      setError('No se especificó el pedido');
      setLoading(false);
    }
  }, [pedidoId, authLoading, isAuthenticated]);

  const formatearEnvio = (metodoEnvio: string) => {
    return metodoEnvio === 'DELIVERY' ? 'Delivery a domicilio' : 'Recojo en tienda';
  };

  const calcularTiempoEstimado = (metodoEnvio: string) => {
    return metodoEnvio === 'DELIVERY' ? '1-2 días hábiles (lunes a sábado)' : '30-60 minutos';
  };

  const obtenerTituloTiempo = (metodoEnvio: string) => {
    return metodoEnvio === 'DELIVERY' ? 'Tiempo estimado de entrega' : 'Tiempo estimado de preparación';
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return null; // El useEffect ya está manejando la redirección
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (error || !pedido) {
    return (
      <Layout>
        <div className="max-w-md mx-auto mt-16 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h1 className="text-xl font-semibold text-red-800 mb-2">
              Error
            </h1>
            <p className="text-red-600 mb-4">
              {error || 'No se pudo cargar la información del pedido'}
            </p>
            <Button 
              onClick={() => router.push('/')}
              variant="outline"
            >
              Volver al inicio
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-10 bg-gradient-to-br from-[#fffbe6] via-[#fffaf1] to-[#fff]">
        <div className="max-w-4xl mx-auto px-4">
        {/* Header de éxito */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Pago realizado con éxito!
          </h1>
          <p className="text-gray-600">
            Tu pedido ha sido confirmado y será procesado pronto
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Información del pedido */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resumen del pedido */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Resumen del pedido
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Número de pedido</p>
                  <p className="font-semibold text-gray-900">{pedido.numero}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha del pedido</p>
                  <p className="font-semibold text-gray-900">
                    {formatearFecha(pedido.fechaPedido)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estado</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {pedido.estado || 'CONFIRMADO'}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{obtenerTituloTiempo(pedido.metodoEnvio || 'DELIVERY')}</p>
                  <p className="font-semibold text-gray-900">
                    {calcularTiempoEstimado(pedido.metodoEnvio || 'DELIVERY')}
                  </p>
                </div>
              </div>

              {/* Productos */}
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-900 mb-3">Productos</h3>
                <div className="space-y-3">
                  {(pedido.detallePedidos || []).map((detalle) => (
                    <div key={detalle.id} className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center relative">
                        {detalle.producto?.imagen ? (
                          <Image 
                            src={detalle.producto.imagen} 
                            alt={detalle.producto.nombre || 'Producto'}
                            fill
                            sizes="64px"
                            className="object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {detalle.producto?.nombre || 'Producto'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Cantidad: {detalle.cantidad || 1} × S/ {parseFloat(String(detalle.precioUnitario || 0)).toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          S/ {parseFloat(String(detalle.subtotal || 0)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Información de envío */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Información de envío
                </h2>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Método de envío</p>
                  <p className="font-semibold text-gray-900">
                    {formatearEnvio(pedido.metodoEnvio || 'DELIVERY')}
                  </p>
                </div>
                
                {pedido.direccion && (
                  <div>
                    <p className="text-sm text-gray-600">Dirección de entrega</p>
                    <p className="font-semibold text-gray-900">
                      {pedido.direccion.direccion}
                    </p>
                    <p className="text-gray-600">
                      {pedido.direccion.ciudad}, {pedido.direccion.departamento}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Información del pago */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Información del pago
                </h2>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Subtotal</p>
                  <p className="font-semibold text-gray-900">
                    S/ {parseFloat(String(pedido.subtotal || 0)).toFixed(2)}
                  </p>
                </div>
                
                {pedido.metodoEnvio === 'DELIVERY' && parseFloat(String(pedido.envioMonto || 0)) > 0 && (
                  <div>
                    <p className="text-sm text-gray-600">Envío</p>
                    <p className="font-semibold text-gray-900">
                      S/ {parseFloat(String(pedido.envioMonto || 0)).toFixed(2)}
                    </p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-gray-600">IGV (18%)</p>
                  <p className="font-semibold text-gray-900">
                    S/ {parseFloat(String(pedido.impuestos || 0)).toFixed(2)}
                  </p>
                </div>
                
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-600">Total pagado</p>
                  <p className="text-2xl font-bold text-green-600">
                    S/ {parseFloat(String(pedido.total || 0)).toFixed(2)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Método de pago</p>
                  <div className="flex items-center gap-3">
                    <CardIcon type={pedido.metodoPago} size="md" className="w-12 h-8" />
                    <div className="font-semibold text-gray-900">
                      {pedido.pagos && pedido.pagos.length > 0 && pedido.pagos[0].ultimosCuatroDigitos && (
                        <div className="text-sm text-gray-600 font-normal">
                          Terminada en ****{pedido.pagos[0].ultimosCuatroDigitos}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="pt-3 border-t">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✓ Pago confirmado
                  </span>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                ¿Qué sigue?
              </h3>
              
              <div className="space-y-3">
                <Button
                  onClick={() => router.push('/productos')}
                  className="w-full"
                  variant="outline"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Seguir comprando
                </Button>
                
                <Button
                  onClick={() => router.push('/')}
                  className="w-full"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Volver al inicio
                </Button>
              </div>
            </div>

            {/* Información adicional */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-semibold text-blue-900 mb-2">
                ¡Gracias por tu compra!
              </h3>
              <p className="text-sm text-blue-700">
                Recibirás un email de confirmación con todos los detalles de tu pedido. 
                Si tienes alguna pregunta, no dudes en contactarnos.
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </Layout>
  );
}

export default function PagoExitosoPage() {
  return (
    <Suspense fallback={
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    }>
      <PagoExitosoContent />
    </Suspense>
  );
}
