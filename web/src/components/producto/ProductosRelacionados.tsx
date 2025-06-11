import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Producto } from '@/types/productos';
import { fetchCatalogoProductos } from '@/services/catalogo.service';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import { Eye, Heart } from 'lucide-react';
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
    <section className="mt-10 mb-10 w-full flex flex-col items-center">
      <div className="w-full max-w-5xl px-4 sm:px-8 mx-auto">
        <h3 className="text-2xl font-extrabold text-[#232323] mb-8 flex items-center gap-3 tracking-tight drop-shadow-sm">
          <span className="w-4 h-4 rounded-full bg-gradient-to-br from-[#C59D5F] to-[#FFD795] shadow-lg inline-block" />
          Artículos relacionados
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-12 gap-y-16 place-items-center">
          {relacionados.map((prod) => {
            const img = prod.imagenes?.find((img) => img.principal) || prod.imagenes?.[0];
            const precioUnitario = typeof prod.precioUnitario === 'string' ? parseFloat(prod.precioUnitario) : prod.precioUnitario;
            const precioAnterior = typeof prod.precioAnterior === 'string' ? parseFloat(prod.precioAnterior) : prod.precioAnterior;
            const tieneDescuento = precioAnterior && precioAnterior > precioUnitario;
            const descuento = tieneDescuento ? Math.round(((precioAnterior! - precioUnitario!) / precioAnterior!) * 100) : 0;
            return (
              <div
                key={prod.id}
                className="relative bg-[#F8F8F8] rounded-xl border border-[#ECECEC] shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 w-[200px] flex flex-col items-center p-4 group overflow-hidden"
                style={{ minHeight: 300 }}
              >
                {/* Descuento */}
                {tieneDescuento && (
                  <span className="absolute left-4 top-4 bg-gradient-to-r from-[#D95B5B] to-[#FF8C6B] text-white text-xs font-extrabold px-2 py-0.5 rounded-md shadow drop-shadow-md border border-white/60 z-10">
                    -{descuento}%
                  </span>
                )}
                {/* Acciones arriba derecha */}
                <div className="absolute right-5 top-5 flex flex-col gap-2 z-20">
                  <button
                    className={`transition-all duration-200 h-9 w-9 rounded-full bg-white/90 backdrop-blur-md hover:bg-white hover:scale-110 shadow-lg flex items-center justify-center p-0 border-none
                      ${isFavorite(prod.id)
                        ? 'text-red-500 shadow-red-200 animate-pop-fav'
                        : 'text-[#525252] hover:text-[#CC9F53]'}
                    `}
                    aria-label={isFavorite(prod.id) ? 'Quitar de favoritos' : 'Añadir a favoritos'}
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
                  >
                    <Heart
                      className={`h-5 w-5 transition-all ${isFavorite(prod.id) ? 'fill-current scale-110' : ''}`}
                    />
                  </button>
                  <button
                    className="bg-white/90 hover:bg-[#F5EFD7] rounded-full p-1 border border-[#ECD8AB] shadow flex items-center justify-center hover:scale-110 transition-transform"
                    onClick={() => router.push(`/productos/${prod.id}?vista-rapida=1`)}
                    aria-label="Vista rápida"
                  >
                    <Eye className="w-4 h-4 text-[#CC9F53]" />
                  </button>
                </div>
                {/* Imagen */}
                <div className="w-28 h-28 flex items-center justify-center mb-4 rounded-2xl bg-[#FFF9EC] shadow-inner relative z-10 group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-300">
                  <Image
                    src={img?.url || '/images/product-placeholder.png'}
                    alt={img?.altText || prod.nombre}
                    width={112}
                    height={112}
                    className="object-contain max-h-28 rounded-xl drop-shadow-md group-hover:scale-110 group-hover:drop-shadow-xl transition-all duration-300"
                  />
                </div>
                {/* Nombre */}
                <div className="text-base font-bold text-center mb-2 min-h-[2.5em] line-clamp-2 text-[#2d2418] flex items-center justify-center w-full tracking-tight">
                  {prod.nombre}
                </div>
                {/* Precios */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[#B89D5A] font-bold text-lg">s/{precioUnitario?.toFixed(2)}</span>
                  {tieneDescuento && (
                    <span className="text-gray-400 line-through text-sm font-medium">s/{precioAnterior?.toFixed(2)}</span>
                  )}
                </div>
                {/* Botón */}
                <Button
                  className="w-full bg-gradient-to-r from-[#C59D5F] via-[#CC9F53] to-[#FFD795] hover:from-[#B88D42] hover:to-[#C59D5F] text-white font-extrabold py-2 rounded-xl text-base mt-auto shadow-lg active:scale-95 transition-all duration-150 tracking-tight"
                  onClick={() => router.push(`/productos/${prod.id}`)}
                >
                  Añadir al carrito
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
