'use client';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CarContext';
import { useCartDrawer } from '@/contexts/CartDrawerContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthModalGlobal } from '@/contexts/AuthModalContext';
import { Button } from '@/components/ui/Button';
import Layout from '@/components/layout/Layout';
import { CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchCatalogoProductoById } from '@/services/catalogo.service';
import type { Producto } from '@/types/productos';
import { ProductoGallery } from '@/components/producto/ProductoGallery';
import { ProductoInfo } from '@/components/producto/ProductoInfo';
import { ProductosRelacionados } from '@/components/producto/ProductosRelacionados';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { openDrawer } = useCartDrawer();
  const { isAuthenticated } = useAuth();
  const { open: openAuthModal } = useAuthModalGlobal();
  const [added, setAdded] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [product, setProduct] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Busca producto desde API
  const id = typeof params.id === 'string' ? params.id : params.id?.[0];
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchCatalogoProductoById(id)
      .then((data) => {
        setProduct(data);
        setError('');
      })
      .catch(() => {
        setProduct(null as Producto | null);
        setError('No se encontró el producto');
      })
      .finally(() => setLoading(false));
  }, [id]);
  if (loading) {
    return (
      <Layout>
        <section className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#CC9F53] mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-[#3A3A3A] mb-2">
              Cargando producto...
            </h2>
            <p className="text-gray-600">
              Por favor espera mientras cargamos la información del producto
            </p>
          </div>
        </section>
      </Layout>
    );
  }

  // Si no existe el producto
  if (!product) {
    return (
      <Layout>
        <section className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#CC9F53] mb-3">
              {error || 'Producto no encontrado'}
            </h2>
            <Button
              onClick={() => router.push('/productos')}
              className="bg-[#CC9F53] text-white"
            >
              Volver a productos
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  // Normaliza precioUnitario y precioAnterior a número
  const precioUnitario =
    typeof product.precioUnitario === 'string'
      ? parseFloat(product.precioUnitario)
      : product.precioUnitario;
  const precioAnterior =
    typeof product.precioAnterior === 'string'
      ? parseFloat(product.precioAnterior)
      : product.precioAnterior;

  const hasDiscount =
    precioAnterior !== undefined && precioAnterior > precioUnitario;
  const discount = hasDiscount
    ? Math.round(
        ((precioAnterior! - precioUnitario) / precioAnterior!) * 100
      )
    : 0; // Añadir al carrito + abrir drawer y feedback
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    try {
      setIsAddingToCart(true);
      // Si tu carrito espera Product, aquí deberías mapear Producto a Product
      await addToCart({
        id: String(product.id),
        name: product.nombre,
        price: typeof product.precioUnitario === 'string' ? parseFloat(product.precioUnitario) : product.precioUnitario,
        oldPrice: typeof product.precioAnterior === 'string' ? parseFloat(product.precioAnterior) : product.precioAnterior,
        image: product.imagenes?.[0]?.url || '/images/product-placeholder.png',
        category: product.categoria?.nombre || 'Sin categoría',
        description: product.descripcion,
        stock: product.stock,
      });
      openDrawer();
      setAdded(true);
      setTimeout(() => setAdded(false), 1200);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <Layout>
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-10">
        <div className="bg-white rounded-3xl shadow-2xl border border-[#ECD8AB]/30 p-6 md:p-10 flex flex-col md:flex-row gap-10 md:gap-16 items-center md:items-start relative overflow-hidden">
          {/* Decoración de fondo */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#F5EFD7]/60 rounded-full blur-2xl z-0" />
          <div className="absolute -bottom-10 -right-10 w-52 h-52 bg-[#CC9F53]/10 rounded-full blur-2xl z-0" />
          {/* Galería de imágenes */}
          <div className="relative z-10 w-full max-w-xs flex flex-col gap-3">
            <ProductoGallery imagenes={product.imagenes} nombre={product.nombre} />
          </div>
          {/* Info producto */}
          <div className="relative z-10 flex-1 flex flex-col gap-6 items-end w-full">
            <ProductoInfo
              producto={product}
              precioUnitario={precioUnitario}
              precioAnterior={precioAnterior}
              hasDiscount={hasDiscount}
              discount={discount}
            />
            {/* Acciones alineadas a la derecha */}
            <div className="mt-4 flex flex-row gap-3 max-w-xs w-full justify-end">
              <Button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="flex-1 bg-gradient-to-r from-[#C59D5F] via-[#CC9F53] to-[#FFD795] hover:from-[#B88D42] hover:to-[#C59D5F] text-white font-extrabold py-3 rounded-xl text-lg shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed min-w-0"
              >
                {isAddingToCart ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Añadiendo...
                  </>
                ) : (
                  <>
                    Añadir al carrito
                    {added && (
                      <CheckCircle className="ml-2 w-5 h-5 text-white animate-bounce" />
                    )}
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="flex-1 text-[#C59D5F] border-[#CC9F53] hover:bg-[#FFFBE8] font-semibold min-w-0"
                onClick={() => router.push('/productos')}
              >
                Seguir comprando
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* Productos relacionados */}
      {product.categoria?.id && (
        <div className="max-w-5xl mx-auto px-4 sm:px-8">
          <ProductosRelacionados categoriaId={product.categoria.id} productoId={product.id} />
        </div>
      )}
    </Layout>
  );
}
