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
    <div className="flex-1 flex flex-col gap-2 sm:gap-3 md:gap-5 text-center lg:text-left">
      <div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-2">
        <Badge className="bg-[#CC9F53]/20 text-[#CC9F53] w-max text-xs sm:text-sm px-2 sm:px-3 py-1">
          {producto.categoria?.nombre || 'Sin categoría'}
        </Badge>
        <button
          onClick={handleFavorite}
          aria-label={isFavorite(producto.id) ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          className={`h-7 w-7 sm:h-9 sm:w-9 rounded-full bg-white/90 backdrop-blur-md transition-all duration-200 hover:bg-white hover:scale-110 shadow-lg flex items-center justify-center p-0 border-none
            ${isFavorite(producto.id)
              ? 'text-red-500 shadow-red-200 animate-pop-fav'
              : 'text-[#525252] hover:text-[#CC9F53]'}
          `}
        >
          <Heart className={`h-3 w-3 sm:h-5 sm:w-5 transition-all ${isFavorite(producto.id) ? 'fill-current scale-110' : ''}`} />
        </button>
      </div>

      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#232323] mb-1 leading-tight">
        {producto.nombre}
      </h1>
      
      <div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-3 md:gap-5 mb-2 flex-wrap">
        <span className="text-xl sm:text-2xl md:text-3xl font-bold text-[#CC9F53]">
          S/ {precioUnitario.toFixed(2)}
        </span>
        {hasDiscount && (
          <span className="line-through text-base sm:text-lg text-gray-400 font-medium">
            S/ {precioAnterior!.toFixed(2)}
          </span>
        )}
        {hasDiscount && (
          <span className="text-green-600 font-bold text-sm sm:text-base">
            -{discount}%
          </span>
        )}
      </div>
      
      <p className="text-gray-700 text-sm sm:text-base mb-3 leading-relaxed max-w-lg mx-auto lg:mx-0">
        {producto.descripcion || 'Delicioso producto artesanal, hecho con calidad DELA.'}
      </p>
      
      <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 justify-center lg:justify-start">
        {producto.unidadMedida && (
          <span className="inline-block bg-[#F5EFD7] text-[#A09574] rounded-full px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold">
            Unidad: {producto.unidadMedida}
          </span>
        )}
        {producto.peso && (
          <span className="inline-block bg-[#F5EFD7] text-[#A09574] rounded-full px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold">
            Peso: {producto.peso} {producto.unidadMedida || ''}
          </span>
        )}
        {producto.destacado && (
          <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 rounded-full px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold">
            ⭐ Destacado
          </span>
        )}
      </div>
      
      {producto.infoNutricional && (
        <div className="mt-3 sm:mt-4 text-center lg:text-left">
          <h3 className="text-xs sm:text-sm font-bold text-[#CC9F53] mb-1 sm:mb-2">Información nutricional</h3>
          <ul className="text-[10px] sm:text-xs text-[#7B7261] grid grid-cols-1 sm:grid-cols-2 gap-x-2 sm:gap-x-4 gap-y-1 max-w-md mx-auto lg:mx-0">
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
