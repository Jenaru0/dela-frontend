'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { Lock, ShoppingBag, Trash2, User } from 'lucide-react';
import { useCart } from '@/contexts/CarContext';
import { useAuth } from '@/contexts/AuthContext';
import { CartProductItem } from '@/components/carrito/CartProductItem';
import { CartSummary } from '@/components/carrito/CartSummary';
import { CartEmpty } from '@/components/carrito/CartEmpty';
import ClearCartModal from '@/components/carrito/ClearCartModal';
import { Button } from '@/components/ui/Button';
export default function CarritoPage() {
  const {
    cart,
    increaseQty,
    decreaseQty,
    setQty,
    removeFromCart,
    clearCart,
  } = useCart();
  const { isAuthenticated, usuario, isLoading } = useAuth();
  const [isClearingCart, setIsClearingCart] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const handleClearCart = async () => {
    try {
      setIsClearingCart(true);
      await clearCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      setIsClearingCart(false);
    }
  };

  const subtotal = cart.reduce(
    (acc, prod) => acc + prod.price * prod.quantity,
    0
  );
  const envio = 10;

  // Mostrar loading durante la verificación inicial
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-[#F5EFD7]/30">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#CC9F53] mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-[#3A3A3A] mb-2">
              Verificando sesión...
            </h2>
            <p className="text-gray-600">
              Por favor espera mientras verificamos tu autenticación
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // Verificar autenticación
  if (!isAuthenticated || !usuario) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-[#F5EFD7]/30">
          <div className="text-center">
            <User className="h-16 w-16 text-[#CC9F53] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#3A3A3A] mb-2">
              Acceso Restringido
            </h2>
            <p className="text-gray-600 mb-6">
              Debes iniciar sesión para acceder a tu carrito de compras
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => window.history.back()}>
                Volver
              </Button>
              <Link href="/productos">
                <Button variant="outline">
                  Ver productos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-10 bg-gradient-to-br from-[#fffbe6] via-[#fffaf1] to-[#fff]">
        <div className="container mx-auto px-2 max-w-5xl">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-[#C59D5F] tracking-tight flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-[#CC9F53]" /> Carrito de compras
          </h1>          {/* CTA y estadísticas */}
          <div className="mb-8 bg-white/80 rounded-2xl p-6 shadow-lg border border-[#ecd8ab]">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#F5E6C6] to-[#FAF3E7] rounded-xl flex items-center justify-center">
                  <Lock className="w-6 h-6 text-[#CC9F53]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[#3A3A3A]">Compra protegida</h2>
                  <p className="text-[#9A8C61] text-sm">Tus datos y pagos están seguros</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {cart.length > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#CC9F53]">{cart.length}</div>
                    <div className="text-xs text-gray-600">Productos en carrito</div>
                  </div>
                )}
                <Link
                  href="/productos"
                  className="bg-gradient-to-r from-[#CC9F53] to-[#b08a3c] hover:from-[#b08a3c] hover:to-[#9a7635] text-white font-semibold px-5 py-2.5 rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Seguir comprando
                </Link>
              </div>
            </div>
          </div>

          {cart.length === 0 ? (
            <CartEmpty />
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {/* Product list */}
              <div className="md:col-span-2 flex flex-col gap-6">
                {cart.map((prod) => (
                  <CartProductItem
                    key={prod.id}
                    prod={prod}
                    increaseQty={increaseQty}
                    decreaseQty={decreaseQty}
                    setQty={setQty}
                    removeFromCart={removeFromCart}
                  />
                ))}                {/* Acciones del carrito */}
                <div className="bg-gradient-to-r from-white/95 to-[#FAF3E7]/50 rounded-2xl p-6 shadow-lg border border-[#ecd8ab] mt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#CC9F53] to-[#b08a3c] rounded-lg flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#3A3A3A]">
                          {cart.length} {cart.length === 1 ? 'producto' : 'productos'} en tu carrito
                        </h3>
                        <p className="text-gray-600 text-sm">Gestiona los productos de tu compra</p>
                      </div>
                    </div>                      <Button
                      variant="outline"
                      className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 transition-all duration-200 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isClearingCart}
                      onClick={() => setIsClearModalOpen(true)}
                    >
                      <Trash2 className={`w-4 h-4 mr-2 ${isClearingCart ? 'animate-pulse' : ''}`} />
                      {isClearingCart ? 'Vaciando...' : 'Vaciar carrito'}
                    </Button>
                  </div>
                </div>
              </div>
              <CartSummary subtotal={subtotal} envio={envio} />
            </div>          )}
        </div>
      </div>

      {/* Clear Cart Modal */}
      <ClearCartModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={() => {
          setIsClearModalOpen(false);
          handleClearCart();
        }}
        cartCount={cart.length}
        isLoading={isClearingCart}
      />
    </Layout>
  );
}
