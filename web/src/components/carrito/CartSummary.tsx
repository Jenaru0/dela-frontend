import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ShoppingBag } from "lucide-react";
import { scrollToTopInstant } from "@/lib/scroll";

interface CartSummaryProps {
  subtotal: number;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ subtotal }) => {
  const router = useRouter();

  const manejarIrAPagar = () => {
    // Scroll inmediato
    scrollToTopInstant();
    
    // Navegar con un pequeño delay para asegurar el scroll
    setTimeout(() => {
      router.push('/checkout');
    }, 50);
  };

  return (
    <div className="bg-white bg-opacity-95 border border-[#ecd8ab] rounded-2xl p-7 shadow-2xl h-fit sticky top-24 flex flex-col gap-3">
      <h2 className="text-2xl font-extrabold mb-2 text-[#B88D42]">Resumen</h2>
      <div className="flex justify-between text-base text-[#8F734A] mb-2">
        <span>Subtotal</span>
        <span>S/ {subtotal.toFixed(2)}</span>
      </div>

      <Button 
        onClick={manejarIrAPagar}
        className="w-full mt-3 bg-gradient-to-r from-[#C59D5F] via-[#CC9F53] to-[#FFD795] hover:from-[#B88D42] hover:to-[#C59D5F] text-white font-extrabold py-3 rounded-xl text-lg shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
      >
        <ShoppingBag className="w-5 h-5" />
        Ir a pagar
      </Button>
    </div>
  );
};
