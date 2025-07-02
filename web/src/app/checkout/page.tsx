'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CarContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { CheckoutSummary } from '@/components/checkout/CheckoutSummary';
import { AddressSelection } from '@/components/checkout/AddressSelection';
import { PaymentForm } from '@/components/checkout/PaymentForm';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { DireccionCliente } from '@/types/direcciones';
import { MetodoEnvio, MetodoPago } from '@/types/enums';
import { direccionesService } from '@/services/direcciones.service';
import { pedidosService, CreatePedidoDto } from '@/services/pedidos.service';
import { pagosService, CrearPagoDto, DatosTarjeta } from '@/services/pagos.service';
import { toast } from 'react-hot-toast';
import { scrollToTopInstant } from '@/lib/scroll';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart: carrito, clearCart: limpiarCarrito, isLoading: carritoLoading } = useCart();
  const { isAuthenticated, usuario, isLoading: authLoading } = useAuth();

  const [step, setStep] = useState<'address' | 'payment' | 'processing'>('address');
  const [direcciones, setDirecciones] = useState<DireccionCliente[]>([]);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState<DireccionCliente | null>(null);
  const [metodoEnvio, setMetodoEnvio] = useState<MetodoEnvio>(MetodoEnvio.DELIVERY);
  const [loading, setLoading] = useState(false);
  const [loadingDirecciones, setLoadingDirecciones] = useState(true);
  const [codigoPromocion, setCodigoPromocion] = useState<string>('');

  // Verificar autenticación - solo redirigir cuando termine de cargar
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/?showAuthModal=true&mode=login&redirect=/checkout');
      return;
    }
  }, [isAuthenticated, authLoading, router]);

  // Scroll al top cuando se monta la página
  useEffect(() => {
    // Scroll inmediato
    scrollToTopInstant();
    
    // Scroll adicional para asegurar que funcione
    const timeoutId = setTimeout(() => {
      scrollToTopInstant();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Verificar que haya productos en el carrito - solo si no está cargando
  useEffect(() => {
    // No hacer nada si estamos cargando o si es la primera carga
    if (carritoLoading || loadingDirecciones) return;
    
    // Solo redirigir si definitivamente no hay productos
    if (!carrito || carrito.length === 0) {
      router.push('/carrito');
      return;
    }
  }, [carrito, carritoLoading, loadingDirecciones, router]);

  // Cargar direcciones del usuario
  useEffect(() => {
    const cargarDirecciones = async () => {
      if (!isAuthenticated) return;

      try {
        setLoadingDirecciones(true);
        const response = await direccionesService.obtenerDirecciones();
        setDirecciones(response.data);
        
        // Seleccionar la dirección por defecto si existe
        const direccionPorDefecto = response.data.find(dir => dir.predeterminada);
        if (direccionPorDefecto) {
          setDireccionSeleccionada(direccionPorDefecto);
        }
      } catch (error) {
        console.error('Error al cargar direcciones:', error);
        toast.error('Error al cargar las direcciones');
      } finally {
        setLoadingDirecciones(false);
      }
    };

    cargarDirecciones();
  }, [isAuthenticated]);

  // Scroll al top cuando cambia el step del checkout
  useEffect(() => {
    if (step !== 'address') { // No hacer scroll en el primer render
      scrollToTopInstant();
    }
  }, [step]);

  const calcularTotales = () => {
    if (!carrito || carrito.length === 0) {
      return { subtotal: 0, envio: 0, impuestos: 0, total: 0 };
    }

    const subtotal = carrito.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const envio = metodoEnvio === MetodoEnvio.DELIVERY ? 15 : 0; // S/15 por delivery
    const impuestos = subtotal * 0.18; // 18% IGV (Impuesto General a las Ventas - Perú)
    const total = subtotal + envio + impuestos;

    return { subtotal, envio, impuestos, total };
  };

  const manejarContinuarAPago = () => {
    // Si es recojo en tienda, no necesitamos dirección específica
    if (metodoEnvio === MetodoEnvio.RECOJO_TIENDA) {
      setStep('payment');
      return;
    }
    
    // Para delivery sí necesitamos dirección
    if (!direccionSeleccionada) {
      toast.error('Por favor selecciona una dirección de entrega');
      return;
    }
    setStep('payment');
  };

  const manejarProcesarPago = async (metodoPago: MetodoPago, datosTarjeta?: DatosTarjeta) => {
    // Para delivery necesitamos dirección, para recojo en tienda no
    if (metodoEnvio === MetodoEnvio.DELIVERY && !direccionSeleccionada) {
      toast.error('Falta dirección de entrega');
      return;
    }
    
    if (!carrito || carrito.length === 0) {
      toast.error('Faltan productos en el carrito');
      return;
    }

    if (!usuario) {
      toast.error('Usuario no autenticado');
      return;
    }

    try {
      setStep('processing');
      setLoading(true);

      const totales = calcularTotales();

      // 1. Crear el pedido
      const datosPedido: CreatePedidoDto = {
        usuarioId: usuario.id,
        // Para recojo en tienda, usar null como direccionId
        direccionId: metodoEnvio === MetodoEnvio.RECOJO_TIENDA ? null : direccionSeleccionada?.id || null,
        detalles: carrito.map(item => ({
          productoId: parseInt(item.id),
          cantidad: item.quantity,
        })),
        metodoPago,
        metodoEnvio,
        promocionCodigo: codigoPromocion.trim() || undefined,
        notasCliente: '', // Podrías agregar un campo para esto
      };

      const responsePedido = await pedidosService.crear(datosPedido);
      
      if (!responsePedido) {
        throw new Error('No se recibió respuesta del servidor');
      }
      
      // Verificar si la respuesta tiene la estructura esperada { data: ... }
      let pedido: unknown;
      if ('data' in responsePedido && responsePedido.data) {
        pedido = responsePedido.data;
      } else if ('id' in responsePedido) {
        // Si la respuesta es directamente el pedido (sin wrapper)
        pedido = responsePedido;
      } else {
        console.error('Estructura de respuesta inesperada:', responsePedido);
        throw new Error('Estructura de respuesta del pedido no válida');
      }

      if (!pedido || typeof pedido !== 'object' || !('id' in pedido) || !(pedido as { id: unknown }).id) {
        throw new Error('El pedido no tiene ID válido');
      }

      const pedidoId = (pedido as { id: number }).id;

      // 2. Crear el pago
      const datosPago: CrearPagoDto = {
        pedidoId: pedidoId,
        monto: Math.round(totales.total * 100), // Convertir a centavos (entero)
        metodoPago,
        datosTarjeta,
      };

      const responsePago = await pagosService.crearPagoConTarjeta(datosPago);
      
      if (responsePago.data.estado === 'COMPLETADO') {
        // Limpiar carrito y redirigir a confirmación
        limpiarCarrito();
        toast.success('¡Pago procesado exitosamente!');
        router.push(`/pedidos/${pedidoId}?success=true`);
      } else {
        toast.error('El pago no pudo ser procesado. Intenta nuevamente.');
        setStep('payment');
      }
    } catch (error: unknown) {
      console.error('Error al procesar pago:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al procesar el pago';
      toast.error(errorMessage);
      setStep('payment');
    } finally {
      setLoading(false);
    }
  };

  const manejarVolver = () => {
    if (step === 'payment') {
      scrollToTopInstant();
      setStep('address');
    } else if (step === 'address') {
      scrollToTopInstant();
      router.push('/carrito');
    }
  };

  if (authLoading || carritoLoading || loadingDirecciones) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fffbe6] via-[#fffaf1] to-[#fff]">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return null; // El useEffect ya redirige
  }

  if (!carrito || carrito.length === 0) {
    return null; // El useEffect ya redirige
  }

  const totales = calcularTotales();

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#fffbe6] via-[#fffaf1] to-[#fff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={manejarVolver}
              className="mb-4 text-gray-600 hover:text-gray-900"
              disabled={step === 'processing'}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            
            <h1 className="text-3xl font-bold text-gray-900">
              {step === 'address' && 'Dirección de Entrega'}
              {step === 'payment' && 'Método de Pago'}
              {step === 'processing' && 'Procesando Pago...'}
            </h1>

            {/* Indicador de pasos */}
            <div className="flex items-center mt-4 space-x-4">
              <div className={`flex items-center ${step === 'address' ? 'text-blue-600' : step === 'payment' || step === 'processing' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium ${step === 'address' ? 'border-blue-600 bg-blue-600 text-white' : step === 'payment' || step === 'processing' ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300 text-gray-400'}`}>
                  1
                </div>
                <span className="ml-2 text-sm font-medium">Dirección</span>
              </div>
              
              <div className={`h-0.5 w-16 ${step === 'payment' || step === 'processing' ? 'bg-green-600' : 'bg-gray-300'}`} />
              
              <div className={`flex items-center ${step === 'payment' ? 'text-blue-600' : step === 'processing' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium ${step === 'payment' ? 'border-blue-600 bg-blue-600 text-white' : step === 'processing' ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300 text-gray-400'}`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium">Pago</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contenido principal */}
            <div className="lg:col-span-2">
              {step === 'address' && (
                <AddressSelection
                  direcciones={direcciones}
                  direccionSeleccionada={direccionSeleccionada}
                  onSeleccionarDireccion={setDireccionSeleccionada}
                  metodoEnvio={metodoEnvio}
                  onCambiarMetodoEnvio={setMetodoEnvio}
                  onContinuar={manejarContinuarAPago}
                />
              )}

              {step === 'payment' && (
                <PaymentForm
                  total={totales.total}
                  userEmail={usuario?.email || ''}
                  onProcesarPago={manejarProcesarPago}
                  loading={loading}
                />
              )}

              {step === 'processing' && (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <LoadingSpinner size="lg" className="mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Procesando tu pago...
                  </h3>
                  <p className="text-gray-600">
                    Por favor espera mientras confirmamos tu transacción.
                  </p>
                </div>
              )}
            </div>

            {/* Resumen del pedido */}
            <div className="lg:col-span-1">
              <CheckoutSummary
                items={carrito}
                totales={totales}
                direccionSeleccionada={direccionSeleccionada}
                metodoEnvio={metodoEnvio}
                codigoPromocion={codigoPromocion}
                onCodigoPromocionChange={setCodigoPromocion}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
