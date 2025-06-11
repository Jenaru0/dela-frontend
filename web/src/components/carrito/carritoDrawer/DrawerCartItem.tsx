import React from "react";
import { Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

interface DrawerCartItemProps {
  item: {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    category: string;
  };
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
  isUpdating: boolean;
}

export const DrawerCartItem: React.FC<DrawerCartItemProps> = ({ 
  item, 
  onIncrease, 
  onDecrease, 
  onRemove, 
  isUpdating 
}) => (
  <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-[#ecd8ab]/50 p-5 transition-all duration-300 hover:shadow-xl hover:border-[#CC9F53] hover:bg-white/90 hover:scale-[1.02]">
    {/* Glow effect on hover */}
    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#CC9F53]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    
    <div className="relative flex items-start gap-4">
      {/* Product image with enhanced styling */}
      <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[#F5E6C6] to-[#FAF3E7] flex items-center justify-center border-2 border-[#CC9F53]/30 overflow-hidden shadow-inner group-hover:border-[#CC9F53] transition-colors">
        <Image
          src={item.image}
          alt={item.name}
          className="w-14 h-14 object-contain transition-transform group-hover:scale-110"
          width={56}
          height={56}
        />
        {isUpdating && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-[#CC9F53] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        {/* Product info */}
        <div className="mb-3">
          <h3 className="font-bold text-base text-[#3A3A3A] truncate group-hover:text-[#CC9F53] transition-colors">
            {item.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-block font-semibold bg-gradient-to-r from-[#FAF3E7] to-[#F5E6C6] text-[#C59D5F] px-3 py-1 rounded-full text-xs border border-[#ECD8AB]/50">
              {item.category}
            </span>
            <span className="text-lg font-extrabold text-[#CC9F53]">
              S/ {(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          {/* Quantity controls */}
          <div className="flex items-center bg-white/70 rounded-full shadow-md border border-[#ecd8ab]/50 backdrop-blur-sm">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-[#B88D42] hover:bg-[#FFF8E1] hover:scale-110 rounded-full disabled:opacity-50 transition-all"
              title="Disminuir cantidad"
              onClick={onDecrease}
              disabled={isUpdating}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="px-4 font-bold text-base text-[#3A3A3A] min-w-[32px] text-center select-none">
              {item.quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-[#B88D42] hover:bg-[#FFF8E1] hover:scale-110 rounded-full disabled:opacity-50 transition-all"
              title="Aumentar cantidad"
              onClick={onIncrease}
              disabled={isUpdating}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Remove button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-red-50 hover:scale-110 transition-all disabled:opacity-50 rounded-full border border-transparent hover:border-red-200"
            title="Eliminar producto"
            onClick={onRemove}
            disabled={isUpdating}
          >
            <Trash2 className={`h-5 w-5 text-red-400 group-hover:text-red-600 transition-all ${isUpdating ? 'animate-pulse' : ''}`} />
          </Button>
        </div>
      </div>
    </div>
  </div>
);
