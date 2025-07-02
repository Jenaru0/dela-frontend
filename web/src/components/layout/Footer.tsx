'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Clock,
} from 'lucide-react';

const Footer: React.FC = () => {
  const socialLinks = [
    {
      icon: Facebook,
      href: 'https://facebook.com/DELADeleitesDelValle',
      label: 'Facebook',
    },
    {
      icon: Instagram,
      href: 'https://instagram.com/dela.peru',
      label: 'Instagram',
    },
    { icon: Twitter, href: 'https://twitter.com/dela.peru', label: 'TikTok' },
    { icon: Youtube, href: 'https://threads.net/@dela.peru', label: 'Threads' },
  ];
  const productCategories = [
    { name: 'Leche DELA', search: 'leche' },
    { name: 'Yogurt DELA', search: 'yogurt' },
    { name: 'Quesos DELA', search: 'queso' },
    { name: 'Helados DELA', search: 'helado' },
    { name: 'Productos Lácteos', search: 'lacteo' },
    { name: 'Productos Frescos', search: 'fresco' },
  ];

  const quickLinks = [
    { name: 'Sobre Nosotros', href: '/nosotros' },
    { name: 'Catálogo', href: '/productos' },
    { name: 'Contacto', href: '/contacto' },
    { name: 'Blog', href: '/blog' },
    { name: 'Recetas', href: '/recetas' },
    { name: 'Eventos', href: '/eventos' },
  ];

  const legalLinks = [
    { name: 'Términos y Condiciones', href: '/terminos' },
    { name: 'Política de Privacidad', href: '/privacidad' },
    { name: 'Política de Cookies', href: '/cookies' },
    { name: 'Devoluciones', href: '/devoluciones' },
  ];

  return (
    <footer className="bg-[#3A3A3A] text-white">
      {/* Main Footer */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center space-x-3 mb-6">
                <div className="relative h-12 w-12">
                  <Image
                    src="/images/logo-white.svg"
                    alt="DELA Logo"
                    fill
                    sizes="120px"
                    className="object-contain"
                    onError={(e) => {
                      e.currentTarget.src = '/images/logo-fallback-white.png';
                    }}
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold !text-white">
                    <span className="text-[#CC9F53]">DELA</span>
                  </h2>
                  <p className="text-sm text-gray-400">Deleites del Valle</p>
                </div>
              </Link>

              <p className="text-gray-300 mb-6 leading-relaxed">
                Desde el año 2000, DELA Corp SAC se dedica a la producción de
                lácteos frescos y de calidad en Cerro Azul, Cañete.
                Comprometidos con el bienestar animal y la sostenibilidad.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-[#CC9F53] flex-shrink-0" />
                  <span className="text-sm text-gray-300">
                    Cerro Azul, Cañete - Lima, Perú
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-[#CC9F53] flex-shrink-0" />
                  <span className="text-sm text-gray-300">
                    Sucursal Lima - Lima, Perú
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-[#CC9F53] flex-shrink-0" />
                  <span className="text-sm text-gray-300">+51 912 949 652</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-[#CC9F53] flex-shrink-0" />
                  <span className="text-sm text-gray-300">
                    comercial@dela.com.pe
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-[#CC9F53] flex-shrink-0" />
                  <span className="text-sm text-gray-300">
                    Lun - Vie: 8:00 - 17:00
                  </span>
                </div>
              </div>
            </div>

            {/* Product Categories */}
            <div>
              <h3 className="text-lg font-semibold !text-white mb-6">
                Nuestros Productos
              </h3>
              <ul className="space-y-3">
                {productCategories.map((category) => (
                  <li key={category.name}>
                    <Link
                      href={`/productos?search=${encodeURIComponent(category.search)}`}
                      className="text-gray-300 hover:text-[#CC9F53] transition-colors duration-200 text-sm"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold !text-white mb-6">
                Enlaces Rápidos
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-[#CC9F53] transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social & Legal */}
            <div>
              <h3 className="text-lg font-semibold !text-white mb-6">
                Síguenos
              </h3>

              {/* Social Links */}
              <div className="flex space-x-4 mb-8">
                {socialLinks.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="bg-gray-700 hover:bg-[#CC9F53] p-2 rounded-full transition-colors duration-200"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5 text-white" />
                  </Link>
                ))}
              </div>

              {/* Legal Links */}
              <h4 className="text-sm font-semibold !text-white mb-4">
                Información Legal
              </h4>
              <ul className="space-y-2">
                {legalLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-[#CC9F53] transition-colors duration-200 text-xs"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2025 DELA Corp SAC. Todos los derechos reservados. RUC: 20000000001
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">Métodos de pago:</span>
              <div className="flex space-x-2">
                <div className="bg-white rounded p-1 w-10 h-7 flex items-center justify-center">
                  <div 
                    className="w-8 h-5 bg-contain bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/images/visa.svg')" }}
                    aria-label="Visa"
                    title="Visa"
                  />
                </div>
                <div className="bg-white rounded p-1 w-10 h-7 flex items-center justify-center">
                  <div 
                    className="w-8 h-5 bg-contain bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/images/mastercard.svg')" }}
                    aria-label="Mastercard"
                    title="Mastercard"
                  />
                </div>
                <div className="bg-white rounded p-1 w-10 h-7 flex items-center justify-center">
                  <div 
                    className="w-8 h-5 bg-contain bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/images/paypal.svg')" }}
                    aria-label="PayPal"
                    title="PayPal"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
