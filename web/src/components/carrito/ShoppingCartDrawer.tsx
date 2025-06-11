"use client";
import React, { useRef, useEffect } from "react";
import { useCart } from "@/contexts/CarContext";
import { useCartDrawer } from "@/contexts/CartDrawerContext";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// Componente para el header del drawer
const DrawerHeader: React.FC<{ onClose: () => void; itemCount: number }> = ({ onClose, itemCount }) => (
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

// Componente para item del carrito
const CartItem: React.FC<{
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
}> = ({ item, onIncrease, onDecrease, onRemove, isUpdating }) => (
  <div
    className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-[#ecd8ab]/50 p-5 transition-all duration-300 hover:shadow-xl hover:border-[#CC9F53] hover:bg-white/90 hover:scale-[1.02]"
  >
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

// Componente para carrito vacío
const EmptyCart: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="w-24 h-24 bg-gradient-to-br from-[#FAF3E7] to-[#F5E6C6] rounded-full flex items-center justify-center mb-6 shadow-lg">
      <ShoppingBag className="w-12 h-12 text-[#CC9F53]/60" />
    </div>
    <h3 className="text-xl font-bold text-[#9A8C61] mb-2">¡Tu carrito está vacío!</h3>
    <p className="text-[#9A8C61]/70 text-sm mb-6 max-w-xs">
      Descubre nuestros increíbles productos y comienza a llenar tu carrito
    </p>
    <div className="w-16 h-1 bg-gradient-to-r from-[#CC9F53] to-[#D4A859] rounded-full"></div>
  </div>
);

// Componente para el footer del drawer
const DrawerFooter: React.FC<{
  subtotal: number;
  onClearCart: () => void;
  onClose: () => void;
  isClearingCart: boolean;
}> = ({ subtotal, onClearCart, onClose, isClearingCart }) => (
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
      <div className="space-y-3">
        <Link href="/carrito" onClick={onClose}>
          <Button className="w-full bg-gradient-to-r from-[#CC9F53] via-[#D4A859] to-[#b08a3c] hover:from-[#b08a3c] hover:via-[#CC9F53] hover:to-[#9a7635] text-white font-bold py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 text-base hover:scale-[1.02]">
            Ver carrito completo
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
          <div className="flex gap-3">
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

// Componente principal del drawer
const ShoppingCartDrawer: React.FC = () => {
  const { cart, increaseQty, decreaseQty, removeFromCart, clearCart } = useCart();
  const { open, closeDrawer } = useCartDrawer();
  const [isClearingCart, setIsClearingCart] = useState(false);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const drawerRef = useRef<HTMLDivElement>(null);

  // Calcular subtotal
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Manejar click en overlay
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Manejar cierre con animación
  const handleClose = () => {
    if (drawerRef.current) {
      drawerRef.current.classList.remove("animate-slide-in");
      drawerRef.current.classList.add("animate-slide-out");
      setTimeout(closeDrawer, 300);
    } else {
      closeDrawer();
    }
  };

  // Funciones de carrito con loading states
  const handleIncreaseQty = async (id: string) => {
    setUpdatingItems(prev => new Set(prev).add(id));
    try {
      await increaseQty(id);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleDecreaseQty = async (id: string) => {
    setUpdatingItems(prev => new Set(prev).add(id));
    try {
      await decreaseQty(id);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleRemoveFromCart = async (id: string) => {
    setUpdatingItems(prev => new Set(prev).add(id));
    try {
      await removeFromCart(id);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleClearCart = async () => {
    try {
      setIsClearingCart(true);
      await clearCart();
    } finally {
      setIsClearingCart(false);
    }
  };  // Prevenir scroll de fondo cuando el drawer está abierto
  useEffect(() => {
    if (open) {
      // Guardar el scroll actual
      const scrollPosition = window.pageYOffset;
      
      // Bloquear scroll del body
      document.body.style.cssText = `
        position: fixed;
        top: -${scrollPosition}px;
        left: 0;
        right: 0;
        overflow: hidden;
        width: 100%;
        height: 100vh;
      `;
      
      return () => {
        // Restaurar scroll
        document.body.style.cssText = '';
        window.scrollTo(0, scrollPosition);
      };
    }
  }, [open]);

  // Agregar estilos de animación
  useEffect(() => {
    if (open) {
      const style = document.createElement('style');
      style.textContent = `
        @keyframes slide-in {
          from { 
            transform: translateX(100%); 
            opacity: 0;
          }
          to { 
            transform: translateX(0); 
            opacity: 1;
          }
        }
        @keyframes slide-out {
          from { 
            transform: translateX(0); 
            opacity: 1;
          }
          to { 
            transform: translateX(100%); 
            opacity: 0;
          }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-out {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        .animate-slide-in {
          animation: slide-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .animate-slide-out {
          animation: slide-out 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-fade-out {
          animation: fade-out 0.2s ease-in;
        }
      `;
      document.head.appendChild(style);
      return () => {
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      };
    }
  }, [open]);

  if (!open) return null;
  return (
    <div 
      className="fixed inset-0 z-[9999] bg-gradient-to-br from-black/50 via-black/40 to-black/30 backdrop-blur-md flex justify-end animate-fade-in"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={drawerRef}
        className="relative h-full w-full max-w-md flex flex-col bg-gradient-to-br from-[#fffce8] via-white to-[#fffbec] shadow-2xl border-l-2 border-[#CC9F53]/30 animate-slide-in overflow-hidden"
        style={{
          boxShadow: '-10px 0 50px -12px rgba(204, 159, 83, 0.25), -20px 0 80px -20px rgba(0, 0, 0, 0.15)'
        }}
      >
        {/* Subtle pattern overlay */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23CC9F53' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        
        <DrawerHeader onClose={handleClose} itemCount={cart.length} />
        
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 scrollbar-thin scrollbar-thumb-[#CC9F53]/20 scrollbar-track-transparent">
          {cart.length === 0 ? (
            <EmptyCart />
          ) : (
            <>
              {cart.map((item, index) => (
                <div 
                  key={item.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CartItem
                    item={item}
                    onIncrease={() => handleIncreaseQty(item.id)}
                    onDecrease={() => handleDecreaseQty(item.id)}
                    onRemove={() => handleRemoveFromCart(item.id)}
                    isUpdating={updatingItems.has(item.id)}
                  />
                </div>
              ))}
            </>
          )}
        </div>

        {cart.length > 0 && (
          <DrawerFooter
            subtotal={subtotal}
            onClearCart={handleClearCart}
            onClose={handleClose}
            isClearingCart={isClearingCart}
          />
        )}
      </div>
    </div>
  );
};

export default ShoppingCartDrawer;
