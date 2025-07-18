import React, { useState, useEffect } from 'react';
import { Usuario, UpdateUsuarioDto } from '@/types/usuarios';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { X, User, Mail, Phone } from 'lucide-react';

interface EditProfileModalProps {
  usuario: Usuario;
  isOpen: boolean;
  onClose: () => void;
  onSave: (datos: UpdateUsuarioDto) => Promise<void>;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  usuario,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<UpdateUsuarioDto>({
    nombres: usuario.nombres || '',
    apellidos: usuario.apellidos || '',
    email: usuario.email,
    celular: usuario.celular || '',
  });  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Actualizar formulario cuando cambien los datos del usuario
  useEffect(() => {
    console.log('Usuario en EditProfileModal:', usuario);
    setFormData({
      nombres: usuario.nombres || '',
      apellidos: usuario.apellidos || '',
      email: usuario.email,
      celular: usuario.celular || '',
    });
  }, [usuario]);

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
      
      if (!formData.email?.trim()) {
        newErrors.email = 'El email es requerido';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'El email no es válido';
      }

      // Validación de celular - debe ser exactamente 9 dígitos o estar vacío
      if (formData.celular && (formData.celular.length !== 9 || !formData.celular.startsWith('9'))) {
        newErrors.celular = 'El celular debe tener exactamente 9 dígitos y empezar con 9';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      setErrors({ general: 'Error al actualizar el perfil' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof UpdateUsuarioDto, value: string) => {
    // Validación especial para celular
    if (field === 'celular') {
      // Solo permitir números y máximo 9 dígitos
      const numericValue = value.replace(/\D/g, '').slice(0, 9);
      
      // Si hay algún valor y no empieza con 9, agregar 9 al inicio
      if (numericValue.length > 0 && !numericValue.startsWith('9')) {
        // Si el primer dígito no es 9, reemplazarlo con 9 o agregarlo
        const correctedValue = '9' + numericValue.slice(1);
        setFormData(prev => ({ ...prev, [field]: correctedValue.slice(0, 9) }));
      } else {
        setFormData(prev => ({ ...prev, [field]: numericValue }));
      }
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
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
          <h2 className="text-xl font-bold text-neutral-900">Editar Perfil</h2>
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

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 flex items-center">
              <Mail className="h-4 w-4 mr-2 text-primary-600" />
              Correo Electrónico
            </label>
            <Input
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              className={errors.email ? 'border-red-300 focus:border-red-500' : ''}
              placeholder="tu@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}
          </div>

          {/* Nombres */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 flex items-center">
              <User className="h-4 w-4 mr-2 text-primary-600" />
              Nombres
            </label>
            <Input
              type="text"
              value={formData.nombres || ''}
              onChange={(e) => handleChange('nombres', e.target.value)}
              placeholder="Tus nombres"
            />
          </div>

          {/* Apellidos */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 flex items-center">
              <User className="h-4 w-4 mr-2 text-primary-600" />
              Apellidos
            </label>
            <Input
              type="text"
              value={formData.apellidos || ''}
              onChange={(e) => handleChange('apellidos', e.target.value)}
              placeholder="Tus apellidos"
            />
          </div>

          {/* Celular */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 flex items-center">
              <Phone className="h-4 w-4 mr-2 text-primary-600" />
              Celular
            </label>
            <Input
              type="tel"
              value={formData.celular || ''}
              onChange={(e) => handleChange('celular', e.target.value)}
              placeholder="9XXXXXXXX"
              maxLength={9}
              className={errors.celular ? 'border-red-500' : ''}
            />
            {formData.celular && formData.celular.length < 9 && (
              <p className="text-sm text-red-600">El celular debe tener exactamente 9 dígitos</p>
            )}
            {errors.celular && (
              <p className="text-sm text-red-600">{errors.celular}</p>
            )}
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
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
