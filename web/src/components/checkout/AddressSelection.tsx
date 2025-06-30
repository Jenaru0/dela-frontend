'use client';

import { useState } from 'react';
import { DireccionCliente, CreateDireccionDto, UpdateDireccionDto } from '@/types/direcciones';
import { MetodoEnvio } from '@/types/enums';
import { Button } from '@/components/ui/Button';
import AddressModal from '@/components/direcciones/AddressModal';
import { direccionesService } from '@/services/direcciones.service';
import { MapPin, Plus, Truck } from 'lucide-react';

interface AddressSelectionProps {
  direcciones: DireccionCliente[];
  direccionSeleccionada: DireccionCliente | null;
  onSeleccionarDireccion: (direccion: DireccionCliente) => void;
  metodoEnvio: MetodoEnvio;
  onCambiarMetodoEnvio: (metodo: MetodoEnvio) => void;
  onContinuar: () => void;
}

export function AddressSelection({
  direcciones,
  direccionSeleccionada,
  onSeleccionarDireccion,
  metodoEnvio,
  onCambiarMetodoEnvio,
  onContinuar,
}: AddressSelectionProps) {
  const [mostrarModalDireccion, setMostrarModalDireccion] = useState(false);

  const manejarGuardarDireccion = async (datos: CreateDireccionDto | UpdateDireccionDto) => {
    try {
      await direccionesService.crearDireccion(datos as CreateDireccionDto);
      setMostrarModalDireccion(false);
      // Aquí deberías recargar las direcciones o manejar la actualización
      // Esto sería responsabilidad del componente padre
    } catch (error) {
      console.error('Error al guardar dirección:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Método de envío */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Método de Envío
        </h3>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="metodo-envio"
              value={MetodoEnvio.DELIVERY}
              checked={metodoEnvio === MetodoEnvio.DELIVERY}
              onChange={(e) => onCambiarMetodoEnvio(e.target.value as MetodoEnvio)}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <Truck className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">Delivery a domicilio</p>
              <p className="text-sm text-gray-600">2-3 días hábiles - S/15.00</p>
            </div>
          </label>
          
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="metodo-envio"
              value={MetodoEnvio.RECOJO_TIENDA}
              checked={metodoEnvio === MetodoEnvio.RECOJO_TIENDA}
              onChange={(e) => onCambiarMetodoEnvio(e.target.value as MetodoEnvio)}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <MapPin className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">Recojo en tienda</p>
              <p className="text-sm text-gray-600">Disponible en 2-3 días hábiles - Gratis</p>
            </div>
          </label>
        </div>
      </div>

      {/* Selección de dirección (solo si es delivery) */}
      {metodoEnvio === MetodoEnvio.DELIVERY && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Dirección de Entrega
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMostrarModalDireccion(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Dirección
            </Button>
          </div>

          {direcciones.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                No tienes direcciones guardadas
              </h4>
              <p className="text-gray-600 mb-4">
                Agrega una dirección para continuar con tu pedido
              </p>
              <Button onClick={() => setMostrarModalDireccion(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Dirección
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {direcciones.map((direccion) => (
                <label
                  key={direccion.id}
                  className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                    direccionSeleccionada?.id === direccion.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="direccion"
                    value={direccion.id}
                    checked={direccionSeleccionada?.id === direccion.id}
                    onChange={() => onSeleccionarDireccion(direccion)}
                    className="sr-only"
                  />
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 pt-1">
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          direccionSeleccionada?.id === direccion.id
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}
                      >
                        {direccionSeleccionada?.id === direccion.id && (
                          <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      {direccion.alias && (
                        <p className="font-medium text-gray-900">
                          {direccion.alias}
                          {direccion.predeterminada && (
                            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Por defecto
                            </span>
                          )}
                        </p>
                      )}
                      <p className="text-gray-700">{direccion.direccion}</p>
                      {direccion.distrito && (
                        <p className="text-sm text-gray-600">
                          {direccion.distrito}
                          {direccion.provincia && `, ${direccion.provincia}`}
                        </p>
                      )}
                      {direccion.referencia && (
                        <p className="text-sm text-gray-500 mt-1">
                          Referencia: {direccion.referencia}
                        </p>
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Botón continuar */}
      <div className="flex justify-end">
        <Button
          onClick={onContinuar}
          disabled={metodoEnvio === MetodoEnvio.DELIVERY && !direccionSeleccionada}
          size="lg"
        >
          Continuar al Pago
        </Button>
      </div>

      {/* Modal para nueva dirección */}
      {mostrarModalDireccion && (
        <AddressModal
          direccion={null}
          isOpen={mostrarModalDireccion}
          onClose={() => setMostrarModalDireccion(false)}
          onSave={manejarGuardarDireccion}
          isEdit={false}
        />
      )}
    </div>
  );
}
