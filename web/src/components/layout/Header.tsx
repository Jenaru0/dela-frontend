'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useUserDataRefresh } from '@/hooks/useUserDataRefresh';
import AuthModal from '@/components/auth/AuthModal';
import { useCart } from '@/contexts/CarContext';
import { useFavorites } from '@/contexts/FavoritoContext';
import SmartSearchBar from './SmartSearchBar';
import {
  Menu,
  X,
  ShoppingCart,
  User,
  Heart,
  Phone,
  Mail,
  LogOut,
  Users,
} from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>(
    'login'
  );
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { isAuthenticated, usuario, cerrarSesion, isLoading } = useAuth();
  const { cart, loadCartIfNeeded } = useCart();
  const { favorites } = useFavorites();
  const router = useRouter();

  // Auto-refresh de datos del usuario (solo si está autenticado, sin refresh automático periódico)
  useUserDataRefresh({ 
    enabled: isAuthenticated && !!usuario,
    onMount: false, // No refrescar al montar en header para evitar doble request
    interval: 0 // Sin auto-refresh periódico
  });

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navigation = [
    { name: 'Inicio', href: '/' },
    { name: 'Productos', href: '/productos' },
    { name: 'Categorías', href: '/#categorias', isScroll: true },
    { name: 'Nosotros', href: '/nosotros' },
    { name: 'Contacto', href: '/contacto' },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cargar carrito cuando el usuario esté autenticado y el componente esté montado
  useEffect(() => {
    if (mounted && isAuthenticated && usuario) {
      loadCartIfNeeded();
    }
  }, [mounted, isAuthenticated, usuario, loadCartIfNeeded]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const updateHeaderHeight = () => {
      const header = document.querySelector('header');
      const topBar = document.querySelector('.top-bar');
      if (header && topBar) {
        const headerRect = header.getBoundingClientRect();
        const topBarRect = topBar.getBoundingClientRect();
        const totalHeight = headerRect.height + Math.max(0, topBarRect.bottom);
        document.documentElement.style.setProperty('--header-height', `${totalHeight}px`);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    // Throttle para evitar demasiadas llamadas a updateHeaderHeight
    let headerHeightTimeout: NodeJS.Timeout;
    const throttledUpdateHeaderHeight = () => {
      clearTimeout(headerHeightTimeout);
      headerHeightTimeout = setTimeout(updateHeaderHeight, 16); // ~60fps
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', throttledUpdateHeaderHeight);
    window.addEventListener('resize', throttledUpdateHeaderHeight);
    document.addEventListener('click', handleClickOutside);

    // Calcular altura inicial
    updateHeaderHeight();
    const timeoutId = setTimeout(updateHeaderHeight, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', throttledUpdateHeaderHeight);
      window.removeEventListener('resize', throttledUpdateHeaderHeight);
      document.removeEventListener('click', handleClickOutside);
      clearTimeout(timeoutId);
      clearTimeout(headerHeightTimeout);
    };
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: { name: string; href: string; isScroll?: boolean }
  ) => {
    if (item.isScroll && item.href === '/#categorias') {
      e.preventDefault();
      if (window.location.pathname === '/') {
        const element = document.getElementById('categorias');
        if (element) {
          const headerHeight = 80;
          const offsetTop = element.offsetTop - headerHeight + 10;
          window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
      } else {
        router.push('/');
        setTimeout(() => {
          const element = document.getElementById('categorias');
          if (element) {
            const headerHeight = 80;
            const offsetTop = element.offsetTop - headerHeight + 10;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
          }
        }, 100);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await cerrarSesion();
      setShowUserMenu(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const userMenuItems = [
    { icon: User, label: 'Mi Perfil', href: '/perfil' },
    ...(usuario?.tipoUsuario === 'ADMIN'
      ? [{ icon: Users, label: 'Panel Administrativo', href: '/admin' }]
      : []),
  ];

  // Evitar hidratación si no está montado
  if (!mounted) {
    return (
      <>
        {/* Top Bar */}
        <div className="bg-[#3A3A3A] text-white text-sm py-2">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+51 912 949 652</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>comercial@dela.com.pe</span>
              </div>
            </div>
            <div className="hidden md:block">
              <span>🚚 Envíos a todo Perú</span>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <header className="sticky top-0 z-50 w-full bg-white border-b border-[#E6D5A8]">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16 md:h-20">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-3">
                <div className="relative h-10 w-10 md:h-12 md:w-12">
                  <Image
                    src="https://dela.com.pe/img/lodo-dela-header.png"
                    alt="DELA Logo"
                    fill
                    sizes="(max-width: 768px) 40px, 48px"
                    className="object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        '/images/logo-fallback.png';
                    }}
                  />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl md:text-2xl font-bold text-[#3A3A3A]">
                    <span className="text-[#CC9F53]">DELA</span>
                    <span className="text-sm md:text-base font-normal text-gray-600 block leading-none">
                      Deleites del Valle
                    </span>
                  </h1>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-8 lg:ml-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 hover:text-[#CC9F53] font-medium transition-colors duration-200 relative group"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#CC9F53] transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                ))}
              </nav>

              {/* Search Bar (Desktop) */}
              <div className="hidden md:flex items-center flex-1 max-w-md mx-4 lg:mx-8">
                <SmartSearchBar className="w-full" />
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-2 md:space-x-3">
                {/* Favoritos */}
                <div className="w-10 h-10">
                  <Link href="/favoritos">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative cursor-pointer w-10 h-10"
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>

                {/* Carrito */}
                <div className="w-10 h-10">
                  <Link href="/carrito">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative cursor-pointer w-10 h-10"
                    >
                      <ShoppingCart className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>

                {/* Usuario / Autenticación */}
                <div className="w-10 h-10">
                  <div className="flex items-center justify-center w-10 h-10">
                    <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Botón menú móvil */}
                <div className="lg:hidden w-10 h-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-10 h-10"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Búsqueda móvil */}
            <div className="md:hidden pb-4">
              <SmartSearchBar className="w-full" />
            </div>
          </div>
        </header>
      </>
    );
  }

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#3A3A3A] text-white text-sm py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>+51 912 949 652</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>comercial@dela.com.pe</span>
            </div>
          </div>
          <div className="hidden md:block">
            <span>🚚 Envíos a todo Perú</span>
          </div>
        </div>
      </div>

      {/* Main Header */}      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-sm shadow-lg'
            : 'bg-white border-b border-[#E6D5A8]'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative h-10 w-10 md:h-12 md:w-12">                <Image
                  src="https://dela.com.pe/img/lodo-dela-header.png"
                  alt="DELA Logo"
                  fill
                  sizes="(max-width: 768px) 40px, 48px"
                  className="object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      '/images/logo-fallback.png';
                  }}
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl font-bold text-[#3A3A3A]">
                  <span className="text-[#CC9F53]">DELA</span>
                  <span className="text-sm md:text-base font-normal text-gray-600 block leading-none">
                    Deleites del Valle
                  </span>
                </h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 lg:ml-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item)}
                  className="text-gray-700 hover:text-[#CC9F53] font-medium transition-colors duration-200 relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#CC9F53] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}            </nav>
              {/* Search Bar (Desktop) */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-4 lg:mx-8">
              <SmartSearchBar className="w-full" />
            </div>
            
            {/* Action Buttons */}            <div className="flex items-center space-x-2 md:space-x-3">
              {/* Favoritos */}
              <div className="w-10 h-10">
                <Link href="/favoritos">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative cursor-pointer w-10 h-10"
                  >
                    <Heart className="h-5 w-5" />
                    {mounted && favorites.length > 0 && (
                      <Badge
                        variant="default"
                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-[#CC9F53] hover:bg-[#B88D42]"
                      >
                        {favorites.length}
                      </Badge>
                    )}
                  </Button>
                </Link>
              </div>

              {/* Carrito */}
              <div className="w-10 h-10">
                <Link href="/carrito">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative cursor-pointer w-10 h-10"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {mounted && cartItemsCount > 0 && (
                      <Badge
                        variant="default"
                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-[#CC9F53] hover:bg-[#B88D42]"
                      >
                        {cartItemsCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
              </div>              {/* Usuario / Autenticación */}
              <div className="w-10 h-10">
                {!mounted || isLoading ? (
                  <div className="flex items-center justify-center w-10 h-10">
                    <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                ) : isAuthenticated ? (
                  <div className="relative user-menu-container">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="w-10 h-10"
                    >                      <div className="flex items-center justify-center w-6 h-6 bg-[#CC9F53] text-white rounded-full text-xs font-medium backdrop-blur-sm border border-white/20 shadow-sm">
                        {usuario?.nombres?.charAt(0)?.toUpperCase() || 'U'}
                        {usuario?.apellidos?.charAt(0)?.toUpperCase() || ''}
                      </div>
                    </Button>

                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-[#E6D5A8] py-2 z-50">
                        {/* Información de usuario */}
                        <div className="px-4 py-3 border-b border-[#E6D5A8]">
                          <div className="flex items-center space-x-3">                            <div className="flex-none w-10 h-10 bg-[#CC9F53] text-white rounded-full flex items-center justify-center font-bold select-none backdrop-blur-sm border border-white/20 shadow-sm">
                              {usuario?.nombres?.charAt(0)?.toUpperCase() || 'U'}
                              {usuario?.apellidos?.charAt(0)?.toUpperCase() || ''}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[#3A3A3A]">
                                {usuario?.nombres} {usuario?.apellidos}
                              </p>
                              <p className="text-xs text-gray-500">
                                {usuario?.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Opciones */}
                        <div className="py-1">
                          {userMenuItems.map((item, index) => (
                            <Link
                              key={index}
                              href={item.href}
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#F5EFD7]/60 hover:text-[#CC9F53] transition-colors duration-200"
                            >
                              <item.icon className="h-4 w-4 mr-3" />
                              {item.label}
                            </Link>
                          ))}
                        </div>

                        {/* Cerrar sesión */}
                        <div className="border-t border-[#E6D5A8] mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                          >
                            <LogOut className="h-4 w-4 mr-3" />
                            Cerrar Sesión
                          </button>
                        </div>
                      </div>
                    )}                  </div>                ) : (
                  <div className="relative group">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setAuthModalMode('login');
                        setShowAuthModal(true);
                      }}
                      className="cursor-pointer w-10 h-10"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                    {/* Tooltip */}
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                      Iniciar Sesión
                    </div>
                  </div>
                )}
              </div>
                {/* Botón menú móvil */}
              <div className="lg:hidden w-10 h-10">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </Button>
              </div>
            </div>
          </div>          {/* Búsqueda móvil */}
          <div className="md:hidden pb-4">
            <SmartSearchBar className="w-full" />
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-[#E6D5A8] bg-white">
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={(e) => {
                      handleNavClick(e, item);
                      setIsMenuOpen(false);
                    }}
                    className="text-gray-700 hover:text-[#CC9F53] font-medium py-2 border-b border-gray-100 transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                ))}

                {!mounted ? null : !isLoading && isAuthenticated && usuario && (
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-3 p-3 bg-[#F5EFD7]/60 rounded-lg mb-3">                      <div className="flex items-center justify-center w-10 h-10 bg-[#CC9F53] text-white rounded-full text-sm font-medium backdrop-blur-sm border border-white/20 shadow-sm">
                        {usuario.nombres?.charAt(0)?.toUpperCase() || 'U'}
                        {usuario.apellidos?.charAt(0)?.toUpperCase() || ''}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#3A3A3A]">
                          {usuario.nombres} {usuario.apellidos}
                        </p>
                        <p className="text-xs text-gray-500">{usuario.email}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {userMenuItems.map((item, idx) => (
                        <Link
                          key={idx}
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-[#F5EFD7]/60 hover:text-[#CC9F53] transition-colors duration-200 rounded-lg"
                        >
                          <item.icon className="h-4 w-4 mr-3" />
                          {item.label}
                        </Link>
                      ))}
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 rounded-lg"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Modal de autenticación */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode}
      />
    </>
  );
};

export default Header;
