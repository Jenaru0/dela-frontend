'use client';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CarContext';
import { useCartDrawer } from '@/contexts/CartDrawerContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthModalGlobal } from '@/contexts/AuthModalContext';
import { Button } from '@/components/ui/Button';
import Layout from '@/components/layout/Layout';
import { CheckCircle, ShoppingBag } from 'lucide-react';
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
  return (    <Layout>      {/* Hero Section con gradiente de fondo */}
      <section className="relative bg-gradient-to-br from-[#FFF9EC] via-white to-[#F5EFD7]/30 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#CC9F53]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#F5EFD7]/30 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            {/* Galería de imágenes - Columna izquierda */}
            <div className="relative order-2 lg:order-1">
              <div className="sticky top-8">
                <ProductoGallery imagenes={product.imagenes} nombre={product.nombre} />
              </div>
            </div>
            
            {/* Información del producto - Columna derecha */}
            <div className="order-1 lg:order-2 space-y-6">
              {/* Breadcrumb */}
              <nav className="flex items-center space-x-2 text-sm text-gray-500">
                <button 
                  onClick={() => router.push('/productos')}
                  className="hover:text-[#CC9F53] transition-colors"
                >
                  Productos
                </button>
                <span>/</span>
                <span className="text-gray-900 font-medium">{product.nombre}</span>
              </nav>

              {/* Card de información principal */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-6 sm:p-8">
                <ProductoInfo
                  producto={product}
                  precioUnitario={precioUnitario}
                  precioAnterior={precioAnterior}
                  hasDiscount={hasDiscount}
                  discount={discount}
                />
                  {/* Acciones principales */}
                <div className="mt-8 space-y-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="w-full bg-[#CC9F53] hover:bg-[#b08a3c] text-white font-semibold py-4 px-6 rounded-lg text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isAddingToCart ? (
                      <>
                        <ShoppingBag className="w-5 h-5 animate-pulse" />
                        <span>Añadiendo al carrito...</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        <span>Añadir al carrito</span>
                        {added && (
                          <CheckCircle className="w-5 h-5 ml-2 text-white animate-bounce" />
                        )}
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full border-2 border-[#CC9F53] text-[#CC9F53] hover:bg-[#CC9F53] hover:text-white font-semibold py-3 px-6 rounded-lg text-base transition-all duration-300"
                    onClick={() => router.push('/productos')}
                  >
                    Seguir comprando
                  </Button>
                </div>
              </div>

              {/* Garantías y beneficios */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-white/40 hover:bg-white/80 transition-all duration-300">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">Calidad garantizada</p>
                </div>
                
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-white/40 hover:bg-white/80 transition-all duration-300">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">Envío seguro</p>
                </div>
                
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-white/40 hover:bg-white/80 transition-all duration-300">
                  <div className="w-12 h-12 bg-[#CC9F53]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-[#CC9F53]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">Hecho con amor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
        {/* Productos relacionados */}
      {product.categoria?.id && (
        <section className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <ProductosRelacionados categoriaId={product.categoria.id} productoId={product.id} />
          </div>
        </section>
      )}
    </Layout>
  );
}
