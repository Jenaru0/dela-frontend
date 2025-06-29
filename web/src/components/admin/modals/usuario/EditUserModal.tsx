import React, { useState, useEffect } from 'react';
import { Usuario, UpdateUsuarioDto } from '@/types/usuarios';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { X, User, Mail, Phone, Shield } from 'lucide-react';

interface EditUserModalProps {
  usuario: Usuario | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userId: number, datos: UpdateUsuarioDto) => Promise<void>;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  usuario,
  isOpen,
  onClose,
  onSave,
}) => {  const [formData, setFormData] = useState<UpdateUsuarioDto>({
    email: '',
    nombres: '',
    apellidos: '',
    celular: '',
    tipoUsuario: 'CLIENTE',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});  useEffect(() => {
    if (usuario) {
      setFormData({
        email: usuario.email,
        nombres: usuario.nombres || '',
        apellidos: usuario.apellidos || '',
        celular: usuario.celular || '',
        tipoUsuario: usuario.tipoUsuario,
      });
    }
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
    if (!usuario) return;
    
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

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      await onSave(usuario.id, formData);
      onClose();
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      setErrors({ general: 'Error al actualizar el usuario' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof UpdateUsuarioDto, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  if (!isOpen || !usuario) return null;
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
          <h2 className="text-xl font-bold text-neutral-900">Editar Usuario</h2>
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
              Correo Electrónico *
            </label>
            <Input
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              className={errors.email ? 'border-red-300 focus:border-red-500' : ''}
              placeholder="usuario@email.com"
              required
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
              placeholder="Nombres del usuario"
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
              placeholder="Apellidos del usuario"
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
              placeholder="+51 999 999 999"
            />
          </div>          {/* Tipo de Usuario */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 flex items-center">
              <Shield className="h-4 w-4 mr-2 text-primary-600" />
              Tipo de Usuario *
            </label>
            <select
              value={formData.tipoUsuario}
              onChange={(e) => handleChange('tipoUsuario', e.target.value as 'CLIENTE' | 'ADMIN')}
              className="flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
              required
            >
              <option value="CLIENTE">Cliente</option>
              <option value="ADMIN">Administrador</option>
            </select>
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

export default EditUserModal;
