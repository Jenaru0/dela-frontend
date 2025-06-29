'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type AuthModalMode = 'login' | 'register';

interface AuthModalContextType {
  isOpen: boolean;
  mode: AuthModalMode;
  open: (mode?: AuthModalMode) => void;
  close: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const AuthModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthModalMode>('login');

  const open = (newMode: AuthModalMode = 'login') => {
    setMode(newMode);
    setIsOpen(true);
  };
  const close = () => setIsOpen(false);

  return (
    <AuthModalContext.Provider value={{ isOpen, mode, open, close }}>
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModalGlobal = () => {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error('useAuthModalGlobal debe usarse dentro de AuthModalProvider');
  return ctx;
};