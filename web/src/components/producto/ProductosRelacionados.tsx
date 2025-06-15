import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Producto } from '@/types/productos';
import { fetchCatalogoProductos } from '@/services/catalogo.service';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthModalGlobal } from '@/contexts/AuthModalContext';
import { useFavorites } from '@/contexts/FavoritoContext';

interface ProductosRelacionadosProps {
  categoriaId: string | number;
  productoId: string | number;
}

export function ProductosRelacionados({ categoriaId, productoId }: ProductosRelacionadosProps) {
  const [relacionados, setRelacionados] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { open: openAuthModal } = useAuthModalGlobal();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    if (!categoriaId) return;
    setLoading(true);
    fetchCatalogoProductos()
      .then((data) => {
        // Filtra por categoría y excluye el producto actual
        const filtrados = data
          .filter((p: Producto) => String(p.categoria?.id) === String(categoriaId) && String(p.id) !== String(productoId))
          .slice(0, 4);
        setRelacionados(filtrados);
      })
      .finally(() => setLoading(false));
  }, [categoriaId, productoId]);

  if (loading || relacionados.length === 0) return null;
  return (
    <section className="w-full">      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Artículos relacionados
        </h2>
        <p className="text-gray-600">
          Otros productos que te podrían interesar
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relacionados.map((prod) => {
          const img = prod.imagenes?.find((img) => img.principal) || prod.imagenes?.[0];
          const precioUnitario = typeof prod.precioUnitario === 'string' ? parseFloat(prod.precioUnitario) : prod.precioUnitario;
          const precioAnterior = typeof prod.precioAnterior === 'string' ? parseFloat(prod.precioAnterior) : prod.precioAnterior;
          const tieneDescuento = precioAnterior && precioAnterior > precioUnitario;
          const descuento = tieneDescuento ? Math.round(((precioAnterior! - precioUnitario!) / precioAnterior!) * 100) : 0;
          
          return (
            <div
              key={prod.id}
              className="group relative bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              onClick={() => router.push(`/productos/${prod.id}`)}
            >
              {/* Descuento */}
              {tieneDescuento && (
                <span className="absolute left-3 top-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
                  -{descuento}%
                </span>
              )}
              
              {/* Botón favorito */}
              <button
                className={`absolute right-3 top-3 h-8 w-8 rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center z-10 ${
                  isFavorite(prod.id)
                    ? 'text-red-500 bg-red-50 hover:bg-red-100'
                    : 'text-gray-400 bg-white/80 hover:text-red-500 hover:bg-red-50'
                }`}
                onClick={async (e) => {
                  e.stopPropagation();
                  if (!isAuthenticated) {
                    openAuthModal('login');
                    return;
                  }
                  if (isFavorite(prod.id)) {
                    await removeFavorite(prod.id);
                  } else {
                    await addFavorite(prod.id);
                  }
                }}
                aria-label={isFavorite(prod.id) ? 'Quitar de favoritos' : 'Añadir a favoritos'}
              >
                <Heart className={`h-4 w-4 transition-all ${isFavorite(prod.id) ? 'fill-current' : ''}`} />
              </button>

              {/* Imagen */}
              <div className="aspect-square bg-gray-50 flex items-center justify-center p-6">
                <Image
                  src={img?.url || '/images/product-placeholder.png'}
                  alt={img?.altText || prod.nombre}
                  width={200}
                  height={200}
                  className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Información */}
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm">
                  {prod.nombre}
                </h3>
                
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-[#CC9F53]">
                    S/ {precioUnitario?.toFixed(2)}
                  </span>
                  {tieneDescuento && (
                    <span className="text-sm text-gray-400 line-through">
                      S/ {precioAnterior?.toFixed(2)}
                    </span>
                  )}
                </div>

                <Button
                  className="w-full bg-[#CC9F53] hover:bg-[#b08a3c] text-white font-medium py-2 text-sm transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/productos/${prod.id}`);
                  }}
                >
                  Ver producto
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
