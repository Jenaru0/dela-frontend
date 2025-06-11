'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import '@/styles/admin.css';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { usuario, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const isAdmin = usuario?.tipoUsuario === 'ADMIN';

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.push('/');
    }
  }, [isAuthenticated, isAdmin, isLoading, router]);

  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fffbe6] via-[#fffaf1] to-[#fff]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#CC9F53] mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-[#3A3A3A] mb-2">
              Verificando permisos...
            </h2>
            <p className="text-[#9A8C61]">
              Por favor espera mientras verificamos tu acceso
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // Access denied
  if (!isAuthenticated || !isAdmin) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fffbe6] via-[#fffaf1] to-[#fff]">
          <div className="text-center">
            <Shield className="h-16 w-16 text-[#CC9F53] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#3A3A3A] mb-2">
              Acceso Denegado
            </h2>
            <p className="text-[#9A8C61] mb-6">
              Solo los administradores pueden acceder a esta página
            </p>
            <Button 
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-[#CC9F53] to-[#b08a3c] hover:from-[#b08a3c] hover:to-[#9a7635] text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-300 shadow-lg"
            >
              Volver al Inicio
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#fffbe6] via-[#fffaf1] to-[#fff]">
        {/* Sidebar */}
        <AdminSidebar />
        
        {/* Contenido Principal - Con padding left para el sidebar de 256px en desktop */}
        <div className="min-h-screen transition-all duration-300 pl-0 lg:pl-64">
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminLayout;
