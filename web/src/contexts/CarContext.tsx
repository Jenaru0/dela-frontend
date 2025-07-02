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
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  increaseQty: (productId: string) => Promise<void>;
  decreaseQty: (productId: string) => Promise<void>;
  setQty: (productId: string, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  syncCartInBackground: () => Promise<void>;
  loadCartIfNeeded: () => Promise<void>;
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
  const [cartLoaded, setCartLoaded] = useState(false); // Para saber si ya se cargó
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

  // Load cart only when needed (lazy loading)
  const loadCartIfNeeded = async () => {
    if (!isAuthenticated || !usuario || cartLoaded) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    try {
      console.time('⏱️ loadCartIfNeeded time');
      setIsLoading(true);
      const apiCart = await carritoService.getCart();
      const localCart = apiCart.items.map(convertApiCartItemToLocal);
      setCart(localCart);
      setCartLoaded(true);
      console.timeEnd('⏱️ loadCartIfNeeded time');
      console.log('✅ Cart loaded lazily with', localCart.length, 'items');
    } catch (error) {
      console.error('❌ Error loading cart lazily:', error);
      if (error instanceof Error && error.message.includes('401')) {
        setCart([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Load cart from API when user is authenticated
  const refreshCart = async () => {
    if (!isAuthenticated || !usuario) {
      setCart([]);
      setCartLoaded(false);
      return;
    }

    try {
      console.time('⏱️ refreshCart time');
      setIsLoading(true);
      const apiCart = await carritoService.getCart();
      const localCart = apiCart.items.map(convertApiCartItemToLocal);
      setCart(localCart);
      setCartLoaded(true);
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
    const handleAuthChange = () => {
      if (!isAuthenticated || !usuario) {
        setCart([]);
        setCartLoaded(false);
        return;
      }

      // Solo cargar el carrito cuando sea necesario, no automáticamente
      // Esto mejora significativamente el tiempo de carga inicial
      console.log('🎯 User authenticated, cart will be loaded on first interaction');
    };

    handleAuthChange();
  }, [isAuthenticated, usuario]);
  const addToCart = async (product: Product, quantity: number = 1) => {
    console.log('🛒 addToCart called', { isAuthenticated, usuario, product, quantity });
    
    if (!isAuthenticated) {
      throw new Error('Debes iniciar sesión para añadir productos al carrito');
    }

    // Cargar carrito si no se ha cargado aún
    if (!cartLoaded) {
      await loadCartIfNeeded();
    }

    // Validar stock disponible
    const availableStock = product.stock || 0;
    if (availableStock <= 0) {
      throw new Error('Este producto no tiene stock disponible');
    }

    // Verificar si ya existe en el carrito y calcular cantidad total
    const existingItem = cart.find(item => item.id === product.id);
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    const totalQuantity = currentQuantity + quantity;

    if (totalQuantity > availableStock) {
      throw new Error(`Solo quedan ${availableStock} unidades disponibles. Ya tienes ${currentQuantity} en tu carrito.`);
    }

    if (quantity <= 0) {
      throw new Error('La cantidad debe ser mayor a 0');
    }

    try {
      setIsLoading(true);
      console.time('⏱️ addToCart total time');
      
      console.log('📡 Calling carritoService.addItemToCart with:', {
        productoId: parseInt(product.id),
        cantidad: quantity,
      });
      
      console.time('⏱️ API addItemToCart time');
      await carritoService.addItemToCart({
        productoId: parseInt(product.id),
        cantidad: quantity,
      });
      console.timeEnd('⏱️ API addItemToCart time');
      
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
      
      // Optionally, we can refresh in background without blocking the user
      // but for now, let's skip the refresh to see if this improves performance
      console.log('✅ Cart updated successfully');
      console.timeEnd('⏱️ addToCart total time');
      
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      // If the API call failed, we should refresh the cart to ensure consistency
      console.log('🔄 API failed, refreshing cart to ensure consistency...');
      await refreshCart();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!isAuthenticated) {
      throw new Error('Debes iniciar sesión para modificar el carrito');
    }

    // Cargar carrito si no se ha cargado aún
    if (!cartLoaded) {
      await loadCartIfNeeded();
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

    // Cargar carrito si no se ha cargado aún
    if (!cartLoaded) {
      await loadCartIfNeeded();
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
        syncCartInBackground,
        loadCartIfNeeded
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
