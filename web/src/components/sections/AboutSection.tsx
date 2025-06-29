'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const AboutSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">
          <div className="relative overflow-hidden rounded-xl group">
            <div className="aspect-[4/3] relative">
              <Image
                src="/images/about-image.svg"
                alt="Nuestra historia - DELA Deleites del Valle"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#CC9F53]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#CC9F53]/10 rounded-full blur-xl"></div>
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#F5EFD7] rounded-full blur-lg"></div>
          </div>

          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center rounded-full bg-[#F5EFD7] px-3 py-1 text-sm font-medium text-[#CC9F53]">
                🐄 Nuestra Historia
              </div>
              <h2 className="text-3xl font-bold text-[#3A3A3A] md:text-4xl leading-tight">
                Lácteos Artesanales desde
                <span className="text-[#CC9F53]"> el año 2000</span>
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-[#CC9F53] to-[#F5EFD7] rounded-full"></div>
            </div>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                DELA Corp SAC es una empresa familiar peruana fundada en el año
                2000, especializada en la producción de lácteos artesanales de
                alta calidad. Ubicados en Cerro Azul, Cañete, utilizamos leche
                fresca de nuestro propio establo, garantizando frescura y
                calidad en cada producto.
              </p>
              <p>
                Nuestro compromiso con el bienestar animal, la sostenibilidad y
                la conexión con la comunidad local nos ha convertido en un
                referente en la producción lechera artesanal del valle.
              </p>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 py-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#CC9F53]">25+</div>
                <div className="text-sm text-gray-600">Años de experiencia</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#CC9F53]">2</div>
                <div className="text-sm text-gray-600">Ubicaciones</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#CC9F53]">100%</div>
                <div className="text-sm text-gray-600">Leche Fresca</div>
              </div>
            </div>{' '}
            <div className="pt-2">
              <Link
                href="/nosotros"
                className="group inline-flex items-center justify-center rounded-md bg-[#CC9F53] px-8 py-3 text-base font-medium text-white transition-all duration-200 hover:bg-[#B88D42] hover:shadow-md active:scale-[0.98]"
              >
                Conoce más sobre nosotros
                <svg
                  className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
