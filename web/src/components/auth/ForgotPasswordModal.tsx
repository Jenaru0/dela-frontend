import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { X, Mail, Lock, Shield } from 'lucide-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type Step = 'email' | 'token' | 'password';

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  const resetForm = () => {
    setStep('email');
    setEmail('');
    setToken('');
    setNewPassword('');
    setConfirmPassword('');
    setError(null);
    setSuccess(null);
    setIsLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validar email
      if (!email.trim()) {
        throw new Error('El correo electrónico es requerido');
      }

      if (!/\S+@\S+\.\S+/.test(email)) {
        throw new Error('El correo electrónico no es válido');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/autenticacion/solicitar-recuperacion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al solicitar recuperación');
      }

      const data = await response.json();
      setSuccess(data.mensaje);
      setStep('token');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al solicitar recuperación';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validar token
      if (!token.trim()) {
        throw new Error('El código de verificación es requerido');
      }

      if (token.length !== 6) {
        throw new Error('El código debe tener 6 dígitos');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/autenticacion/validar-token-recuperacion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Token inválido');
      }

      const data = await response.json();
      if (data.valido) {
        setStep('password');
      } else {
        throw new Error(data.mensaje || 'Token inválido');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al validar token';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validaciones
      if (!newPassword.trim()) {
        throw new Error('La nueva contraseña es requerida');
      }

      if (newPassword.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      if (newPassword !== confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/autenticacion/restablecer-contrasena`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          nuevaContrasena: newPassword,
          confirmarContrasena: confirmPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al restablecer contraseña');
      }

      const data = await response.json();
      setSuccess(data.mensaje);
      
      // Cerrar modal después de un tiempo
      setTimeout(() => {
        handleClose();
        onSuccess?.();
      }, 2000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al restablecer contraseña';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-gradient-to-br from-black/70 via-neutral-900/60 to-black/70 backdrop-blur-md transition-all duration-300"
        onClick={handleClose}
      />
      
      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform">
          {/* Modal content */}
          <div 
            className="relative overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative header gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#CC9F53] via-[#D4C088] to-[#CC9F53]" />
            
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 z-10 rounded-full p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="px-8 pt-8 pb-6 text-center border-b border-gray-100">
              <div className="mx-auto mb-4 relative h-12 w-12">
                <div className="p-3 rounded-full bg-[#CC9F53]/10">
                  {step === 'email' && <Mail className="h-6 w-6 text-[#CC9F53]" />}
                  {step === 'token' && <Shield className="h-6 w-6 text-[#CC9F53]" />}
                  {step === 'password' && <Lock className="h-6 w-6 text-[#CC9F53]" />}
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-[#3A3A3A] mb-2">
                {step === 'email' && 'Recuperar Contraseña'}
                {step === 'token' && 'Verificar Código'}
                {step === 'password' && 'Nueva Contraseña'}
              </h2>
              
              <p className="text-gray-600 text-sm">
                {step === 'email' && 'Ingresa tu correo electrónico para recibir un código de verificación'}
                {step === 'token' && 'Ingresa el código de 6 dígitos que enviamos a tu correo'}
                {step === 'password' && 'Crea una nueva contraseña segura para tu cuenta'}
              </p>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Error/Success Messages */}
              {error && (
                <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl shadow-sm">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}
              
              {success && (
                <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-sm">
                  <p className="text-green-700 text-sm font-medium">{success}</p>
                </div>
              )}

              {/* Step 1: Email */}
              {step === 'email' && (
                <form onSubmit={handleEmailSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-[#3A3A3A]">
                      Correo Electrónico
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#CC9F53] transition-colors" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CC9F53]/20 focus:border-[#CC9F53] transition-all duration-200 hover:border-gray-300"
                        placeholder="tu@correo.com"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full py-3.5 text-base font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Enviando...' : 'Enviar Código'}
                  </Button>
                </form>
              )}

              {/* Step 2: Token */}
              {step === 'token' && (
                <form onSubmit={handleTokenSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-[#3A3A3A]">
                      Código de Verificación
                    </label>
                    <div className="relative group">
                      <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#CC9F53] transition-colors" />
                      <input
                        type="text"
                        required
                        value={token}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                          setToken(value);
                        }}
                        className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CC9F53]/20 focus:border-[#CC9F53] transition-all duration-200 hover:border-gray-300 text-center text-lg tracking-widest"
                        placeholder="123456"
                        maxLength={6}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      ¿No recibiste el código? Revisa tu carpeta de spam
                    </p>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep('email')}
                      className="flex-1"
                      disabled={isLoading}
                    >
                      Atrás
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isLoading || token.length !== 6}
                    >
                      {isLoading ? 'Validando...' : 'Verificar'}
                    </Button>
                  </div>
                </form>
              )}

              {/* Step 3: New Password */}
              {step === 'password' && (
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-[#3A3A3A]">
                        Nueva Contraseña
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#CC9F53] transition-colors" />
                        <input
                          type="password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CC9F53]/20 focus:border-[#CC9F53] transition-all duration-200 hover:border-gray-300"
                          placeholder="Mínimo 6 caracteres"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-[#3A3A3A]">
                        Confirmar Contraseña
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#CC9F53] transition-colors" />
                        <input
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CC9F53]/20 focus:border-[#CC9F53] transition-all duration-200 hover:border-gray-300"
                          placeholder="Confirma tu nueva contraseña"
                        />
                      </div>
                      {newPassword && confirmPassword && newPassword !== confirmPassword && (
                        <p className="text-xs text-red-600">Las contraseñas no coinciden</p>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep('token')}
                      className="flex-1"
                      disabled={isLoading}
                    >
                      Atrás
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isLoading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                    >
                      {isLoading ? 'Restableciendo...' : 'Restablecer'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
