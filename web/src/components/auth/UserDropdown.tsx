'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { 
  User, 
  LogOut, 
  ChevronDown
} from 'lucide-react';

const UserDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { usuario, cerrarSesion } = useAuth();

  // Cerrar dropdown cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await cerrarSesion();
      setIsOpen(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };  const menuItems = [
    {
      icon: User,
      label: 'Mi Perfil',
      href: '/perfil',
      onClick: () => setIsOpen(false),
    },
  ];

  console.log('🔍 DROPDOWN DEBUG - menuItems:', menuItems.map(item => item.label));

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 hover:bg-[#F5EFD7]/60"
      >
        <div className="flex items-center justify-center w-8 h-8 bg-[#CC9F53] text-white rounded-full text-sm font-medium">
          {usuario?.nombres?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-[#3A3A3A] leading-none">
            {usuario?.nombres} {usuario?.apellidos}
          </p>
          <p className="text-xs text-gray-500 leading-none mt-0.5">
            {usuario?.email}
          </p>
        </div>
        <ChevronDown 
          className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-[#E6D5A8] py-2 z-50">
          {/* User Info Header (Mobile) */}
          <div className="md:hidden px-4 py-3 border-b border-[#E6D5A8]">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-[#CC9F53] text-white rounded-full text-sm font-medium">
                {usuario?.nombres?.charAt(0)?.toUpperCase() || 'U'}
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
          </div>          {/* Menu Items */}
          <div className="py-1">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={item.onClick}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#F5EFD7]/60 hover:text-[#CC9F53] transition-colors duration-200"
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Logout */}
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
      )}
    </div>
  );
};

export default UserDropdown;
