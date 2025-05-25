"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";

const Footer: React.FC = () => {
  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  const productCategories = [
    "Mieles Artesanales",
    "Mermeladas",
    "Conservas",
    "Productos Lácteos",
    "Embutidos",
    "Panadería",
  ];

  const quickLinks = [
    { name: "Sobre Nosotros", href: "/nosotros" },
    { name: "Catálogo", href: "/productos" },
    { name: "Contacto", href: "/contacto" },
    { name: "Blog", href: "/blog" },
    { name: "Recetas", href: "/recetas" },
    { name: "Eventos", href: "/eventos" },
  ];

  const legalLinks = [
    { name: "Términos y Condiciones", href: "/terminos" },
    { name: "Política de Privacidad", href: "/privacidad" },
    { name: "Política de Cookies", href: "/cookies" },
    { name: "Devoluciones", href: "/devoluciones" },
  ];

  return (
    <footer className="bg-[#3A3A3A] text-white">
      {/* Newsletter Section */}
      <div className="bg-[#CC9F53] py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              ¡Mantente al día con nuestras novedades!
            </h3>
            <p className="text-white/90 mb-6 text-lg">
              Recibe ofertas especiales, nuevos productos y recetas exclusivas
              directamente en tu email.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Tu email aquí..."
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-900"
              />
              <Button
                variant="secondary"
                className="bg-white text-[#CC9F53] hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold"
              >
                Suscribirse
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center space-x-3 mb-6">
                <div className="relative h-12 w-12">
                  <Image
                    src="/images/logo-white.png"
                    alt="DELA Logo"
                    fill
                    className="object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "/images/logo-fallback-white.png";
                    }}
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    <span className="text-[#CC9F53]">DELA</span>
                  </h2>
                  <p className="text-sm text-gray-400">Deleites del Valle</p>
                </div>
              </Link>

              <p className="text-gray-300 mb-6 leading-relaxed">
                Desde 2015, elaboramos productos artesanales que capturan la
                esencia y sabores auténticos del valle, utilizando ingredientes
                locales y técnicas tradicionales.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-[#CC9F53] flex-shrink-0" />
                  <span className="text-sm text-gray-300">
                    Calle del Valle 123, 28001 Madrid, España
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-[#CC9F53] flex-shrink-0" />
                  <span className="text-sm text-gray-300">+34 123 456 789</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-[#CC9F53] flex-shrink-0" />
                  <span className="text-sm text-gray-300">
                    info@dela-deleites.com
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-[#CC9F53] flex-shrink-0" />
                  <span className="text-sm text-gray-300">
                    Lun - Vie: 9:00 - 18:00
                  </span>
                </div>
              </div>
            </div>

            {/* Product Categories */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">
                Nuestros Productos
              </h3>
              <ul className="space-y-3">
                {productCategories.map((category) => (
                  <li key={category}>
                    <Link
                      href={`/productos/${category
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      className="text-gray-300 hover:text-[#CC9F53] transition-colors duration-200 text-sm"
                    >
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">
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
              <h3 className="text-lg font-semibold mb-6 text-white">
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
                    <social.icon className="h-5 w-5" />
                  </Link>
                ))}
              </div>

              {/* Legal Links */}
              <h4 className="text-sm font-semibold mb-4 text-white">Legal</h4>
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
              © 2024 DELA Deleites del Valle. Todos los derechos reservados.
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">Métodos de pago:</span>
              <div className="flex space-x-2">
                <div className="bg-white rounded p-1">
                  <Image
                    src="/images/visa.png"
                    alt="Visa"
                    width={32}
                    height={20}
                    className="object-contain"
                  />
                </div>
                <div className="bg-white rounded p-1">
                  <Image
                    src="/images/mastercard.png"
                    alt="Mastercard"
                    width={32}
                    height={20}
                    className="object-contain"
                  />
                </div>
                <div className="bg-white rounded p-1">
                  <Image
                    src="/images/paypal.png"
                    alt="PayPal"
                    width={32}
                    height={20}
                    className="object-contain"
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
