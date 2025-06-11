import React from "react";
import { ArrowRight, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface DrawerFooterProps {
  subtotal: number;
  onClearCart: () => void;
  onClose: () => void;
  isClearingCart: boolean;
}

export const DrawerFooter: React.FC<DrawerFooterProps> = ({ 
  subtotal, 
  onClearCart, 
  onClose, 
  isClearingCart 
}) => (
  <div className="relative border-t border-[#ECD8AB]/30 bg-gradient-to-r from-white to-[#FAF3E7]/80 backdrop-blur-sm p-6">
    {/* Decorative background */}
    <div className="absolute inset-0 bg-gradient-to-t from-[#CC9F53]/5 to-transparent opacity-50"></div>
    
    <div className="relative space-y-5">
      {/* Enhanced price summary */}
      <div className="bg-white/70 backdrop-blur-sm border border-[#ECD8AB]/50 rounded-2xl p-5 shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[#3A3A3A] font-semibold text-base">Subtotal</span>
          <span className="text-2xl font-extrabold text-[#CC9F53] tracking-tight">
            S/ {subtotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Enhanced action buttons */}
      <div className="space-y-8">
        <Link href="/carrito" onClick={onClose}>
          <Button className="w-full bg-gradient-to-r from-[#CC9F53] via-[#D4A859] to-[#b08a3c] hover:from-[#b08a3c] hover:via-[#CC9F53] hover:to-[#9a7635] text-white font-bold py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 text-base hover:scale-[1.02]">
            Ver carrito completo
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex gap-6">
          <Button
            variant="outline"
            onClick={onClearCart}
            disabled={isClearingCart}
            className="flex-1 group relative overflow-hidden border-2 border-red-200/80 text-red-500 hover:text-white hover:border-red-400 transition-all duration-300 rounded-2xl py-4 font-bold shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-red-600 to-red-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-2xl"></div>
            
            {/* Content */}
            <div className="relative flex items-center justify-center gap-2 z-10">
              <Trash2 className={`w-4 h-4 transition-all duration-200 ${isClearingCart ? 'animate-pulse' : 'group-hover:rotate-12'}`} />
              <span className="text-sm font-bold">
                {isClearingCart ? 'Vaciando...' : 'Vaciar carrito'}
              </span>
            </div>
            
            {/* Loading spinner overlay */}
            {isClearingCart && (
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </Button>
          
          <Link href="/productos" onClick={onClose} className="flex-1">
            <Button
              variant="outline"
              className="w-full group relative overflow-hidden border-2 border-[#CC9F53]/60 text-[#C59D5F] hover:text-white hover:border-[#CC9F53] transition-all duration-300 rounded-2xl py-4 font-bold shadow-lg hover:shadow-xl"
            >
              {/* Background gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#CC9F53] via-[#D4A859] to-[#b08a3c] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-2xl"></div>
              
              {/* Content */}
              <div className="relative flex items-center justify-center gap-2 z-10">
                <ShoppingBag className="w-4 h-4 transition-all duration-200 group-hover:scale-110" />
                <span className="text-sm font-bold">Seguir comprando</span>
              </div>
              
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </div>
);
