import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthModalGlobal } from '@/contexts/AuthModalContext';
import { useFavorites } from '@/contexts/FavoritoContext';
import type { Producto } from '@/types/productos';
import { Heart } from 'lucide-react';

interface ProductoInfoProps {
  producto: Producto;
  precioUnitario: number;
  precioAnterior?: number;
  hasDiscount: boolean;
  discount: number;
}

export function ProductoInfo({ producto, precioUnitario, precioAnterior, hasDiscount, discount }: ProductoInfoProps) {
  const { isAuthenticated } = useAuth();
  const { open: openAuthModal } = useAuthModalGlobal();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    if (isFavorite(producto.id)) {
      await removeFavorite(producto.id);
    } else {
      await addFavorite(producto.id);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-2 md:gap-5">
      <div className="flex items-center gap-3 mb-2">
        <Badge className="bg-[#CC9F53]/20 text-[#CC9F53] w-max">
          {producto.categoria?.nombre || 'Sin categoría'}
        </Badge>
        <button
          onClick={handleFavorite}
          aria-label={isFavorite(producto.id) ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          className={`ml-1 h-9 w-9 rounded-full bg-white/90 backdrop-blur-md transition-all duration-200 hover:bg-white hover:scale-110 shadow-lg flex items-center justify-center p-0 border-none
            ${isFavorite(producto.id)
              ? 'text-red-500 shadow-red-200 animate-pop-fav'
              : 'text-[#525252] hover:text-[#CC9F53]'}
          `}
        >
          <Heart className={`h-5 w-5 transition-all ${isFavorite(producto.id) ? 'fill-current scale-110' : ''}`} />
        </button>
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold text-[#232323] mb-1">
        {producto.nombre}
      </h1>
      <div className="flex items-center gap-5 mb-2">
        <span className="text-2xl md:text-3xl font-bold text-[#CC9F53]">
          S/ {precioUnitario.toFixed(2)}
        </span>
        {hasDiscount && (
          <span className="line-through text-lg text-gray-400 font-medium">
            S/ {precioAnterior!.toFixed(2)}
          </span>
        )}
        {hasDiscount && (
          <span className="text-green-600 font-bold text-base ml-2">
            -{discount}%
          </span>
        )}
      </div>
      <p className="text-gray-700 text-base mb-3 leading-relaxed">
        {producto.descripcion || 'Delicioso producto artesanal, hecho con calidad DELA.'}
      </p>
      <div className="flex flex-wrap gap-2 mt-2">
        {producto.unidadMedida && (
          <span className="inline-block bg-[#F5EFD7] text-[#A09574] rounded-full px-3 py-1 text-xs font-semibold">
            Unidad: {producto.unidadMedida}
          </span>
        )}
        {producto.peso && (
          <span className="inline-block bg-[#F5EFD7] text-[#A09574] rounded-full px-3 py-1 text-xs font-semibold">
            Peso: {producto.peso} {producto.unidadMedida || ''}
          </span>
        )}
        {producto.destacado && (
          <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 rounded-full px-3 py-1 text-xs font-semibold">
            ⭐ Destacado
          </span>
        )}
      </div>
      {producto.infoNutricional && (
        <div className="mt-4">
          <h3 className="text-sm font-bold text-[#CC9F53] mb-1">Información nutricional</h3>
          <ul className="text-xs text-[#7B7261] grid grid-cols-2 gap-x-4 gap-y-1">
            {Object.entries(producto.infoNutricional).map(([key, value]) => (
              <li key={key} className="capitalize">
                <b>{key}:</b> {String(value)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
