"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Play } from "lucide-react";

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-gradient-to-br from-[#F5EFD7] via-white to-[#F5EFD7]/50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] bg-cover bg-center" />
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
                Productos 100% Artesanales
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
                Descubre sabores auténticos y productos artesanales de la más
                alta calidad, elaborados con{" "}
                <span className="text-[#CC9F53] font-semibold">pasión</span> y
                <span className="text-[#CC9F53] font-semibold"> tradición</span>{" "}
                desde el corazón del valle.
              </p>
            </div>{" "}
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
                <div className="text-2xl font-bold text-[#CC9F53]">500+</div>
                <div className="text-sm text-gray-600">Productos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#CC9F53]">10k+</div>
                <div className="text-sm text-gray-600">Clientes Felices</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#CC9F53]">8+</div>
                <div className="text-sm text-gray-600">Años de Experiencia</div>
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
                  src="/images/hero-product.png"
                  alt="Productos artesanales DELA"
                  fill
                  className="object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-105"
                  priority
                  onError={(e) => {
                    e.currentTarget.src = "/images/hero-fallback.png";
                  }}
                />
              </div>

              {/* Floating product cards */}
              <div className="absolute -top-4 -left-4 lg:-left-8 bg-white rounded-xl shadow-lg p-3 animate-bounce">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-[#F5EFD7]" />
                  <div>
                    <div className="text-xs font-semibold text-[#3A3A3A]">
                      Miel Artesanal
                    </div>
                    <div className="text-xs text-[#CC9F53]">€9.99</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 lg:-right-8 bg-white rounded-xl shadow-lg p-3 animate-bounce delay-1000">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-[#F5EFD7]" />
                  <div>
                    <div className="text-xs font-semibold text-[#3A3A3A]">
                      Mermelada
                    </div>
                    <div className="text-xs text-[#CC9F53]">€6.99</div>
                  </div>
                </div>
              </div>
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
