import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Heart, Home } from 'lucide-react';

export const CartEmpty: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-20">
    <div className="w-32 h-32 bg-gradient-to-br from-[#F5E6C6] to-[#FAF3E7] rounded-full flex items-center justify-center mb-8 shadow-lg border-2 border-[#ecd8ab]">
      <ShoppingBag className="w-16 h-16 text-[#CC9F53]" />
    </div>
    <h3 className="text-2xl font-bold text-[#3A3A3A] mb-3">Tu carrito está vacío</h3>
    <p className="text-gray-600 mb-8 text-center max-w-md">
      Agrega productos a tu carrito para comenzar tu compra y disfrutar de nuestros productos
    </p>
    <div className="flex flex-col sm:flex-row gap-3">      <Link
        href="/"
        className="bg-gradient-to-r from-[#CC9F53] to-[#b08a3c] hover:from-[#b08a3c] hover:to-[#9a7635] text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg flex items-center gap-2"
      >
        <Home className="w-5 h-5" />
        Ir al inicio
      </Link>
      <Link
        href="/favoritos"
        className="border-2 border-[#CC9F53] text-[#CC9F53] hover:bg-[#CC9F53] hover:text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2"
      >
        <Heart className="w-5 h-5" />
        Ver favoritos
      </Link>
    </div>
  </div>
);