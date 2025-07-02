"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Product } from "@/lib/products";
import { useAuth } from "@/contexts/AuthContext";
import { carritoService, CartItem as ApiCartItem } from "@/services/carrito.service";

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextProps {
  cart: CartItem[];
  isLoading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<{ success: boolean; error?: string }>;
  removeFromCart: (productId: string) => Promise<void>;
  increaseQty: (productId: string) => Promise<void>;
  decreaseQty: (productId: string) => Promise<void>;
  setQty: (productId: string, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  syncCartInBackground: () => Promise<void>;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, usuario } = useAuth();

  // Utility function to convert API cart item to local cart item
  const convertApiCartItemToLocal = (apiItem: ApiCartItem): CartItem => {
    return {
      id: apiItem.producto.id.toString(),
      name: apiItem.producto.nombre,
      price: parseFloat(apiItem.producto.precioUnitario),
      oldPrice: apiItem.producto.precioAnterior ? parseFloat(apiItem.producto.precioAnterior) : undefined,
      image: apiItem.producto.imagenes?.[0]?.url || '/images/products/producto_sinimage.svg',
      category: apiItem.producto.categoria.nombre,
      description: apiItem.producto.descripcion,
      stock: apiItem.producto.stock,
      quantity: apiItem.cantidad,
    };
  };

  // Load cart from API when user is authenticated
  const refreshCart = async () => {
    if (!isAuthenticated || !usuario) {
      setCart([]);
      return;
    }

    try {
      console.time('⏱️ refreshCart time');
      setIsLoading(true);
      const apiCart = await carritoService.getCart();
      const localCart = apiCart.items.map(convertApiCartItemToLocal);
      setCart(localCart);
      console.timeEnd('⏱️ refreshCart time');
      console.log('✅ Cart refreshed with', localCart.length, 'items');
    } catch (error) {
      console.error('❌ Error loading cart:', error);
      // Keep local cart on error
    } finally {
      setIsLoading(false);
    }
  };  // Load cart on auth change
  useEffect(() => {
    const loadCart = async () => {
      if (!isAuthenticated || !usuario) {
        setCart([]);
        return;
      }

      // Double check token exists
      const token = localStorage.getItem('token');
      if (!token) {
        setCart([]);
        return;
      }

      try {
        setIsLoading(true);
        const apiCart = await carritoService.getCart();
        const localCart = apiCart.items.map(convertApiCartItemToLocal);
        setCart(localCart);
      } catch (error) {
        console.error('Error loading cart:', error);
        // If it's an auth error, don't retry and clear the cart
        if (error instanceof Error && error.message.includes('401')) {
          setCart([]);
        }
        // Keep local cart on other errors
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [isAuthenticated, usuario]);
  const addToCart = async (product: Product, quantity: number = 1): Promise<{ success: boolean; error?: string }> => {
    console.log('🛒 addToCart called', { isAuthenticated, usuario, product, quantity });
    
    if (!isAuthenticated) {
      return { success: false, error: 'Debes iniciar sesión para añadir productos al carrito' };
    }

    // Validar stock disponible - si no tenemos info de stock, dejamos que el backend lo maneje
    const availableStock = product.stock || 0;
    const stockMinimo = product.stockMinimo || 0;
    const stockDisponible = product.stock !== undefined ? Math.max(0, availableStock - stockMinimo) : null;
    
    // Solo validamos stock si tenemos la información
    if (stockDisponible !== null && stockDisponible <= 0) {
      return { 
        success: false, 
        error: availableStock <= 0 
          ? 'Este producto no tiene stock disponible'
          : `Este producto no tiene stock suficiente para la venta en este momento`
      };
    }

    // Verificar si ya existe en el carrito y calcular cantidad total
    const existingItem = cart.find(item => item.id === product.id);
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    const totalQuantity = currentQuantity + quantity;

    // Solo validamos cantidad total si tenemos info de stock
    if (stockDisponible !== null && totalQuantity > stockDisponible) {
      return { 
        success: false, 
        error: currentQuantity > 0 
          ? `Ya tienes este producto en tu carrito y no puedes agregar más unidades en este momento.`
          : `Este producto ha alcanzado su límite de stock disponible para la venta.`
      };
    }

    if (quantity <= 0) {
      return { success: false, error: 'La cantidad debe ser mayor a 0' };
    }

    try {
      setIsLoading(true);
      console.time('⏱️ addToCart total time');
      
      console.log('📡 Calling carritoService.addItemToCart with:', {
        productoId: parseInt(product.id),
        cantidad: quantity,
      });
      
      console.time('⏱️ API addItemToCart time');
      const result = await carritoService.addItemToCart({
        productoId: parseInt(product.id),
        cantidad: quantity,
      });
      console.timeEnd('⏱️ API addItemToCart time');
      
      // Verificar si la operación fue exitosa
      if (!result.success) {
        console.log('⚠️ API returned error:', result.error);
        return { success: false, error: result.error || 'Error al añadir producto al carrito' };
      }
      
      // Instead of refreshing the entire cart, let's update locally and then sync
      console.log('🔄 Updating cart locally...');
      const existingItemIndex = cart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex !== -1) {
        // Update existing item quantity
        const updatedCart = [...cart];
        updatedCart[existingItemIndex].quantity += quantity;
        setCart(updatedCart);
        console.log('✅ Updated existing item quantity locally');
      } else {
        // Add new item to cart
        const newCartItem: CartItem = {
          ...product,
          quantity: quantity,
        };
        setCart(prevCart => [...prevCart, newCartItem]);
        console.log('✅ Added new item to cart locally');
      }
      
      console.log('✅ Cart updated successfully');
      console.timeEnd('⏱️ addToCart total time');
      return { success: true };
      
    } catch (error) {
      console.log('⚠️ Unexpected error in addToCart:', error);
      // If there was an unexpected error, refresh the cart to ensure consistency
      console.log('🔄 Unexpected error occurred, refreshing cart to ensure consistency...');
      await refreshCart();
      
      return { 
        success: false, 
        error: 'Error inesperado al añadir producto al carrito. Por favor intenta nuevamente.'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!isAuthenticated) {
      throw new Error('Debes iniciar sesión para modificar el carrito');
    }

    try {
      setIsLoading(true);
      console.log('🗑️ Removing item from cart:', productId);
      
      await carritoService.removeItemFromCart(parseInt(productId));
      
      // Update local cart immediately
      setCart(prevCart => prevCart.filter(item => item.id !== productId));
      console.log('✅ Item removed from cart locally');
      
      // Optionally sync in background
      setTimeout(() => syncCartInBackground(), 500);
      
    } catch (error) {
      console.error('❌ Error removing from cart:', error);
      // If API call failed, refresh to ensure consistency
      await refreshCart();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const increaseQty = async (productId: string) => {
    const item = cart.find((p) => p.id === productId);
    if (!item) return;

    if (!isAuthenticated) {
      throw new Error('Debes iniciar sesión para modificar el carrito');
    }

    // Validar stock disponible
    const availableStock = item.stock || 0;
    if (item.quantity >= availableStock) {
      throw new Error(`No hay más stock disponible. Solo quedan ${availableStock} unidades.`);
    }

    try {
      setIsLoading(true);
      console.log('➕ Increasing quantity for:', productId);
      
      await carritoService.updateCartItem(parseInt(productId), {
        cantidad: item.quantity + 1,
      });
      
      // Update local cart immediately
      setCart(prevCart => 
        prevCart.map(cartItem => 
          cartItem.id === productId 
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
      console.log('✅ Quantity increased locally');
      
      // Optionally sync in background
      setTimeout(() => syncCartInBackground(), 500);
      
    } catch (error) {
      console.error('❌ Error increasing quantity:', error);
      // If API call failed, refresh to ensure consistency
      await refreshCart();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const decreaseQty = async (productId: string) => {
    const item = cart.find((p) => p.id === productId);
    if (!item) return;

    if (!isAuthenticated) {
      throw new Error('Debes iniciar sesión para modificar el carrito');
    }

    try {
      setIsLoading(true);
      console.log('➖ Decreasing quantity for:', productId);
      
      if (item.quantity <= 1) {
        await carritoService.removeItemFromCart(parseInt(productId));
        // Remove from local cart
        setCart(prevCart => prevCart.filter(cartItem => cartItem.id !== productId));
        console.log('✅ Item removed from cart locally (quantity was 1)');
      } else {
        await carritoService.updateCartItem(parseInt(productId), {
          cantidad: item.quantity - 1,
        });
        // Update local cart
        setCart(prevCart => 
          prevCart.map(cartItem => 
            cartItem.id === productId 
              ? { ...cartItem, quantity: cartItem.quantity - 1 }
              : cartItem
          )
        );
        console.log('✅ Quantity decreased locally');
      }
      
      // Optionally sync in background
      setTimeout(() => syncCartInBackground(), 500);
      
    } catch (error) {
      console.error('❌ Error decreasing quantity:', error);
      // If API call failed, refresh to ensure consistency
      await refreshCart();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const setQty = async (productId: string, qty: number) => {
    if (!isAuthenticated) {
      throw new Error('Debes iniciar sesión para modificar el carrito');
    }

    const item = cart.find((p) => p.id === productId);
    if (!item) return;

    // Validar cantidad y stock
    if (qty < 0) {
      throw new Error('La cantidad no puede ser negativa');
    }

    if (qty > 0) {
      const availableStock = item.stock || 0;
      if (qty > availableStock) {
        throw new Error(`Solo quedan ${availableStock} unidades disponibles.`);
      }
    }

    try {
      setIsLoading(true);
      console.log('🔢 Setting quantity for:', productId, 'to:', qty);
      
      if (qty <= 0) {
        await carritoService.removeItemFromCart(parseInt(productId));
        // Remove from local cart
        setCart(prevCart => prevCart.filter(cartItem => cartItem.id !== productId));
        console.log('✅ Item removed from cart locally (quantity set to 0)');
      } else {
        await carritoService.updateCartItem(parseInt(productId), {
          cantidad: qty,
        });
        // Update local cart
        setCart(prevCart => 
          prevCart.map(cartItem => 
            cartItem.id === productId 
              ? { ...cartItem, quantity: qty }
              : cartItem
          )
        );
        console.log('✅ Quantity set locally');
      }
      
      // Optionally sync in background
      setTimeout(() => syncCartInBackground(), 500);
      
    } catch (error) {
      console.error('❌ Error setting quantity:', error);
      // If API call failed, refresh to ensure consistency
      await refreshCart();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      throw new Error('Debes iniciar sesión para modificar el carrito');
    }

    try {
      setIsLoading(true);
      await carritoService.clearCart();
      setCart([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sync cart in background without blocking UI
  const syncCartInBackground = async () => {
    if (!isAuthenticated || !usuario) {
      return;
    }

    try {
      console.log('🔄 Syncing cart in background...');
      const apiCart = await carritoService.getCart();
      const localCart = apiCart.items.map(convertApiCartItemToLocal);
      setCart(localCart);
      console.log('✅ Background cart sync completed');
    } catch (error) {
      console.warn('⚠️ Background cart sync failed:', error);
      // Don't throw error as this is a background operation
    }
  };

  return (
    <CartContext.Provider
      value={{ 
        cart, 
        isLoading,
        addToCart, 
        removeFromCart, 
        increaseQty, 
        decreaseQty, 
        setQty, 
        clearCart,
        refreshCart,
        syncCartInBackground
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
