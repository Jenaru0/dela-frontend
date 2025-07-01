'use client';

import { useState, useEffect } from 'react';
import { MetodoPago } from '@/types/enums';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { CardTypeIndicator } from '@/components/ui/CardIcon';
import { pagosService, TipoIdentificacion, DatosTarjeta } from '@/services/pagos.service';
import { CreditCard, Lock, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PaymentFormProps {
  total: number;
  userEmail: string;
  onProcesarPago: (metodoPago: MetodoPago, datosTarjeta?: DatosTarjeta) => void;
  loading: boolean;
}

export function PaymentForm({ total, userEmail, onProcesarPago, loading }: PaymentFormProps) {
  const [tiposIdentificacion, setTiposIdentificacion] = useState<TipoIdentificacion[]>([]);
  const [metodoPagoDetectado, setMetodoPagoDetectado] = useState<MetodoPago | null>(null);
  const [loadingMetodos, setLoadingMetodos] = useState(true);
  
  // Estados del formulario
  const [datosTarjeta, setDatosTarjeta] = useState<DatosTarjeta>({
    numeroTarjeta: '',
    fechaExpiracion: '',
    codigoSeguridad: '',
    nombreTitular: '',
    tipoDocumento: '',
    numeroDocumento: '',
    email: userEmail, // Usar el email del usuario autenticado
  });

  const [errores, setErrores] = useState<Record<string, string>>({});

  // Función para detectar el tipo de tarjeta por el número
  const detectarTipoTarjeta = (numeroTarjeta: string): MetodoPago | null => {
    const numero = numeroTarjeta.replace(/\s/g, '');
    
    // Visa: empieza con 4
    if (/^4/.test(numero)) {
      return MetodoPago.visa;
    }
    
    // MasterCard: 
    // - Rangos clásicos: 5000-5999 (50-59) - ampliado para incluir 50
    // - Nuevos rangos: 2221-2720
    if (/^5[0-9]/.test(numero) || /^2(22[1-9]|2[3-9][0-9]|[3-6][0-9]{2}|7[0-1][0-9]|720)/.test(numero)) {
      return MetodoPago.master;
    }
    
    // American Express: empieza con 34 o 37
    if (/^3[47]/.test(numero)) {
      return MetodoPago.amex;
    }
    
    return null;
  };

  // Función para verificar si es una tarjeta de prueba oficial
  const esTargetapruebaOficial = (numeroTarjeta: string): boolean => {
    const numero = numeroTarjeta.replace(/\s/g, '');
    const firstSixDigits = numero.slice(0, 6);
    
    const targetsaspruebaOficiales = [
      '503175', // Mastercard: 5031 7557 3453 0604
      '400917', // Visa: 4009 1753 3280 6176
      '371180', // American Express: 3711 803032 57522
      '517878', // Mastercard débito: 5178 7816 2220 2455
    ];

    return targetsaspruebaOficiales.includes(firstSixDigits);
  };

  // Cargar tipos de identificación al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoadingMetodos(true);
        const tiposIdRes = await pagosService.obtenerTiposIdentificacion();
        
        setTiposIdentificacion(tiposIdRes.data);
      } catch (error) {
        console.error('Error al cargar datos de pago:', error);
        toast.error('Error al cargar los métodos de pago');
      } finally {
        setLoadingMetodos(false);
      }
    };

    cargarDatos();
  }, []);

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!datosTarjeta.numeroTarjeta.trim()) {
      nuevosErrores.numeroTarjeta = 'El número de tarjeta es requerido';
    } else if (!/^\d{13,19}$/.test(datosTarjeta.numeroTarjeta.replace(/\s/g, ''))) {
      nuevosErrores.numeroTarjeta = 'Número de tarjeta inválido';
    } else if (!metodoPagoDetectado) {
      nuevosErrores.numeroTarjeta = 'Tipo de tarjeta no soportado. Solo aceptamos Visa, MasterCard y American Express';
    } else if (process.env.NODE_ENV === 'development' && !esTargetapruebaOficial(datosTarjeta.numeroTarjeta)) {
      const numero = datosTarjeta.numeroTarjeta.replace(/\s/g, '');
      const firstSix = numero.slice(0, 6);
      nuevosErrores.numeroTarjeta = `❌ Tarjeta ${firstSix}... no es de prueba oficial. Use los botones de arriba o las tarjetas listadas en la guía.`;
    }

    if (!datosTarjeta.fechaExpiracion.trim()) {
      nuevosErrores.fechaExpiracion = 'La fecha de expiración es requerida';
    } else {
      const validacionFecha = validarFechaExpiracion(datosTarjeta.fechaExpiracion);
      if (!validacionFecha.esValida) {
        nuevosErrores.fechaExpiracion = validacionFecha.mensaje || 'Fecha de expiración inválida';
      }
    }

    if (!datosTarjeta.codigoSeguridad.trim()) {
      nuevosErrores.codigoSeguridad = 'El código de seguridad es requerido';
    } else if (!/^\d{3,4}$/.test(datosTarjeta.codigoSeguridad)) {
      nuevosErrores.codigoSeguridad = 'Código de seguridad inválido';
    }

    if (!datosTarjeta.nombreTitular.trim()) {
      nuevosErrores.nombreTitular = 'El nombre del titular es requerido';
    }

    if (!datosTarjeta.tipoDocumento) {
      nuevosErrores.tipoDocumento = 'Selecciona el tipo de documento';
    }

    if (!datosTarjeta.numeroDocumento.trim()) {
      nuevosErrores.numeroDocumento = 'El número de documento es requerido';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarCambio = (campo: keyof DatosTarjeta, valor: string) => {
    setDatosTarjeta(prev => ({ ...prev, [campo]: valor }));
    
    // Si se está cambiando el número de tarjeta, detectar automáticamente el tipo
    if (campo === 'numeroTarjeta') {
      const tipoDetectado = detectarTipoTarjeta(valor);
      setMetodoPagoDetectado(tipoDetectado);
    }
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errores[campo]) {
      setErrores(prev => ({ ...prev, [campo]: '' }));
    }
  };

  const formatearNumeroTarjeta = (valor: string) => {
    const numeroLimpio = valor.replace(/\D/g, '');
    const grupos = numeroLimpio.match(/.{1,4}/g);
    return grupos ? grupos.join(' ') : numeroLimpio;
  };

  const formatearFechaExpiracion = (valor: string) => {
    const numeroLimpio = valor.replace(/\D/g, '');
    if (numeroLimpio.length >= 2) {
      return `${numeroLimpio.slice(0, 2)}/${numeroLimpio.slice(2, 4)}`;
    }
    return numeroLimpio;
  };

  // Función para validar y convertir fecha de expiración
  const validarFechaExpiracion = (fechaStr: string): { esValida: boolean; mensaje?: string } => {
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(fechaStr)) {
      return { esValida: false, mensaje: 'Formato inválido (MM/YY)' };
    }

    const [mes, año] = fechaStr.split('/');
    const mesNum = parseInt(mes, 10);
    let añoNum = parseInt(año, 10);

    // Convertir YY a YYYY
    // Si el año es menor que 50, asumimos que es 20XX, sino 19XX
    // Pero para tarjetas de crédito, nunca debería ser 19XX
    if (añoNum < 50) {
      añoNum = 2000 + añoNum;
    } else if (añoNum < 100) {
      añoNum = 2000 + añoNum; // Para tarjetas, siempre 20XX
    }

    const fechaActual = new Date();
    const añoActual = fechaActual.getFullYear();
    const mesActual = fechaActual.getMonth() + 1;

    // Validar que la fecha no sea en el pasado
    if (añoNum < añoActual || (añoNum === añoActual && mesNum < mesActual)) {
      return { esValida: false, mensaje: 'La tarjeta ha expirado' };
    }

    // Validar que no sea demasiado en el futuro (más de 20 años)
    if (añoNum > añoActual + 20) {
      return { esValida: false, mensaje: 'Fecha de expiración muy lejana' };
    }

    return { esValida: true };
  };

  const manejarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    if (!metodoPagoDetectado) {
      toast.error('No se pudo detectar el tipo de tarjeta');
      return;
    }

    onProcesarPago(metodoPagoDetectado, datosTarjeta);
  };

  if (loadingMetodos) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-gray-600">Cargando métodos de pago...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">
        Información de Pago
      </h3>

      <form onSubmit={manejarSubmit} className="space-y-6">
        {/* Indicador profesional del tipo de tarjeta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Información de Pago
          </label>
          <CardTypeIndicator 
            detectedType={metodoPagoDetectado}
            className="mb-4"
          />
        </div>

        {/* Información de la tarjeta */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700 flex items-center">
            <CreditCard className="w-4 h-4 mr-2" />
            Información de la Tarjeta
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Número de tarjeta */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Tarjeta
              </label>
              <Input
                type="text"
                value={datosTarjeta.numeroTarjeta}
                onChange={(e) => manejarCambio('numeroTarjeta', formatearNumeroTarjeta(e.target.value))}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className={errores.numeroTarjeta ? 'border-red-500' : ''}
              />
              {errores.numeroTarjeta && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errores.numeroTarjeta}
                </p>
              )}
            </div>

            {/* Fecha de expiración */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Expiración
              </label>
              <Input
                type="text"
                value={datosTarjeta.fechaExpiracion}
                onChange={(e) => manejarCambio('fechaExpiracion', formatearFechaExpiracion(e.target.value))}
                placeholder="MM/YY"
                maxLength={5}
                className={errores.fechaExpiracion ? 'border-red-500' : ''}
              />
              {errores.fechaExpiracion && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errores.fechaExpiracion}
                </p>
              )}
            </div>

            {/* Código de seguridad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código de Seguridad
              </label>
              <Input
                type="text"
                value={datosTarjeta.codigoSeguridad}
                onChange={(e) => manejarCambio('codigoSeguridad', e.target.value.replace(/\D/g, ''))}
                placeholder="123"
                maxLength={4}
                className={errores.codigoSeguridad ? 'border-red-500' : ''}
              />
              {errores.codigoSeguridad && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errores.codigoSeguridad}
                </p>
              )}
            </div>

            {/* Nombre del titular */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Titular
              </label>
              <Input
                type="text"
                value={datosTarjeta.nombreTitular}
                onChange={(e) => manejarCambio('nombreTitular', e.target.value)}
                placeholder="Nombre completo como aparece en la tarjeta"
                className={errores.nombreTitular ? 'border-red-500' : ''}
              />
              {errores.nombreTitular && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errores.nombreTitular}
                </p>
              )}
            </div>

            {/* Tipo de documento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Documento
              </label>
              <select
                value={datosTarjeta.tipoDocumento}
                onChange={(e) => manejarCambio('tipoDocumento', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errores.tipoDocumento ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar</option>
                {tiposIdentificacion.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.name}
                  </option>
                ))}
              </select>
              {errores.tipoDocumento && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errores.tipoDocumento}
                </p>
              )}
            </div>

            {/* Número de documento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Documento
              </label>
              <Input
                type="text"
                value={datosTarjeta.numeroDocumento}
                onChange={(e) => manejarCambio('numeroDocumento', e.target.value)}
                placeholder="Número de documento"
                className={errores.numeroDocumento ? 'border-red-500' : ''}
              />
              {errores.numeroDocumento && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errores.numeroDocumento}
                </p>
              )}
            </div>

          </div>
        </div>

        {/* Información adicional sobre el email */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-700">
            <strong>Email:</strong> Se usará tu email registrado ({userEmail}) para el procesamiento del pago
          </p>
        </div>

        {/* Resumen del total */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center text-lg font-medium">
            <span>Total a pagar:</span>
            <span className="text-blue-600">S/{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Información de seguridad */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Lock className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Transacción Segura
              </h4>
              <p className="text-xs text-gray-600 mt-1">
                Tus datos están protegidos con encriptación SSL y son procesados
                de forma segura por MercadoPago.
              </p>
            </div>
          </div>
        </div>

        {/* Botón de envío */}
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={loading}
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Procesando Pago...
            </>
          ) : (
            `Pagar S/${total.toFixed(2)}`
          )}
        </Button>
      </form>
    </div>
  );
}
