'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Heart, ShoppingBag, Star, Sparkles, ArrowRight, Search, TrendingUp } from 'lucide-react';

const FavoritosEmpty: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animación de corazón con efecto de brillo */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#FAF3E7] to-[#F5E6C6] rounded-full flex items-center justify-center border-4 border-[#CC9F53]/20 shadow-2xl relative overflow-hidden">
            {/* Efecto de brillo animado */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-pulse"></div>
            
            <Heart className="w-16 h-16 text-[#CC9F53] animate-pulse" />
            
            {/* Estrellitas decorativas */}
            <Sparkles className="absolute top-2 right-4 w-4 h-4 text-[#CC9F53] animate-bounce" style={{ animationDelay: '0.5s' }} />
            <Sparkles className="absolute bottom-4 left-2 w-3 h-3 text-[#CC9F53] animate-bounce" style={{ animationDelay: '1s' }} />
            <Sparkles className="absolute top-6 left-6 w-3 h-3 text-[#CC9F53] animate-bounce" style={{ animationDelay: '1.5s' }} />
          </div>
          
          {/* Círculos decorativos con animación */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
            <div className="w-6 h-6 bg-[#CC9F53]/20 rounded-full animate-ping"></div>
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
            <div className="w-4 h-4 bg-[#CC9F53]/30 rounded-full animate-pulse" style={{ animationDelay: '0.7s' }}></div>
          </div>
        </div>

        {/* Título principal */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#3A3A3A] mb-4 tracking-tight">
          ¡Tu lista está vacía!
        </h2>

        {/* Subtítulo */}
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Aún no has agregado productos a tus favoritos.<br />
          <span className="text-[#CC9F53] font-semibold">¡Es hora de descubrir productos increíbles!</span>
        </p>

        {/* Tarjetas informativas */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {/* Tarjeta 1 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#ecd8ab] hover:shadow-xl hover:border-[#CC9F53] transition-all duration-300 group">
            <div className="w-12 h-12 bg-gradient-to-br from-[#CC9F53] to-[#b08a3c] rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
              <Search className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-[#3A3A3A] mb-2">Explora</h3>
            <p className="text-gray-600 text-sm">
              Navega por nuestro catálogo y encuentra productos únicos
            </p>
          </div>

          {/* Tarjeta 2 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#ecd8ab] hover:shadow-xl hover:border-[#CC9F53] transition-all duration-300 group">
            <div className="w-12 h-12 bg-gradient-to-br from-[#CC9F53] to-[#b08a3c] rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-[#3A3A3A] mb-2">Guarda</h3>
            <p className="text-gray-600 text-sm">
              Haz clic en el corazón para guardar tus productos favoritos
            </p>
          </div>

          {/* Tarjeta 3 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#ecd8ab] hover:shadow-xl hover:border-[#CC9F53] transition-all duration-300 group">
            <div className="w-12 h-12 bg-gradient-to-br from-[#CC9F53] to-[#b08a3c] rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-[#3A3A3A] mb-2">Compra</h3>
            <p className="text-gray-600 text-sm">
              Accede rápido a tus favoritos y añádelos al carrito
            </p>
          </div>
        </div>

        {/* Beneficios de tener favoritos */}
        <div className="bg-gradient-to-r from-[#FAF3E7]/80 to-[#F5E6C6]/80 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-[#CC9F53]/30">
          <h3 className="text-xl font-bold text-[#3A3A3A] mb-4 flex items-center justify-center gap-2">
            <Star className="w-6 h-6 text-[#CC9F53]" />
            Beneficios de guardar favoritos
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#CC9F53] rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-semibold text-[#3A3A3A] text-sm">Acceso rápido</p>
                <p className="text-gray-600 text-xs">Encuentra tus productos preferidos al instante</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#CC9F53] rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-semibold text-[#3A3A3A] text-sm">Sincronización</p>
                <p className="text-gray-600 text-xs">Disponible en todos tus dispositivos</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#CC9F53] rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-semibold text-[#3A3A3A] text-sm">Notificaciones</p>
                <p className="text-gray-600 text-xs">Te avisamos de ofertas especiales</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#CC9F53] rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-semibold text-[#3A3A3A] text-sm">Compra rápida</p>
                <p className="text-gray-600 text-xs">Añade todos al carrito de una vez</p>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/productos">
            <Button className="bg-gradient-to-r from-[#CC9F53] to-[#b08a3c] hover:from-[#b08a3c] hover:to-[#9a7635] text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-3 w-full sm:w-auto">
              <ShoppingBag className="w-5 h-5" />
              Explorar productos
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>

          <Link href="/categorias">
            <Button 
              variant="outline" 
              className="border-2 border-[#CC9F53] text-[#CC9F53] hover:bg-[#CC9F53] hover:text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 flex items-center gap-3 w-full sm:w-auto"
            >
              <TrendingUp className="w-5 h-5" />
              Ver categorías
            </Button>
          </Link>
        </div>

        {/* Mensaje motivacional */}
        <div className="mt-10 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-[#CC9F53]/20">
          <p className="text-[#CC9F53] font-medium text-sm flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            ¡Comienza a crear tu lista de productos favoritos hoy mismo!
            <Sparkles className="w-4 h-4" />
          </p>
        </div>
      </div>
    </div>
  );
};

export default FavoritosEmpty;
