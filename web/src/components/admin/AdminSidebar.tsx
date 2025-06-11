'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  Package, 
  MessageSquare, 
  Star, 
  FileText, 
  ShoppingBag,
  FolderOpen,
  Menu,
  X,
  LucideIcon
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface MenuItem {
  title: string;
  icon: LucideIcon;
  href: string;
  description: string;
}

const AdminSidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);  const [headerHeight, setHeaderHeight] = useState(80);
  
  // Calcular altura del header dinámicamente y escuchar cambios en scroll
  useEffect(() => {
    const calculateHeights = () => {
      const header = document.querySelector('header');
      
      if (header) {
        const rect = header.getBoundingClientRect();
        const computedHeight = rect.height + Math.max(0, rect.top);
        setHeaderHeight(computedHeight);
      }
    };

    // Calcular inmediatamente
    calculateHeights();
    
    // Usar un timeout para recalcular después del render
    const timeoutId = setTimeout(calculateHeights, 100);
    
    // Escuchar eventos que pueden cambiar la altura del header
    const handleChange = () => {
      calculateHeights();
    };
    
    window.addEventListener('resize', handleChange);
    window.addEventListener('scroll', handleChange);
    document.addEventListener('scroll', handleChange);
    
    // Usar un interval para recalcular periódicamente (útil para headers sticky)
    const intervalId = setInterval(calculateHeights, 500);
    
    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
      window.removeEventListener('resize', handleChange);
      window.removeEventListener('scroll', handleChange);
      document.removeEventListener('scroll', handleChange);
    };
  }, []);
  
  const menuItems: MenuItem[] = [
    {
      title: 'Panel Principal',
      icon: LayoutDashboard,
      href: '/admin',
      description: 'Resumen y estadísticas'
    },
    {
      title: 'Usuarios',
      icon: Users,
      href: '/admin/usuarios',
      description: 'Gestión de usuarios'
    },
    {
      title: 'Direcciones',
      icon: MapPin,
      href: '/admin/direcciones',
      description: 'Direcciones de clientes'
    },
    {
      title: 'Productos',
      icon: ShoppingBag,
      href: '/admin/productos',
      description: 'Catálogo de productos'
    },
    {
      title: 'Categorías',
      icon: FolderOpen,
      href: '/admin/categorias',
      description: 'Organización de productos'
    },
    {
      title: 'Pedidos',
      icon: Package,
      href: '/admin/pedidos',
      description: 'Gestión de pedidos'
    },
    {
      title: 'Reclamos',
      icon: MessageSquare,
      href: '/admin/reclamos',
      description: 'Atención al cliente'
    },
    {
      title: 'Reseñas',
      icon: Star,
      href: '/admin/resenas',
      description: 'Moderación de reseñas'
    },
    {
      title: 'Newsletter',
      icon: FileText,
      href: '/admin/newsletter',
      description: 'Boletín electrónico'
    }
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsMobileOpen(false);
  };  const SidebarContent = () => (
    <div className="h-full bg-white border-r border-gray-200 shadow-lg flex flex-col">
      {/* Header del Sidebar */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#CC9F53] to-[#b08a3c] rounded-lg flex items-center justify-center shadow-md">
              <LayoutDashboard className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Panel Admin</h1>
              <p className="text-sm text-gray-600">Administración</p>
            </div>
          </div>
          
          {/* Botón de cerrar móvil */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden hover:bg-gray-100 p-2 rounded-lg"
          >
            <X className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      </div>      {/* Navegación */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto admin-sidebar-scroll">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <button
              key={item.href}
              onClick={() => handleNavigation(item.href)}
              className={`w-full flex items-start px-3 py-3 text-left rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-[#CC9F53] text-white shadow-md' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`flex-shrink-0 w-5 h-5 mr-3 mt-0.5 ${
                isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
              }`} />
              <div className="min-w-0 flex-1">
                <div className={`text-sm font-semibold ${
                  isActive ? 'text-white' : 'text-gray-900'
                }`}>
                  {item.title}
                </div>
                <div className={`text-xs mt-1 ${
                  isActive ? 'text-white/90' : 'text-gray-500'
                }`}>
                  {item.description}
                </div>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );return (
    <>
      {/* Botón del menú móvil */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsMobileOpen(true)}
        className="fixed z-30 lg:hidden bg-white/95 backdrop-blur-sm shadow-lg hover:bg-[#F5E6C6]/40 p-3 rounded-xl border border-[#ecd8ab]/50 transition-all duration-200"
        style={{ 
          top: `${headerHeight + 8}px`,
          left: '16px'
        }}
      >
        <Menu className="h-6 w-6 text-[#CC9F53]" />
      </Button>

      {/* Fondo oscuro móvil */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}      {/* Sidebar Desktop - FIJO entre header y footer */}
      <div 
        className="fixed left-0 z-10 w-64 transition-all duration-300 hidden lg:block shadow-xl overflow-hidden"
        style={{
          top: `${headerHeight}px`,
          height: `calc(100vh - ${headerHeight}px)`
        }}
      >
        <SidebarContent />
      </div>

      {/* Sidebar Móvil */}
      <div 
        className={`fixed left-0 w-64 z-40 transition-transform duration-300 lg:hidden shadow-2xl overflow-hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          top: `${headerHeight}px`,
          height: `calc(100vh - ${headerHeight}px)`
        }}
      >
        <SidebarContent />
      </div>
    </>
  );
};

export default AdminSidebar;
