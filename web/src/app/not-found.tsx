import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import BackButton from '@/components/ui/BackButton';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-screen py-20 bg-gradient-to-br from-[#fffbe6] via-[#fffaf1] to-[#fff]">
        <div className="max-w-2xl mx-auto px-4 text-center">
          {/* Número 404 grande */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-[#CC9F53] mb-4 tracking-tight">
              404
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-[#CC9F53] to-[#b08a3c] mx-auto rounded-full"></div>
          </div>

          {/* Mensaje principal */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#3A3A3A] mb-4">
              ¡Ups! Página no encontrada
            </h2>
            <p className="text-lg text-gray-600 mb-2">
              La página que estás buscando no existe o ha sido movida.
            </p>
            <p className="text-gray-500">
              Puede que el enlace esté roto o que hayas escrito mal la URL.
            </p>
          </div>

          {/* Ilustración/Icono */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-[#F5E6C6] to-[#FAF3E7] rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-[#CC9F53]" />
            </div>
          </div>

          {/* Acciones */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <BackButton />
              
              <Link href="/">
                <Button className="flex items-center gap-2 w-full sm:w-auto">
                  <Home className="w-4 h-4" />
                  Ir al inicio
                </Button>
              </Link>
            </div>
          </div>

          {/* Mensaje adicional */}
          <div className="mt-8 text-sm text-gray-500">
            <p>
              ¿Necesitas ayuda? 
              <Link 
                href="/contacto" 
                className="text-[#CC9F53] hover:text-[#b08a3c] ml-1 font-medium"
              >
                Contáctanos
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
