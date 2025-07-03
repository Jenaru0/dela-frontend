'use client';

import React, { useState, useEffect } from 'react';
import { useAuthModal } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { X, Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import Image from 'next/image';
import { InicioSesionDto, RegistroForm } from '@/types/auth';
import ForgotPasswordModal from './ForgotPasswordModal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'login' 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const { 
    mode, 
    setMode, 
    isLoading, 
    error, 
    handleLogin, 
    handleRegister 
  } = useAuthModal();
  // Sincronizar el modo inicial
  useEffect(() => {
    if (isOpen && initialMode) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode, setMode]);

  // Bloquear scroll del body cuando el modal esté abierto
  useEffect(() => {
    if (isOpen) {
      // Guardar el valor original del overflow
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      
      // Calcular el ancho de la scrollbar para evitar saltos
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Bloquear scroll y compensar el ancho de la scrollbar
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      
      // Cleanup function
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [isOpen]);

  // Estados para los formularios
  const [loginData, setLoginData] = useState<InicioSesionDto>({
    email: '',
    contrasena: '',
  });  const [registerData, setRegisterData] = useState<RegistroForm>({
    email: '',
    contrasena: '',
    confirmarContrasena: '',
    nombres: '',
    apellidos: '',
    celular: '', // Mantenemos el campo pero no lo mostramos
    tipoUsuario: 'CLIENTE',
  });

  const resetForm = () => {
    setLoginData({ email: '', contrasena: '' });    setRegisterData({
      email: '',
      contrasena: '',
      confirmarContrasena: '',
      nombres: '',
      apellidos: '',
      celular: '',
      tipoUsuario: 'CLIENTE',
    });
    setSuccess(null);
    setLocalError(null);
    setShowPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleModeChange = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setSuccess(null);
    setLocalError(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await handleLogin(loginData);
    if (success) {
      setSuccess('¡Bienvenido! Has iniciado sesión correctamente.');  
      setTimeout(() => {
        handleClose();
      }, 1500);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null); // Limpiar error anterior
    
    // Validar celular antes de enviar
    if (!registerData.celular || registerData.celular.length !== 9 || !registerData.celular.startsWith('9')) {
      setLocalError('El celular debe tener exactamente 9 dígitos y empezar con 9');
      return;
    }
    
    const success = await handleRegister(registerData);
    if (success) {
      setSuccess('¡Registro exitoso! Ya puedes iniciar sesión.');
      setTimeout(() => {
        setSuccess(null);
      }, 2000);
    }
  };

  if (!isOpen) return null;
  
  return (
    <>
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Enhanced Overlay */}
      <div 
        className="fixed inset-0 bg-gradient-to-br from-black/70 via-neutral-900/60 to-black/70 backdrop-blur-md transition-all duration-300"
        onClick={handleClose}
      />
      
      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform">
          {/* Modal content with refined styling */}
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
            </button>            {/* Header section with brand identity */}
            <div className="px-8 pt-8 pb-6 text-center border-b border-gray-100">
              {/* Brand logo */}
              <div className="mx-auto mb-4 relative h-16 w-16">
                <Image
                  src="https://dela.com.pe/img/lodo-dela-header.png"
                  alt="DELA Logo"
                  fill
                  className="object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/images/logo.svg';
                  }}
                />
              </div>
              
              <h2 className="text-2xl font-bold text-[#3A3A3A] mb-2">
                {mode === 'login' ? 'Bienvenido de vuelta' : 'Únete a DELA'}
              </h2>
              <p className="text-gray-600 text-sm">
                {mode === 'login' 
                  ? 'Ingresa a tu cuenta para continuar' 
                  : 'Crea tu cuenta y disfruta nuestros productos artesanales'
                }
              </p>
            </div>

            {/* Tab navigation */}
            <div className="flex bg-gray-50">
              <button
                onClick={() => handleModeChange('login')}
                className={`flex-1 py-4 px-6 text-sm font-semibold transition-all duration-200 relative ${
                  mode === 'login'
                    ? 'text-[#CC9F53] bg-white border-b-2 border-[#CC9F53]'
                    : 'text-gray-600 hover:text-[#CC9F53] hover:bg-gray-100'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => handleModeChange('register')}
                className={`flex-1 py-4 px-6 text-sm font-semibold transition-all duration-200 relative ${
                  mode === 'register'
                    ? 'text-[#CC9F53] bg-white border-b-2 border-[#CC9F53]'
                    : 'text-gray-600 hover:text-[#CC9F53] hover:bg-gray-100'
                }`}
              >
                Registrarse
              </button>
            </div>

            {/* Content section */}
            <div className="p-8">
              {/* Error/Success Messages */}
              {(error || localError) && (
                <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl shadow-sm">
                  <p className="text-red-700 text-sm font-medium">{error || localError}</p>
                </div>
              )}
              
              {success && (
                <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-sm">
                  <p className="text-green-700 text-sm font-medium">{success}</p>
                </div>
              )}

              {/* Login Form */}
              {mode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-[#3A3A3A]">
                      Correo Electrónico
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#CC9F53] transition-colors" />
                      <input
                        type="email"
                        required
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CC9F53]/20 focus:border-[#CC9F53] transition-all duration-200 hover:border-gray-300"
                        placeholder="tu@correo.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-[#3A3A3A]">
                      Contraseña
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#CC9F53] transition-colors" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={loginData.contrasena}
                        onChange={(e) => setLoginData({ ...loginData, contrasena: e.target.value })}
                        className="w-full pl-11 pr-12 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CC9F53]/20 focus:border-[#CC9F53] transition-all duration-200 hover:border-gray-300"
                        placeholder="Tu contraseña"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#CC9F53] transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full py-3.5 text-base font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
                  </Button>

                  {/* Forgot password link */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-[#CC9F53] hover:text-[#B88D42] font-medium transition-colors underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>

                  {/* Switch to register */}
                  <p className="text-center text-sm text-gray-600">
                    ¿No tienes cuenta?{' '}
                    <button
                      type="button"
                      onClick={() => handleModeChange('register')}
                      className="text-[#CC9F53] hover:text-[#B88D42] font-semibold transition-colors"
                    >
                      Regístrate aquí
                    </button>
                  </p>
                </form>
              )}

              {/* Register Form */}
              {mode === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-[#3A3A3A]">
                        Nombres
                      </label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#CC9F53] transition-colors" />
                        <input
                          type="text"
                          required
                          value={registerData.nombres}
                          onChange={(e) => setRegisterData({ ...registerData, nombres: e.target.value })}
                          className="w-full pl-10 pr-3 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CC9F53]/20 focus:border-[#CC9F53] transition-all duration-200 hover:border-gray-300"
                          placeholder="Nombres"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-[#3A3A3A]">
                        Apellidos
                      </label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#CC9F53] transition-colors" />
                        <input
                          type="text"
                          required
                          value={registerData.apellidos}
                          onChange={(e) => setRegisterData({ ...registerData, apellidos: e.target.value })}
                          className="w-full pl-10 pr-3 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CC9F53]/20 focus:border-[#CC9F53] transition-all duration-200 hover:border-gray-300"
                          placeholder="Apellidos"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-[#3A3A3A]">
                      Correo Electrónico
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#CC9F53] transition-colors" />
                      <input
                        type="email"
                        required
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CC9F53]/20 focus:border-[#CC9F53] transition-all duration-200 hover:border-gray-300"
                        placeholder="tu@correo.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-[#3A3A3A]">
                      Celular
                    </label>
                    <div className="relative group">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#CC9F53] transition-colors" />
                      <input
                        type="tel"
                        required
                        value={registerData.celular}
                        onChange={(e) => {
                          // Solo permitir números y máximo 9 dígitos, empezando con 9
                          const numericValue = e.target.value.replace(/\D/g, '').slice(0, 9);
                          let finalValue = numericValue;
                          
                          // Si hay algún valor y no empieza con 9, forzar que empiece con 9
                          if (numericValue.length > 0 && !numericValue.startsWith('9')) {
                            finalValue = '9' + numericValue.slice(1, 8);
                          }
                          
                          setRegisterData({ ...registerData, celular: finalValue });
                        }}
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CC9F53]/20 focus:border-[#CC9F53] transition-all duration-200 hover:border-gray-300"
                        placeholder="999999999"
                        maxLength={9}
                      />
                    </div>
                    {registerData.celular && registerData.celular.length < 9 && (
                      <p className="text-xs text-red-600">El celular debe tener exactamente 9 dígitos y empezar con 9</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-[#3A3A3A]">
                      Contraseña
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#CC9F53] transition-colors" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={registerData.contrasena}
                        onChange={(e) => setRegisterData({ ...registerData, contrasena: e.target.value })}
                        className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CC9F53]/20 focus:border-[#CC9F53] transition-all duration-200 hover:border-gray-300"
                        placeholder="Mínimo 6 caracteres"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#CC9F53] transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-[#3A3A3A]">
                      Confirmar Contraseña
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#CC9F53] transition-colors" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={registerData.confirmarContrasena}
                        onChange={(e) => setRegisterData({ ...registerData, confirmarContrasena: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CC9F53]/20 focus:border-[#CC9F53] transition-all duration-200 hover:border-gray-300"
                        placeholder="Confirma tu contraseña"
                      />
                    </div>
                    {registerData.contrasena && registerData.confirmarContrasena && registerData.contrasena !== registerData.confirmarContrasena && (
                      <p className="mt-2 text-sm text-red-600 font-medium">Las contraseñas no coinciden</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full py-3.5 text-base font-semibold mt-6"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creando Cuenta...' : 'Crear Cuenta'}
                  </Button>

                  {/* Switch to login */}
                  <p className="text-center text-sm text-gray-600">
                    ¿Ya tienes cuenta?{' '}
                    <button
                      type="button"
                      onClick={() => handleModeChange('login')}
                      className="text-[#CC9F53] hover:text-[#B88D42] font-semibold transition-colors"
                    >
                      Inicia sesión aquí
                    </button>
                  </p>
                </form>
              )}

              {/* Footer with terms */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-500 text-center leading-relaxed">
                  Al {mode === 'login' ? 'iniciar sesión' : 'registrarte'}, aceptas nuestros{' '}
                  <span className="text-[#CC9F53] hover:underline cursor-pointer">Términos de Uso</span>{' '}
                  y{' '}
                  <span className="text-[#CC9F53] hover:underline cursor-pointer">Política de Privacidad</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Forgot Password Modal */}
    <ForgotPasswordModal
      isOpen={showForgotPassword}
      onClose={() => setShowForgotPassword(false)}
      onSuccess={() => {
        setShowForgotPassword(false);
        setSuccess('Contraseña restablecida exitosamente. Ahora puedes iniciar sesión.');
      }}
    />
    </>
  );
};

export default AuthModal;