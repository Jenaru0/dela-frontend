import React, { useState } from 'react';
import { ProductoAdmin } from '@/services/productos-admin.service';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import {
  X,
  Package,
  Calendar,
  Star,
  Weight,
  Eye,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Heart,
} from 'lucide-react';

interface EnhancedProductoDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  producto: ProductoAdmin;
}

const EnhancedProductoDetailModal: React.FC<
  EnhancedProductoDetailModalProps
> = ({ isOpen, onClose, producto }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Log temporal para debug
  React.useEffect(() => {
    if (producto && isOpen) {
      console.log('🔍 Datos del producto en modal:', {
        id: producto.id,
        nombre: producto.nombre,
        _count: producto._count,
        favoritos: producto.favoritos,
        reviews: producto.reviews,
      });
    }
  }, [producto, isOpen]);// Helper para validar URLs de imágenes
  const getValidImageUrl = (url: string | null | undefined): string => {
    if (!url || url.trim() === '') {
      return '/images/product-fallback.svg';
    }
    try {
      // Verificar si es una URL válida
      new URL(url);
      return url;
    } catch {
      // Si no es una URL válida, usar fallback
      return '/images/product-fallback.svg';
    }
  };

  // Bloquear scroll del body cuando el modal esté abierto
  React.useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [isOpen]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(price);
  };

  const getStockStatus = () => {
    if (producto.stock === 0) {
      return {
        label: 'Sin Stock',
        color: 'text-red-600 bg-red-50 border-red-200',
        icon: AlertTriangle,
      };
    } else if (producto.stock <= (producto.stockMinimo || 5)) {
      return {
        label: 'Stock Bajo',
        color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
        icon: AlertTriangle,
      };
    } else {
      return {
        label: 'En Stock',
        color: 'text-green-600 bg-green-50 border-green-200',
        icon: CheckCircle,
      };
    }
  };
  const stockStatus = getStockStatus();
  const imagenPrincipal =
    producto.imagenes?.find(
      (img) => img.principal && img.url && img.url.trim() !== ''
    ) || producto.imagenes?.find((img) => img.url && img.url.trim() !== '');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#ecd8ab]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#CC9F53] to-[#b08a3c] rounded-xl flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#3A3A3A]">
                Detalles del Producto
              </h2>
              <p className="text-sm text-[#9A8C61]">Información completa</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#F5E6C6]/30 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#9A8C61]" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Columna izquierda - Imágenes y información básica */}
            <div className="space-y-6">
              {/* Galería de imágenes */}
              <div className="space-y-4">
                <div className="aspect-square bg-[#F5E6C6]/20 rounded-xl overflow-hidden relative">
                  {' '}
                  {imagenPrincipal ? (
                    <Image
                      src={getValidImageUrl(
                        producto.imagenes?.[selectedImageIndex]?.url ||
                          imagenPrincipal.url
                      )}
                      alt={producto.nombre}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/product-fallback.svg';
                      }}
                    />
                  ) : null}
                  <div
                    className={`absolute inset-0 flex items-center justify-center ${
                      imagenPrincipal ? 'hidden' : ''
                    }`}
                  >
                    <Package className="w-16 h-16 text-[#CC9F53]/50" />
                  </div>
                </div>
                {/* Miniaturas */}{' '}
                {producto.imagenes &&
                  producto.imagenes.filter(
                    (img) => img.url && img.url.trim() !== ''
                  ).length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {producto.imagenes
                        .filter((img) => img.url && img.url.trim() !== '')
                        .map((imagen, index) => (
                          <button
                            key={imagen.id}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                              index === selectedImageIndex
                                ? 'border-[#CC9F53]'
                                : 'border-[#ecd8ab]/50 hover:border-[#CC9F53]/50'
                            }`}
                          >
                            {' '}
                            <Image
                              src={getValidImageUrl(imagen.url)}
                              alt={producto.nombre}
                              width={64}
                              height={64}
                              className="object-cover w-full h-full"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/images/product-fallback.svg';
                              }}
                            />
                          </button>
                        ))}
                    </div>
                  )}
              </div>

              {/* Información básica */}
              <div className="bg-[#F5E6C6]/10 rounded-xl p-6">
                <h3 className="text-xl font-bold text-[#3A3A3A] mb-4">
                  {producto.nombre}
                </h3>                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[#9A8C61]">SKU:</span>
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-[#3A3A3A]">
                      {producto.sku}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#9A8C61]">Slug:</span>
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-[#3A3A3A]">
                      {producto.slug}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#9A8C61]">Categoría:</span>
                    <span className="text-[#3A3A3A]">
                      {producto.categoria?.nombre}
                    </span>
                  </div>{' '}
                  <div className="flex items-center justify-between">
                    <span className="text-[#9A8C61]">Estado:</span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        producto.estado === 'ACTIVO'
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : producto.estado === 'AGOTADO'
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : 'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}
                    >
                      {producto.estado === 'ACTIVO'
                        ? 'Activo'
                        : producto.estado === 'AGOTADO'
                        ? 'Agotado'
                        : 'Inactivo'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#9A8C61]">Stock:</span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${stockStatus.color}`}
                    >
                      <stockStatus.icon className="w-3 h-3 mr-1" />
                      {producto.stock} unidades
                    </span>
                  </div>                  {producto.peso && (
                    <div className="flex items-center justify-between">
                      <span className="text-[#9A8C61] flex items-center">
                        <Weight className="w-4 h-4 mr-1" />
                        Peso:
                      </span>
                      <span className="text-[#3A3A3A]">
                        {producto.peso} {producto.unidadMedida || 'unidades'}
                      </span>
                    </div>
                  )}
                </div>                {/* Badges */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {producto.destacado && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <Star className="w-3 h-3 mr-1" />
                      Destacado
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Columna derecha - Precios, stock y métricas */}
            <div className="space-y-6">
              {/* Precios */}
              <div className="bg-white border border-[#ecd8ab]/30 rounded-xl p-6">
                {' '}
                <h4 className="text-lg font-semibold text-[#3A3A3A] mb-4 flex items-center">
                  Precios
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[#9A8C61]">Precio Actual:</span>
                    <span className="text-2xl font-bold text-[#CC9F53]">
                      {formatPrice(producto.precioUnitario)}
                    </span>
                  </div>

                  {producto.precioAnterior &&
                    producto.precioAnterior > producto.precioUnitario && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#9A8C61]">Precio Anterior:</span>
                        <span className="text-lg text-gray-500 line-through">
                          {formatPrice(producto.precioAnterior)}
                        </span>
                      </div>
                    )}

                  {producto.precioAnterior &&
                    producto.precioAnterior > producto.precioUnitario && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-red-600 font-medium">
                            Descuento:
                          </span>
                          <span className="text-red-600 font-bold">
                            {formatPrice(
                              producto.precioAnterior - producto.precioUnitario
                            )}
                            (
                            {Math.round(
                              ((producto.precioAnterior -
                                producto.precioUnitario) /
                                producto.precioAnterior) *
                                100
                            )}
                            %)
                          </span>
                        </div>
                      </div>
                    )}
                </div>
              </div>

              {/* Stock y logística */}
              <div className="bg-white border border-[#ecd8ab]/30 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-[#3A3A3A] mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-[#CC9F53]" />
                  Stock y Logística
                </h4>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#F5E6C6]/20 rounded-lg p-3">
                      <p className="text-sm text-[#9A8C61]">Stock Actual</p>
                      <p className="text-xl font-bold text-[#3A3A3A]">
                        {producto.stock}
                      </p>
                    </div>
                    <div className="bg-[#F5E6C6]/20 rounded-lg p-3">
                      <p className="text-sm text-[#9A8C61]">Stock Mínimo</p>
                      <p className="text-xl font-bold text-[#3A3A3A]">
                        {producto.stockMinimo || 5}
                      </p>
                    </div>
                  </div>

                  {producto.stock <= (producto.stockMinimo || 5) &&
                    producto.stock > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-yellow-800 text-sm font-medium">
                          ⚠️ Stock bajo - Considera reabastecer pronto
                        </p>
                      </div>
                    )}

                  {producto.stock === 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-800 text-sm font-medium">
                        🚫 Producto agotado - Requiere reabastecimiento urgente
                      </p>
                    </div>
                  )}
                </div>
              </div>              {/* Estadísticas */}
              <div className="bg-white border border-[#ecd8ab]/30 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-[#3A3A3A] mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-[#CC9F53]" />
                  Estadísticas
                </h4>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[#9A8C61]">Reviews:</span>
                    <span className="text-[#3A3A3A] flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500" />
                      {producto._count?.reviews || 0} reseñas
                      {producto.reviews && producto.reviews.length > 0 && (
                        <span className="ml-2 text-sm text-[#9A8C61]">
                          (⭐ {(producto.reviews.reduce((acc, review) => acc + review.calificacion, 0) / producto.reviews.length).toFixed(1)})
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#9A8C61]">Favoritos:</span>
                    <span className="text-[#3A3A3A] flex items-center">
                      <Heart className="w-4 h-4 mr-1 text-red-500" />
                      {producto._count?.favoritos || 0} usuarios
                    </span>
                  </div>

                  {/* Mostrar algunas reseñas recientes si existen */}
                  {producto.reviews && producto.reviews.length > 0 && (
                    <div className="pt-3 border-t border-[#ecd8ab]/30">
                      <p className="text-sm font-medium text-[#9A8C61] mb-2">Reseñas recientes:</p>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {producto.reviews.slice(0, 3).map((review) => (
                          <div key={review.id} className="bg-[#F5E6C6]/10 rounded-lg p-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-[#3A3A3A]">
                                {review.usuario.nombres} {review.usuario.apellidos}
                              </span>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < review.calificacion 
                                        ? 'text-yellow-400 fill-current' 
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            {review.comentario && (
                              <p className="text-xs text-[#9A8C61] line-clamp-2">
                                {review.comentario}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-[#9A8C61]">Ventas del mes:</span>
                    <span className="text-[#3A3A3A] flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
                      N/A
                    </span>
                  </div>
                </div>
              </div>

              {/* Fechas */}
              <div className="bg-white border border-[#ecd8ab]/30 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-[#3A3A3A] mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-[#CC9F53]" />
                  Información de Fechas
                </h4>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[#9A8C61]">Creado:</span>
                    <span className="text-[#3A3A3A]">
                      {new Date(producto.creadoEn).toLocaleDateString('es-PE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#9A8C61]">
                      Última actualización:
                    </span>
                    <span className="text-[#3A3A3A]">
                      {new Date(producto.actualizadoEn).toLocaleDateString(
                        'es-PE',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Descripción completa */}
          {producto.descripcion && (
            <div className="mt-8 bg-white border border-[#ecd8ab]/30 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-[#3A3A3A] mb-4">
                Descripción
              </h4>
              <p className="text-[#3A3A3A] leading-relaxed whitespace-pre-wrap">
                {producto.descripcion}
              </p>
            </div>
          )}

          {/* Footer con acciones */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-[#ecd8ab]/30">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-[#CC9F53] text-[#CC9F53] hover:bg-[#CC9F53] hover:text-white"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedProductoDetailModal;
