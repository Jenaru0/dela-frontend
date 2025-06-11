'use client';
import AuthModal from './AuthModal';
import { useAuthModalGlobal } from '@/contexts/AuthModalContext';

const AuthModalMount = () => {
  const { isOpen, close, mode } = useAuthModalGlobal();
  return <AuthModal isOpen={isOpen} onClose={close} initialMode={mode} />;
};

export default AuthModalMount;