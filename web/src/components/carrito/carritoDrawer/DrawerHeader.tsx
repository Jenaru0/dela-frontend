import React from "react";
import { X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface DrawerHeaderProps {
  onClose: () => void;
  itemCount: number;
}

export const DrawerHeader: React.FC<DrawerHeaderProps> = ({ onClose, itemCount }) => (
  <div className="relative px-6 py-6 bg-gradient-to-r from-white to-[#FAF3E7]/80 backdrop-blur-sm border-b border-[#ECD8AB]/30">
    {/* Decorative background */}
    <div className="absolute inset-0 bg-gradient-to-r from-[#CC9F53]/5 to-transparent opacity-50"></div>
    
    <div className="relative flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-[#CC9F53] via-[#D4A859] to-[#b08a3c] rounded-2xl flex items-center justify-center shadow-lg shadow-[#CC9F53]/25">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          {itemCount > 0 && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-pulse">
              {itemCount}
            </div>
          )}
        </div>
        <div>
          <span className="font-extrabold text-2xl text-[#CC9F53] tracking-tight block">Tu carrito</span>
          <span className="text-sm text-[#9A8C61] font-medium">
            {itemCount === 0 ? 'Vacío' : `${itemCount} ${itemCount === 1 ? 'producto' : 'productos'}`}
          </span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="h-11 w-11 rounded-full hover:bg-[#FAF3E7] hover:scale-105 transition-all duration-200 border border-transparent hover:border-[#CC9F53]/20"
      >
        <X className="w-6 h-6 text-[#9A8C61] hover:text-[#CC9F53]" />
      </Button>
    </div>
  </div>
);
