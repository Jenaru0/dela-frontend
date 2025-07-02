import React, { useState, useEffect } from 'react';
import { DireccionCliente, CreateDireccionDto, UpdateDireccionDto, DireccionValidada } from '@/types/direcciones';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { AddressAutocomplete } from './AddressAutocomplete';
import { InteractiveMap } from '@/components/ui/InteractiveMap';
import { X, MapPin, Home, Map } from 'lucide-react';

interface AddressModalProps {
  direccion: DireccionCliente | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (datos: CreateDireccionDto | UpdateDireccionDto) => Promise<void>;
  isEdit?: boolean;
}

const AddressModal: React.FC<AddressModalProps> = ({
  direccion,
  isOpen,
  onClose,
  onSave,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState<CreateDireccionDto>({
    alias: '',
    direccion: '',
    departamento: 'Lima',
    provincia: 'Lima',
    distrito: 'Lima',
    codigoPostal: '',
    referencia: '',
    predeterminada: false,
    latitud: undefined,
    longitud: undefined,
    validadaGps: false,
    mapTilerPlaceId: undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Llenar el formulario cuando se edita una dirección
  useEffect(() => {
    if (isEdit && direccion) {
      setFormData({
        alias: direccion.alias || '',
        direccion: direccion.direccion,
        departamento: direccion.departamento || 'Lima',
        provincia: direccion.provincia || 'Lima',
        distrito: direccion.distrito || 'Lima',
        codigoPostal: direccion.codigoPostal || '',
        referencia: direccion.referencia || '',
        predeterminada: direccion.predeterminada,
        latitud: direccion.latitud,
        longitud: direccion.longitud,
        validadaGps: direccion.validadaGps,
        mapTilerPlaceId: direccion.mapTilerPlaceId,
      });
    } else if (!isEdit) {
      setFormData({
        alias: '',
        direccion: '',
        departamento: 'Lima',
        provincia: 'Lima',
        distrito: 'Lima',
        codigoPostal: '',
        referencia: '',
        predeterminada: false,
        latitud: undefined,
        longitud: undefined,
        validadaGps: false,
        mapTilerPlaceId: undefined,
      });
    }
  }, [isEdit, direccion]);

  // Resetear formulario cuando se cierre el modal
  useEffect(() => {
    if (!isOpen) {
      // Limpiar formulario cuando el modal se cierre
      setFormData({
        alias: '',
        direccion: '',
        departamento: 'Lima',
        provincia: 'Lima',
        distrito: 'Lima',
        codigoPostal: '',
        referencia: '',
        predeterminada: false,
        latitud: undefined,
        longitud: undefined,
        validadaGps: false,
        mapTilerPlaceId: undefined,
      });
      
      // Limpiar errores
      setErrors({});
      setIsLoading(false);
    }
  }, [isOpen]);

  // Bloquear scroll del body cuando el modal esté abierto
  useEffect(() => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // Validaciones básicas
      const newErrors: Record<string, string> = {};
      
      if (!formData.direccion?.trim()) {
        newErrors.direccion = 'La dirección es requerida';
      }

      // Validar coordenadas si están presentes
      if (formData.latitud !== undefined) {
        const lat = Number(formData.latitud);
        if (isNaN(lat) || lat < -90 || lat > 90) {
          newErrors.latitud = 'Latitud inválida. Debe estar entre -90 y 90 grados.';
        }
      }

      if (formData.longitud !== undefined) {
        const lng = Number(formData.longitud);
        if (isNaN(lng) || lng < -180 || lng > 180) {
          newErrors.longitud = 'Longitud inválida. Debe estar entre -180 y 180 grados.';
        }
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      // Preparar datos finales con validación adicional
      const datosFinales = {
        ...formData,
        // Asegurar que las coordenadas sean números válidos o undefined
        latitud: formData.latitud !== undefined && formData.latitud !== null ? 
          parseFloat(String(formData.latitud)) : undefined,
        longitud: formData.longitud !== undefined && formData.longitud !== null ? 
          parseFloat(String(formData.longitud)) : undefined,
      };

      // Validación final: verificar que los números parseados sean válidos
      if (datosFinales.latitud !== undefined && (isNaN(datosFinales.latitud) || !isFinite(datosFinales.latitud))) {
        setErrors({ latitud: 'Error: La latitud no es un número válido' });
        return;
      }
      
      if (datosFinales.longitud !== undefined && (isNaN(datosFinales.longitud) || !isFinite(datosFinales.longitud))) {
        setErrors({ longitud: 'Error: La longitud no es un número válido' });
        return;
      }

      // Debug: Verificar los tipos y valores antes de enviar
      console.log('FormData original:', formData);
      console.log('Datos finales a enviar:', datosFinales);
      console.log('Tipo de latitud final:', typeof datosFinales.latitud, 'Valor:', datosFinales.latitud);
      console.log('Tipo de longitud final:', typeof datosFinales.longitud, 'Valor:', datosFinales.longitud);

      await onSave(datosFinales);
      onClose();
    } catch (error) {
      console.error('Error al guardar dirección:', error);
      setErrors({ general: 'Error al guardar la dirección' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof CreateDireccionDto, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Manejar cambio de ubicación desde el mapa interactivo
  const handleUbicacionCambiada = async (lat: number, lng: number, address?: string) => {
    // Validar que las coordenadas sean números válidos
    const latitudValida = Number(lat);
    const longitudValida = Number(lng);
    
    if (isNaN(latitudValida) || isNaN(longitudValida)) {
      console.error('Coordenadas inválidas recibidas del mapa:', { lat, lng });
      return;
    }

    // Actualizar inmediatamente las coordenadas para feedback visual
    setFormData(prev => ({
      ...prev,
      latitud: latitudValida,
      longitud: longitudValida,
      validadaGps: true,
    }));

    // Debounce la geocodificación inversa para evitar demasiadas llamadas
    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/geocoding/reverse?lat=${latitudValida}&lng=${longitudValida}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.data) {
            const direccionCompleta = data.data;
            
            // Actualizar todos los campos con los datos de geocodificación inversa
            setFormData(prev => ({
              ...prev,
              direccion: direccionCompleta.direccionCompleta || address || prev.direccion,
              departamento: direccionCompleta.departamento || prev.departamento,
              provincia: direccionCompleta.provincia || prev.provincia,
              distrito: direccionCompleta.distrito || prev.distrito,
              codigoPostal: direccionCompleta.codigoPostal || prev.codigoPostal,
              latitud: latitudValida,
              longitud: longitudValida,
              validadaGps: true,
              mapTilerPlaceId: direccionCompleta.mapTilerPlaceId,
            }));
          }
        }
      } catch (error) {
        console.error('Error en geocodificación inversa:', error);
        // Si hay error, al menos mantener las coordenadas actualizadas
        setFormData(prev => ({
          ...prev,
          latitud: latitudValida,
          longitud: longitudValida,
          validadaGps: true,
          ...(address && { direccion: address }),
        }));
      }
    }, 500); // Esperar 500ms antes de hacer geocodificación inversa

    // Cleanup del timeout si el componente se desmonta
    return () => clearTimeout(timeoutId);
  };

  const handleDireccionSeleccionada = (direccionValidada: DireccionValidada) => {
    setFormData(prev => ({
      ...prev,
      direccion: direccionValidada.direccionCompleta,
      departamento: direccionValidada.departamento,
      provincia: direccionValidada.provincia,
      distrito: direccionValidada.distrito,
      codigoPostal: direccionValidada.codigoPostal || prev.codigoPostal || '', // Actualizar código postal desde autocompletado
      latitud: Number(direccionValidada.latitud),
      longitud: Number(direccionValidada.longitud),
      validadaGps: direccionValidada.esValida,
      mapTilerPlaceId: direccionValidada.mapTilerPlaceId,
    }));
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-900">
            {isEdit ? 'Editar Dirección' : 'Nueva Dirección'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-neutral-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {errors.general}
            </div>
          )}

          {/* Alias */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 flex items-center">
              <Home className="h-4 w-4 mr-2 text-primary-600" />
              Alias (Casa, Trabajo, etc.)
            </label>
            <Input
              type="text"
              value={formData.alias || ''}
              onChange={(e) => handleChange('alias', e.target.value)}
              placeholder="Ej: Casa, Trabajo, Casa de mis padres"
            />
          </div>

          {/* Dirección */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-primary-600" />
              Dirección *
            </label>
            <AddressAutocomplete
              onDireccionSeleccionada={handleDireccionSeleccionada}
              placeholder="Buscar dirección..."
              initialValue={formData.direccion}
              className={errors.direccion ? 'border-red-300' : ''}
            />
            {errors.direccion && (
              <p className="text-red-500 text-xs">{errors.direccion}</p>
            )}
          </div>

          {/* Ubicación Geográfica y Mapa */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-neutral-800 flex items-center">
              <Map className="h-4 w-4 mr-2 text-primary-600" />
              Ubicación Geográfica
            </h4>
            
            {/* Mapa de ubicación - Mostrar siempre */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">
                📍 Vista del mapa
              </label>
              <InteractiveMap
                latitud={formData.latitud || -12.0463731} // Lima por defecto
                longitud={formData.longitud || -77.0427934}
                onLocationChange={handleUbicacionCambiada}
                className="w-full h-48 rounded-lg"
                allowDrag={true}
                showConfirmButton={false}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">
                  Departamento
                </label>
                <Input
                  type="text"
                  value={formData.departamento || 'Lima'}
                  readOnly
                  className="bg-gray-50 text-gray-700"
                  placeholder="Departamento"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">
                  Provincia
                </label>
                <Input
                  type="text"
                  value={formData.provincia || 'Lima'}
                  readOnly
                  className="bg-gray-50 text-gray-700"
                  placeholder="Provincia"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">
                  Distrito
                </label>
                <Input
                  type="text"
                  value={formData.distrito || 'Lima'}
                  readOnly
                  className="bg-gray-50 text-gray-700"
                  placeholder="Distrito"
                />
              </div>
            </div>

            {/* Coordenadas precisas */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3">
              <div className="text-xs text-neutral-600 space-y-1">
                <div><strong>Latitud:</strong> {(formData.latitud || -12.0463731).toFixed(6)}</div>
                <div><strong>Longitud:</strong> {(formData.longitud || -77.0427934).toFixed(6)}</div>
                {(!formData.latitud || !formData.longitud) && (
                  <div className="text-blue-600 mt-2">
                    💡 Busca una dirección o usa el botón de ubicación del mapa para obtener coordenadas precisas.
                  </div>
                )}
              </div>
            </div>
            
            {/* Mostrar errores de coordenadas */}
            {(errors.latitud || errors.longitud) && (
              <div className="space-y-1">
                {errors.latitud && (
                  <p className="text-red-500 text-xs">{errors.latitud}</p>
                )}
                {errors.longitud && (
                  <p className="text-red-500 text-xs">{errors.longitud}</p>
                )}
              </div>
            )}
          </div>

          {/* Código Postal */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">
              Código Postal
            </label>
            <Input
              type="text"
              value={formData.codigoPostal || ''}
              onChange={(e) => handleChange('codigoPostal', e.target.value)}
              placeholder="Ej: 15036"
              maxLength={5}
            />
          </div>

          {/* Referencia */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">
              Referencia
            </label>
            <Input
              type="text"
              value={formData.referencia || ''}
              onChange={(e) => handleChange('referencia', e.target.value)}
              placeholder="Ej: Frente al parque, edificio azul"
            />
          </div>

          {/* Predeterminada */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="predeterminada"
              checked={formData.predeterminada || false}
              onChange={(e) => handleChange('predeterminada', e.target.checked)}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="predeterminada" className="text-sm text-neutral-700">
              Establecer como dirección predeterminada
            </label>
          </div>

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
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;
