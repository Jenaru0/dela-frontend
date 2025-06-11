import React from "react";
import { ShoppingBag } from "lucide-react";

export const DrawerEmpty: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="w-24 h-24 bg-gradient-to-br from-[#FAF3E7] to-[#F5E6C6] rounded-full flex items-center justify-center mb-6 shadow-lg">
      <ShoppingBag className="w-12 h-12 text-[#CC9F53]/60" />
    </div>
    <h3 className="text-xl font-bold text-[#9A8C61] mb-2">¡Tu carrito está vacío!</h3>
    <p className="text-[#9A8C61]/70 text-sm mb-6 max-w-xs">
      Descubre nuestros increíbles productos y comienza a llenar tu carrito
    </p>    <div className="w-16 h-1 bg-gradient-to-r from-[#CC9F53] to-[#D4A859] rounded-full"></div>
  </div>
);
