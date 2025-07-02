'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Play } from 'lucide-react';
import { useCatalogo } from '@/hooks/useCatalogo';
import { useStats } from '@/hooks/useStats';

const HeroSection: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { productos, loading } = useCatalogo();
  const { totalProductos, loading: statsLoading } = useStats();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calcular años de experiencia dinámicamente (fundado en 2000)
  const añosExperiencia = new Date().getFullYear() - 2000;
  // Obtener productos para mostrar (prioritarios: destacados, sino cualquiera)
  const productosDestacados =
    productos?.filter((p) => p.destacado).slice(0, 2) || [];
  const productosDisponibles =
    productos?.filter((p) => p.disponible !== false).slice(0, 2) || [];

  // Usar productos destacados si existen, sino usar cualquier producto disponible
  const productosParaMostrar =
    productosDestacados.length > 0 ? productosDestacados : productosDisponibles;
  // Solo mostrar productos si ya se cargaron los datos
  const displayProducts = loading
    ? null // No mostrar nada mientras carga
    : productosParaMostrar.length >= 2
    ? [
        {
          name: productosParaMostrar[0].name,
          price:
            productosParaMostrar[0].priceFormatted ||
            `S/${productosParaMostrar[0].price?.toFixed(2) || '0.00'}`,
          image: productosParaMostrar[0].image,
        },
        {
          name: productosParaMostrar[1].name,
          price:
            productosParaMostrar[1].priceFormatted ||
            `S/${productosParaMostrar[1].price?.toFixed(2) || '0.00'}`,
          image: productosParaMostrar[1].image,
        },
      ]
    : productosParaMostrar.length === 1
    ? [
        {
          name: productosParaMostrar[0].name,
          price:
            productosParaMostrar[0].priceFormatted ||
            `S/${productosParaMostrar[0].price?.toFixed(2) || '0.00'}`,
          image: productosParaMostrar[0].image,
        },
        { name: 'Producto DELA', price: 'S/12.90' }, // Fallback para el segundo
      ]
    : productos && productos.length === 0 // Si ya cargó pero no hay productos
    ? [
        { name: 'Leche Premium DELA', price: 'S/8.50' }, // Fallbacks por si no hay productos en BD
        { name: 'Yogurt Griego DELA', price: 'S/12.90' },
      ]
    : null; // Aún cargando o hay productos pero no disponibles

  // Evitar hidratación si no está montado
  if (!mounted) {
    return (
      <section className="relative min-h-[90vh] overflow-hidden bg-gradient-to-br from-[#F5EFD7] via-white to-[#F5EFD7]/50">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[url('https://dela.com.pe/img/valle_pc.png')] bg-cover bg-center" />
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 h-20 w-20 rounded-full bg-[#CC9F53]/10 animate-pulse" />
        <div className="absolute bottom-32 right-16 h-32 w-32 rounded-full bg-[#CC9F53]/5 animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/4 h-16 w-16 rounded-full bg-[#CC9F53]/10 animate-pulse delay-500" />

        <div className="container relative z-10 mx-auto px-4 md:px-6 h-full flex items-center">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center w-full py-16 md:py-24">
            {/* Content */}
            <div className="flex flex-col justify-center space-y-6 lg:space-y-8">
              <div className="space-y-4">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-full bg-[#CC9F53]/10 px-4 py-2 text-sm font-medium text-[#CC9F53]">
                  <div className="h-2 w-2 rounded-full bg-[#CC9F53] animate-pulse" />
                  Lácteos Artesanales desde 2000
                </div>

                {/* Main heading */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-[#3A3A3A] leading-tight">
                  <span className="text-[#CC9F53] drop-shadow-sm">DELA</span>
                  <br />
                  <span className="bg-gradient-to-r from-[#3A3A3A] to-[#525252] bg-clip-text text-transparent">
                    Deleites del Valle
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed">
                  Productos lácteos artesanales de la más alta calidad, elaborados
                  con leche fresca de nuestro propio establo en{' '}
                  <span className="text-[#CC9F53] font-semibold">
                    Cerro Azul, Cañete
                  </span>
                  . Comprometidos con el{' '}
                  <span className="text-[#CC9F53] font-semibold">
                    bienestar animal
                  </span>{' '}
                  y la
                  <span className="text-[#CC9F53] font-semibold">
                    {' '}
                    sostenibilidad
                  </span>
                  .
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <Link href="/productos">
                  <Button size="xl" className="group">
                    Explorar Productos
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>

                <Link href="/nosotros">
                  <Button variant="outline" size="xl" className="group">
                    <Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                    Nuestra Historia
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 pt-6 border-t border-[#E6D5A8]">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#CC9F53]">30+</div>
                  <div className="text-sm text-gray-600">Productos Lácteos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#CC9F53]">25+</div>
                  <div className="text-sm text-gray-600">Años de Experiencia</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#CC9F53]">100%</div>
                  <div className="text-sm text-gray-600">Leche Fresca</div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="flex items-center justify-center lg:justify-end">
              <div className="relative">
                {/* Main product image */}
                <div className="relative h-[400px] w-[400px] md:h-[500px] md:w-[500px] lg:h-[600px] lg:w-[600px]">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#CC9F53]/20 to-[#F5EFD7]/20 animate-pulse" />
                  <Image
                    src="https://dela.com.pe/img/logoRecurso%201.svg"
                    alt="Productos artesanales DELA"
                    fill
                    sizes="(max-width: 768px) 400px, (max-width: 1024px) 500px, 600px"
                    className="object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-105"
                    priority
                    onError={(e) => {
                      e.currentTarget.src = '/images/hero-fallback.svg';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>
    );
  }

  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-gradient-to-br from-[#F5EFD7] via-white to-[#F5EFD7]/50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[url('https://dela.com.pe/img/valle_pc.png')] bg-cover bg-center" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 h-20 w-20 rounded-full bg-[#CC9F53]/10 animate-pulse" />
      <div className="absolute bottom-32 right-16 h-32 w-32 rounded-full bg-[#CC9F53]/5 animate-pulse delay-1000" />
      <div className="absolute top-1/2 right-1/4 h-16 w-16 rounded-full bg-[#CC9F53]/10 animate-pulse delay-500" />

      <div className="container relative z-10 mx-auto px-4 md:px-6 h-full flex items-center">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center w-full py-16 md:py-24">
          {/* Content */}
          <div className="flex flex-col justify-center space-y-6 lg:space-y-8">
            <div className="space-y-4">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-[#CC9F53]/10 px-4 py-2 text-sm font-medium text-[#CC9F53]">
                <div className="h-2 w-2 rounded-full bg-[#CC9F53] animate-pulse" />
                Lácteos Artesanales desde 2000
              </div>

              {/* Main heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-[#3A3A3A] leading-tight">
                <span className="text-[#CC9F53] drop-shadow-sm">DELA</span>
                <br />
                <span className="bg-gradient-to-r from-[#3A3A3A] to-[#525252] bg-clip-text text-transparent">
                  Deleites del Valle
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed">
                Productos lácteos artesanales de la más alta calidad, elaborados
                con leche fresca de nuestro propio establo en{' '}
                <span className="text-[#CC9F53] font-semibold">
                  Cerro Azul, Cañete
                </span>
                . Comprometidos con el{' '}
                <span className="text-[#CC9F53] font-semibold">
                  bienestar animal
                </span>{' '}
                y la
                <span className="text-[#CC9F53] font-semibold">
                  {' '}
                  sostenibilidad
                </span>
                .
              </p>
            </div>{' '}
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <Link href="/productos">
                <Button size="xl" className="group">
                  Explorar Productos
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>

              <Link href="/nosotros">
                <Button variant="outline" size="xl" className="group">
                  <Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                  Nuestra Historia
                </Button>
              </Link>
            </div>{' '}
            {/* Stats */}
            <div className="flex items-center gap-8 pt-6 border-t border-[#E6D5A8]">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#CC9F53]">
                  {statsLoading ? (
                    <div className="animate-pulse bg-[#CC9F53] rounded h-6 w-12"></div>
                  ) : (
                    `${totalProductos || 30}+`
                  )}
                </div>
                <div className="text-sm text-gray-600">Productos Lácteos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#CC9F53]">
                  {añosExperiencia}+
                </div>
                <div className="text-sm text-gray-600">Años de Experiencia</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#CC9F53]">100%</div>
                <div className="text-sm text-gray-600">Leche Fresca</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="relative">
              {/* Main product image */}
              <div className="relative h-[400px] w-[400px] md:h-[500px] md:w-[500px] lg:h-[600px] lg:w-[600px]">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#CC9F53]/20 to-[#F5EFD7]/20 animate-pulse" />{' '}
                <Image
                  src="https://dela.com.pe/img/logoRecurso%201.svg"
                  alt="Productos artesanales DELA"
                  fill
                  sizes="(max-width: 768px) 400px, (max-width: 1024px) 500px, 600px"
                  className="object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-105"
                  priority
                  onError={(e) => {
                    e.currentTarget.src = '/images/hero-fallback.svg';
                  }}
                />
              </div>{' '}
              {/* Floating product card - top left */}
              {displayProducts && displayProducts[0] && (
                <div className="absolute top-4 left-2 sm:top-8 sm:left-4 lg:top-12 lg:left-8 bg-white rounded-xl shadow-lg p-2 sm:p-3 animate-bounce max-w-[180px] sm:max-w-none">
                  <div className="flex items-center gap-2">
                    <div className="h-11 w-11 sm:h-8 sm:w-8 rounded relative overflow-hidden flex-shrink-0">
                      <Image
                        src={
                          displayProducts[0].image ||
                          '/images/product-placeholder.png'
                        }
                        alt="Productos artesanales DELA"
                        className="object-cover"
                        fill
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-[#3A3A3A] truncate">
                        {displayProducts[0].name}
                      </div>
                      <div className="text-xs text-[#CC9F53]">
                        {displayProducts[0].price}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Floating product card - bottom right */}
              {displayProducts && displayProducts[1] && (
                <div className="absolute bottom-4 right-2 sm:bottom-8 sm:right-4 lg:bottom-12 lg:right-8 bg-white rounded-xl shadow-lg p-2 sm:p-3 animate-bounce delay-1000 max-w-[180px] sm:max-w-none">
                  <div className="flex items-center gap-2">
                    <div className="h-11 w-11 sm:h-8 sm:w-8 rounded relative overflow-hidden flex-shrink-0">
                      <Image
                        src={
                          displayProducts[1].image ||
                          '/images/product-placeholder.png'
                        }
                        alt="Productos artesanales DELA"
                        className="object-cover"
                        fill
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-[#3A3A3A] truncate">
                        {displayProducts[1].name}
                      </div>
                      <div className="text-xs text-[#CC9F53]">
                        {displayProducts[1].price}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
};

export default HeroSection;
