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
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  increaseQty: (productId: string) => Promise<void>;
  decreaseQty: (productId: string) => Promise<void>;
  setQty: (productId: string, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
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
      setIsLoading(true);
      const apiCart = await carritoService.getCart();
      const localCart = apiCart.items.map(convertApiCartItemToLocal);
      setCart(localCart);
    } catch (error) {
      console.error('Error loading cart:', error);
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
  const addToCart = async (product: Product) => {
    console.log('addToCart called', { isAuthenticated, usuario, product });
    
    if (!isAuthenticated) {
      throw new Error('Debes iniciar sesión para añadir productos al carrito');
    }

    try {
      setIsLoading(true);
      console.log('Calling carritoService.addItemToCart with:', {
        productoId: parseInt(product.id),
        cantidad: 1,
      });
      
      await carritoService.addItemToCart({
        productoId: parseInt(product.id),
        cantidad: 1,
      });
      
      console.log('Item added to cart, refreshing cart...');
      await refreshCart(); // Refresh to get updated cart
      console.log('Cart refreshed successfully');
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
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
      await carritoService.removeItemFromCart(parseInt(productId));
      await refreshCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
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

    try {
      setIsLoading(true);
      await carritoService.updateCartItem(parseInt(productId), {
        cantidad: item.quantity + 1,
      });
      await refreshCart();
    } catch (error) {
      console.error('Error increasing quantity:', error);
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
      if (item.quantity <= 1) {
        await carritoService.removeItemFromCart(parseInt(productId));
      } else {
        await carritoService.updateCartItem(parseInt(productId), {
          cantidad: item.quantity - 1,
        });
      }
      await refreshCart();
    } catch (error) {
      console.error('Error decreasing quantity:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const setQty = async (productId: string, qty: number) => {
    if (!isAuthenticated) {
      throw new Error('Debes iniciar sesión para modificar el carrito');
    }

    try {
      setIsLoading(true);
      if (qty <= 0) {
        await carritoService.removeItemFromCart(parseInt(productId));
      } else {
        await carritoService.updateCartItem(parseInt(productId), {
          cantidad: qty,
        });
      }
      await refreshCart();
    } catch (error) {
      console.error('Error setting quantity:', error);
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
        refreshCart 
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
