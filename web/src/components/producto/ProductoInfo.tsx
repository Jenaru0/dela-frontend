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
  };  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Badge className="bg-[#CC9F53]/10 text-[#CC9F53] border-[#CC9F53]/20 text-sm px-3 py-1">
          {producto.categoria?.nombre || 'Sin categoría'}
        </Badge>
        <button
          onClick={handleFavorite}
          aria-label={isFavorite(producto.id) ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          className={`h-9 w-9 rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center ${
            isFavorite(producto.id)
              ? 'text-red-500 bg-red-50 hover:bg-red-100'
              : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
          }`}
        >
          <Heart className={`h-5 w-5 transition-all ${isFavorite(producto.id) ? 'fill-current' : ''}`} />
        </button>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
        {producto.nombre}
      </h1>
      
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-3xl font-bold text-[#CC9F53]">
          S/ {precioUnitario.toFixed(2)}
        </span>
        {hasDiscount && (
          <>
            <span className="line-through text-lg text-gray-400 font-medium">
              S/ {precioAnterior!.toFixed(2)}
            </span>
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-sm font-semibold">
              -{discount}% DE DESCUENTO
            </span>
          </>
        )}
      </div>

      {/* Información de Stock */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            producto.stock && producto.stock > 0 
              ? producto.stock <= 5 
                ? 'bg-orange-500' 
                : 'bg-green-500'
              : 'bg-red-500'
          }`}></div>
          <span className="text-sm font-medium text-gray-700">
            {producto.stock && producto.stock > 0 
              ? `${producto.stock} unidades disponibles`
              : 'Temporalmente agotado'
            }
          </span>
        </div>
        {producto.stock && producto.stock > 0 && producto.stock <= 5 && (
          <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-md text-xs font-semibold">
            ¡Últimas unidades!
          </span>
        )}
        {producto.stock && producto.stock > 10 && (
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-semibold">
            En stock
          </span>
        )}
      </div>
      
      <p className="text-gray-600 leading-relaxed">
        {producto.descripcion || 'Delicioso producto artesanal, hecho con calidad DELA.'}
      </p>
      
      <div className="flex flex-wrap gap-2">
        {producto.unidadMedida && (
          <span className="bg-gray-100 text-gray-700 rounded-lg px-3 py-1 text-sm font-medium">
            Unidad: {producto.unidadMedida}
          </span>
        )}
        {producto.peso && (
          <span className="bg-gray-100 text-gray-700 rounded-lg px-3 py-1 text-sm font-medium">
            Peso: {producto.peso} {producto.unidadMedida || ''}
          </span>
        )}
        {producto.destacado && (
          <span className="bg-yellow-100 text-yellow-700 rounded-lg px-3 py-1 text-sm font-semibold flex items-center gap-1">
            ⭐ Destacado
          </span>
        )}
      </div>
        {producto.infoNutricional && (
        <div className="mt-2">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Información nutricional</h3>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            {Object.entries(producto.infoNutricional).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="capitalize font-medium">{key}:</span>
                <span>{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
