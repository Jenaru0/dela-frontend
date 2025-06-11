'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { InicioSesionDto, RegistroDto, RegistroForm } from '@/types/auth';

export function useAuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { iniciarSesion, registrar } = useAuth();

  const openModal = (initialMode: 'login' | 'register' = 'login') => {
    setMode(initialMode);
    setIsOpen(true);
    setError(null);
  };

  const closeModal = () => {
    setIsOpen(false);
    setError(null);
  };
  const handleLogin = async (data: InicioSesionDto) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await iniciarSesion(data);
      closeModal();
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };  const handleRegister = async (data: RegistroForm) => {
    setIsLoading(true);
    setError(null);

    // Solo lanza un error por vez, no ambos juntos
    if (!data.confirmarContrasena) {
      setError('La confirmación de contraseña es obligatoria.');
      setIsLoading(false);
      return false;
    } else if (data.contrasena !== data.confirmarContrasena) {
      setError('Las contraseñas no coinciden.');
      setIsLoading(false);
      return false;
    }

    // Solo enviar los campos requeridos por el backend
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmarContrasena, ...toSend } = data;

    try {
      await registrar(toSend as RegistroDto);
      setMode('login');
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al registrarse';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isOpen,
    mode,
    isLoading,
    error,
    openModal,
    closeModal,
    handleLogin,
    handleRegister,
    setMode,
  };
}

// Hook para verificar roles de usuario
export function useUserRole() {
  const { usuario } = useAuth();

  const isAdmin = () => usuario?.tipoUsuario === 'ADMIN';
  const isClient = () => usuario?.tipoUsuario === 'CLIENTE';
  
  return {
    isAdmin: isAdmin(),
    isClient: isClient(),
    userType: usuario?.tipoUsuario,
  };
}
