'use client';

import Image from 'next/image';
import { DireccionCliente } from '@/types/direcciones';
import { MetodoEnvio } from '@/types/enums';
import { CartItem } from '@/contexts/CarContext';

interface CheckoutSummaryProps {
  items: CartItem[];
  totales: {
    subtotal: number;
    envio: number;
    impuestos: number;
    total: number;
  };
  direccionSeleccionada: DireccionCliente | null;
  metodoEnvio: MetodoEnvio;
  codigoPromocion: string;
  onCodigoPromocionChange: (codigo: string) => void;
}

export function CheckoutSummary({
  items,
  totales,
  direccionSeleccionada,
  metodoEnvio,
  codigoPromocion,
  onCodigoPromocionChange,
}: CheckoutSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Resumen del Pedido
      </h3>

      {/* Items del carrito */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-3">
            <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-xs">Sin imagen</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {item.name}
              </p>
              <p className="text-sm text-gray-600">
                Cantidad: {item.quantity}
              </p>
            </div>
            <div className="text-sm font-medium text-gray-900">
              S/{(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Dirección seleccionada */}
      {direccionSeleccionada && (
        <div className="border-t pt-4 mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Dirección de Entrega
          </h4>
          <div className="text-sm text-gray-600">
            {direccionSeleccionada.alias && (
              <p className="font-medium">{direccionSeleccionada.alias}</p>
            )}
            <p>{direccionSeleccionada.direccion}</p>
            {direccionSeleccionada.distrito && (
              <p>{direccionSeleccionada.distrito}</p>
            )}
            {direccionSeleccionada.provincia && (
              <p>{direccionSeleccionada.provincia}</p>
            )}
          </div>
        </div>
      )}

      {/* Método de envío */}
      <div className="border-t pt-4 mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          Método de Envío
        </h4>
        <p className="text-sm text-gray-600">
          {metodoEnvio === MetodoEnvio.DELIVERY ? 'Delivery a domicilio' : 'Recojo en tienda'}
        </p>
      </div>

      {/* Código de promoción */}
      <div className="border-t pt-4 mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          Código de Promoción
        </h4>
        <div className="flex gap-2">
          <input
            type="text"
            value={codigoPromocion}
            onChange={(e) => onCodigoPromocionChange(e.target.value.toUpperCase())}
            placeholder="Ingresa tu código"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            maxLength={20}
          />
        </div>
        {codigoPromocion && (
          <p className="text-xs text-gray-500 mt-1">
            Código aplicado: <span className="font-medium text-green-600">{codigoPromocion}</span>
          </p>
        )}
      </div>

      {/* Totales */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900">S/{totales.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Envío</span>
          <span className="text-gray-900">
            {totales.envio === 0 ? 'Gratis' : `S/${totales.envio.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Impuestos</span>
          <span className="text-gray-900">S/{totales.impuestos.toFixed(2)}</span>
        </div>
        <div className="border-t pt-2 flex justify-between text-base font-medium">
          <span className="text-gray-900">Total</span>
          <span className="text-gray-900">S/{totales.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-6 text-xs text-gray-500">
        <p>• Los precios incluyen impuestos</p>
        <p>• El tiempo de entrega es de 2-3 días hábiles</p>
        <p>• Aceptamos todas las tarjetas de crédito principales</p>
      </div>
    </div>
  );
}
