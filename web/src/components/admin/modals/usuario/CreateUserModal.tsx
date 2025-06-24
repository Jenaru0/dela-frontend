import React, { useState, useEffect } from 'react';
import { CreateUsuarioDto } from '@/types/usuarios';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { X, User, Mail, Phone, Shield, Lock, Eye, EyeOff } from 'lucide-react';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (datos: CreateUsuarioDto) => Promise<void>;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {  const [formData, setFormData] = useState<CreateUsuarioDto>({
    email: '',
    contrasena: '',
    nombres: '',
    apellidos: '',
    celular: '',
    tipoUsuario: 'CLIENTE', // Cliente por defecto
  });
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

    try {      // Validaciones básicas
      const newErrors: Record<string, string> = {};
      
      if (!formData.email?.trim()) {
        newErrors.email = 'El email es requerido';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'El email no es válido';
      }      if (!formData.contrasena?.trim()) {
        newErrors.contrasena = 'La contraseña es requerida';
      } else if (formData.contrasena.length < 6) {
        newErrors.contrasena = 'La contraseña debe tener al menos 6 caracteres';
      }

      if (!confirmarContrasena?.trim()) {
        newErrors.confirmarContrasena = 'La confirmación de contraseña es requerida';
      } else if (formData.contrasena !== confirmarContrasena) {
        newErrors.confirmarContrasena = 'Las contraseñas no coinciden';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      await onSave(formData);      // Reset form
      setFormData({
        email: '',
        contrasena: '',
        nombres: '',
        apellidos: '',
        celular: '',
        tipoUsuario: 'CLIENTE',
      });
      setConfirmarContrasena('');
      setShowPassword(false);
      setShowConfirmPassword(false);
      onClose();
    } catch (error) {
      console.error('Error al crear usuario:', error);
      setErrors({ general: 'Error al crear el usuario' });
    } finally {
      setIsLoading(false);
    }
  };
  const handleChange = (field: keyof CreateUsuarioDto, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleConfirmarContrasenaChange = (value: string) => {
    setConfirmarContrasena(value);
    if (errors.confirmarContrasena) {
      setErrors(prev => ({ ...prev, confirmarContrasena: '' }));
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
          <h2 className="text-xl font-bold text-neutral-900">Crear Usuario</h2>
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
          )}          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 flex items-center">
              <Mail className="h-4 w-4 mr-2 text-primary-600" />
              Correo Electrónico *
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={errors.email ? 'border-red-300 focus:border-red-500' : ''}
              placeholder="usuario@email.com"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}
          </div>          {/* Contraseña */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 flex items-center">
              <Lock className="h-4 w-4 mr-2 text-primary-600" />
              Contraseña *
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={formData.contrasena}
                onChange={(e) => handleChange('contrasena', e.target.value)}
                className={errors.contrasena ? 'border-red-300 focus:border-red-500 pr-10' : 'pr-10'}
                placeholder="Mínimo 6 caracteres"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-primary-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-neutral-400" />
                ) : (
                  <Eye className="h-4 w-4 text-neutral-400" />
                )}
              </button>
            </div>
            {errors.contrasena && (
              <p className="text-red-500 text-xs">{errors.contrasena}</p>
            )}
          </div>          {/* Confirmar Contraseña */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 flex items-center">
              <Lock className="h-4 w-4 mr-2 text-primary-600" />
              Confirmar Contraseña *
            </label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmarContrasena}
                onChange={(e) => handleConfirmarContrasenaChange(e.target.value)}
                className={errors.confirmarContrasena ? 'border-red-300 focus:border-red-500 pr-10' : 'pr-10'}
                placeholder="Repite la contraseña"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-primary-600 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-neutral-400" />
                ) : (
                  <Eye className="h-4 w-4 text-neutral-400" />
                )}
              </button>
            </div>
            {errors.confirmarContrasena && (
              <p className="text-red-500 text-xs">{errors.confirmarContrasena}</p>
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
              {isLoading ? 'Creando...' : 'Crear Usuario'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
