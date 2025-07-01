import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Trash, Plus, Minus } from 'lucide-react';
import { StockAlertModal } from '@/components/modals/StockAlertModal';
import { useStockAlert } from '@/hooks/useStockAlert';
import type { CartProduct } from '@/types/productos';

interface CartProductItemProps {
  prod: CartProduct;
  increaseQty: (id: string) => Promise<void>;
  decreaseQty: (id: string) => Promise<void>;
  setQty: (id: string, qty: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
}

export const CartProductItem: React.FC<CartProductItemProps> = ({
  prod,
  increaseQty,
  decreaseQty,
  setQty,
  removeFromCart,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [quantityInput, setQuantityInput] = useState(prod.quantity.toString());
  const [showQuantityInput, setShowQuantityInput] = useState(false);
  
  // Usar el hook del modal de stock limpio y separado
  const { 
    isOpen, 
    config, 
    showWarning, 
    showError, 
    closeAlert 
  } = useStockAlert();

  const availableStock = prod.stock || 0;
  const stockMinimo = prod.stockMinimo || 0;
  const stockDisponibleParaVenta = Math.max(0, availableStock - stockMinimo);

  const handleIncreaseQty = async () => {
    if (prod.quantity >= stockDisponibleParaVenta) {
      if (stockDisponibleParaVenta === 0) {
        showError(prod.name, `${prod.name} está temporalmente agotado. Repondremos stock pronto.`);
      } else {
        showWarning(prod.name, stockDisponibleParaVenta, prod.quantity + 1);
      }
      return;
    }

    try {
      setIsUpdating(true);
      await increaseQty(prod.id);
    } catch (error) {
      console.error('Error increasing quantity:', error);
      showError(prod.name, error instanceof Error ? error.message : 'Error al aumentar cantidad');
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
      showError(prod.name, error instanceof Error ? error.message : 'Error al disminuir cantidad');
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
      showError(prod.name, error instanceof Error ? error.message : 'Error al eliminar del carrito');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleQuantityInputChange = (value: string) => {
    // Solo permitir números
    const numericValue = value.replace(/[^0-9]/g, '');
    setQuantityInput(numericValue);
  };

  const handleQuantitySubmit = async () => {
    const newQty = parseInt(quantityInput);
    
    if (isNaN(newQty) || newQty < 0) {
      showError(prod.name, 'Por favor ingresa una cantidad válida');
      setQuantityInput(prod.quantity.toString());
      setShowQuantityInput(false);
      return;
    }

    if (newQty > stockDisponibleParaVenta) {
      if (stockDisponibleParaVenta === 0) {
        showError(prod.name, `${prod.name} está temporalmente agotado. Repondremos stock pronto.`);
      } else {
        showWarning(prod.name, stockDisponibleParaVenta, newQty);
      }
      setQuantityInput(prod.quantity.toString());
      return;
    }

    try {
      setIsUpdating(true);
      await setQty(prod.id, newQty);
      setShowQuantityInput(false);
    } catch (error) {
      console.error('Error setting quantity:', error);
      showError(prod.name, error instanceof Error ? error.message : 'Error al actualizar cantidad');
      setQuantityInput(prod.quantity.toString());
    } finally {
      setIsUpdating(false);
    }
  };

  const handleQuantityInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleQuantitySubmit();
    } else if (e.key === 'Escape') {
      setQuantityInput(prod.quantity.toString());
      setShowQuantityInput(false);
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
        {/* Información de stock */}
        {stockDisponibleParaVenta <= 5 && stockDisponibleParaVenta > 0 && (
          <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
            ¡Solo quedan {stockDisponibleParaVenta} disponibles!
          </div>
        )}
        
        {stockDisponibleParaVenta === 0 && (
          <div className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
            Temporalmente agotado
          </div>
        )}
        
        {/* Contador mejorado */}
        <div className="flex items-center bg-white rounded-full shadow-inner border border-[#ecd8ab]">
          <Button
            variant="ghost"
            size="icon"
            className="px-2 text-[#B88D42] hover:bg-[#FFF8E1] rounded-full disabled:opacity-50"
            title="Restar"
            onClick={handleDecreaseQty}
            disabled={isUpdating}
          >
            <Minus className="w-4 h-4" />
          </Button>
          
          {showQuantityInput ? (
            <Input
              type="text"
              value={quantityInput}
              onChange={(e) => handleQuantityInputChange(e.target.value)}
              onKeyDown={handleQuantityInputKeyDown}
              onBlur={handleQuantitySubmit}
              className="w-16 text-center border-none bg-transparent focus:ring-0 px-1 text-lg font-semibold text-[#3A3A3A]"
              autoFocus
            />
          ) : (
            <button
              className="px-4 font-semibold text-lg text-[#3A3A3A] min-w-[28px] text-center select-none hover:bg-[#FFF8E1] rounded transition-colors"
              onClick={() => setShowQuantityInput(true)}
              title="Click para editar cantidad"
            >
              {prod.quantity}
            </button>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className="px-2 text-[#B88D42] hover:bg-[#FFF8E1] rounded-full disabled:opacity-50"
            title="Sumar"
            onClick={handleIncreaseQty}
            disabled={isUpdating || prod.quantity >= stockDisponibleParaVenta}
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

    {/* Modal de stock limpio y separado */}
    {config && (
      <StockAlertModal
        isOpen={isOpen}
        onClose={closeAlert}
        type={config.type}
        productName={config.productName}
        availableStock={config.availableStock}
        requestedQuantity={config.requestedQuantity}
        message={config.message}
      />
    )}
  </div>
  );
};
