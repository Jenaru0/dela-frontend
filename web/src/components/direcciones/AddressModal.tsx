import React, { useState, useEffect } from 'react';
import { DireccionCliente, CreateDireccionDto, UpdateDireccionDto } from '@/types/direcciones';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { X, MapPin, Home, Building, Map } from 'lucide-react';

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
    distrito: '',
    provincia: 'Lima',
    codigoPostal: '',
    referencia: '',
    predeterminada: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Llenar el formulario cuando se edita una dirección
  useEffect(() => {
    if (isEdit && direccion) {
      setFormData({
        alias: direccion.alias || '',
        direccion: direccion.direccion,
        distrito: direccion.distrito || '',
        provincia: direccion.provincia || 'Lima',
        codigoPostal: direccion.codigoPostal || '',
        referencia: direccion.referencia || '',
        predeterminada: direccion.predeterminada,
      });
    } else if (!isEdit) {
      setFormData({
        alias: '',
        direccion: '',
        distrito: '',
        provincia: 'Lima',
        codigoPostal: '',
        referencia: '',
        predeterminada: false,
      });
    }
  }, [isEdit, direccion]);

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

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      await onSave(formData);
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

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
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
            <Input
              type="text"
              value={formData.direccion}
              onChange={(e) => handleChange('direccion', e.target.value)}
              className={errors.direccion ? 'border-red-300 focus:border-red-500' : ''}
              placeholder="Ej: Av. Las Flores 123, San Isidro"
            />
            {errors.direccion && (
              <p className="text-red-500 text-xs">{errors.direccion}</p>
            )}
          </div>

          {/* Distrito y Provincia */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700 flex items-center">
                <Building className="h-4 w-4 mr-2 text-primary-600" />
                Distrito
              </label>
              <Input
                type="text"
                value={formData.distrito || ''}
                onChange={(e) => handleChange('distrito', e.target.value)}
                placeholder="Ej: San Isidro"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700 flex items-center">
                <Map className="h-4 w-4 mr-2 text-primary-600" />
                Provincia
              </label>
              <select
                value={formData.provincia || 'Lima'}
                onChange={(e) => handleChange('provincia', e.target.value)}
                className="flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
              >
                <option value="Lima">Lima</option>
                <option value="Callao">Callao</option>
                <option value="Arequipa">Arequipa</option>
                <option value="Cusco">Cusco</option>
                <option value="Trujillo">Trujillo</option>
                <option value="Chiclayo">Chiclayo</option>
                <option value="Piura">Piura</option>
                <option value="Iquitos">Iquitos</option>
                <option value="Huancayo">Huancayo</option>
                <option value="Tacna">Tacna</option>
              </select>
            </div>
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
