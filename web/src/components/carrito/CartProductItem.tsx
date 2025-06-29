import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Trash, Plus, Minus } from 'lucide-react';
import type { CartProduct } from '@/types/productos';

interface CartProductItemProps {
  prod: CartProduct;
  increaseQty: (id: string) => Promise<void>;
  decreaseQty: (id: string) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
}

export const CartProductItem: React.FC<CartProductItemProps> = ({
  prod,
  increaseQty,
  decreaseQty,
  removeFromCart,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleIncreaseQty = async () => {
    try {
      setIsUpdating(true);
      await increaseQty(prod.id);
    } catch (error) {
      console.error('Error increasing quantity:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDecreaseQty = async () => {
    try {
      setIsUpdating(true);
      await decreaseQty(prod.id);
    } catch (error) {
      console.error('Error decreasing quantity:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveFromCart = async () => {
    try {
      setIsUpdating(true);
      await removeFromCart(prod.id);
    } catch (error) {
      console.error('Error removing from cart:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
  <div
    className="flex items-center bg-white bg-opacity-90 rounded-2xl shadow-xl border border-[#ecd8ab] p-4 transition-all duration-200 group hover:shadow-2xl hover:border-[#CC9F53]"
    style={{ backdropFilter: 'blur(4px)' }}
  >    <div className="w-20 h-20 rounded-4xl bg-[#F5E6C6] flex items-center justify-center mr-4 border-2 border-[#CC9F53] overflow-hidden">
      <Image
        src={prod.image}
        alt={prod.name}
        className="w-16 h-16 object-contain"
        width={64}
        height={64}
      />
    </div>

    <div className="flex-1">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <div className="font-bold text-lg text-[#3A3A3A]">{prod.name}</div>
          <div className="text-xs inline-block font-semibold bg-[#FAF3E7] text-[#C59D5F] px-3 py-1 rounded mt-1">
            {prod.category}
          </div>
        </div>
        <div className="flex md:justify-end items-center gap-2 mt-2 md:mt-0">
          <div className="text-[#C59D5F] font-extrabold text-lg">
            S/ {(prod.price * prod.quantity).toFixed(2)}
          </div>
        </div>
      </div>
      <div className="flex items-center mt-3 gap-4">
        {/* Contador mejorado */}
        <div className="flex items-center bg-white rounded-full shadow-inner border border-[#ecd8ab]">          <Button
            variant="ghost"
            size="icon"
            className="px-2 text-[#B88D42] hover:bg-[#FFF8E1] rounded-full disabled:opacity-50"
            title="Restar"
            onClick={handleDecreaseQty}
            disabled={isUpdating}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="px-4 font-semibold text-lg text-[#3A3A3A] min-w-[28px] text-center select-none">
            {prod.quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="px-2 text-[#B88D42] hover:bg-[#FFF8E1] rounded-full disabled:opacity-50"
            title="Sumar"
            onClick={handleIncreaseQty}
            disabled={isUpdating}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {/* Botón eliminar */}
        <Button
          variant="ghost"
          size="icon"
          className="ml-2 hover:bg-red-100 transition disabled:opacity-50"
          title="Eliminar"
          onClick={handleRemoveFromCart}
          disabled={isUpdating}
        >
          <Trash className={`h-5 w-5 text-red-400 group-hover:text-red-600 transition-all ${isUpdating ? 'animate-pulse' : ''}`} />
        </Button>
      </div>
    </div>
  </div>
  );
};
