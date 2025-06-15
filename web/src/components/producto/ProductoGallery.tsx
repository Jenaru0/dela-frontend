import Image from 'next/image';
import { useRef, useState } from 'react';
import type { Producto } from '@/types/productos';

interface ProductoGalleryProps {
  imagenes: NonNullable<Producto['imagenes']>;
  nombre: string;
}

export function ProductoGallery({ imagenes, nombre }: ProductoGalleryProps) {  // Función para validar si una URL es válida
  const isValidUrl = (url: string): boolean => {
    try {
      // Verificar que no sea una cadena vacía o null/undefined
      if (!url || url.trim() === '' || url === 'undefined' || url === 'null') {
        return false;
      }
      
      // Si es una URL relativa (empieza con /), es válida
      if (url.startsWith('/')) {
        return true;
      }
      
      // Si es una URL absoluta, verificar que sea válida
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Filtrar imágenes válidas (que tengan URL válida)
  const imagenesValidasRaw = imagenes.filter(img => 
    img.url && isValidUrl(img.url)
  );

  // Ordenar para que la imagen principal vaya primero
  const imagenesValidas = imagenesValidasRaw.sort((a, b) => {
    if (a.principal && !b.principal) return -1; // a va primero
    if (!a.principal && b.principal) return 1;  // b va primero
    return 0; // mantener orden original
  });

  // Como la imagen principal ahora siempre es la primera (índice 0), iniciamos en 0
  const [selected, setSelected] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const startX = useRef<number | null>(null);
  const dragging = useRef(false);
  const mouseStartX = useRef<number | null>(null);// Manejar errores de carga de imagen
  const handleImageError = (index: number) => {
    console.warn(`Error al cargar imagen ${index + 1} del producto "${nombre}":`, imagenesValidas[index]?.url);
    setImageErrors(prev => new Set([...prev, index]));
  };  // Obtener URL de imagen con fallback
  const getImageSrc = (imagen: NonNullable<Producto['imagenes']>[0], index: number) => {
    if (imageErrors.has(index)) {
      return 'https://res.cloudinary.com/dfi3n7r3g/image/upload/producto-sin-imagen_nvlo6w'; // Imagen de fallback
    }
    
    // Verificar si la URL es válida usando nuestra función
    const url = imagen.url;
    if (!isValidUrl(url)) {
      console.warn(`URL inválida detectada para imagen ${index + 1} del producto "${nombre}":`, url);
      return 'https://res.cloudinary.com/dfi3n7r3g/image/upload/producto-sin-imagen_nvlo6w';
    }
    
    return url;
  };
  // Si no hay imágenes válidas, mostrar placeholder
  if (imagenesValidas.length === 0) {
    return (
      <div className="flex flex-col gap-6 w-full">
        <div className="relative w-full aspect-square bg-gray-100 rounded-2xl border border-gray-200 shadow-lg overflow-hidden flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-4"></div>
            <p className="text-gray-500 text-sm">Sin imagen disponible</p>
          </div>
        </div>
      </div>
    );
  }

  const hasMultipleImages = imagenesValidas.length > 1;

  // Swipe handlers - solo activos si hay múltiples imágenes
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!hasMultipleImages) return;
    startX.current = e.touches[0].clientX;
    dragging.current = true;
  };
    const handleTouchMove = (e: React.TouchEvent) => {
    if (!hasMultipleImages || !dragging.current || startX.current === null) return;
    const diff = e.touches[0].clientX - startX.current;
    if (Math.abs(diff) > 50) {
      if (diff < 0 && selected < imagenesValidas.length - 1) setSelected(selected + 1);
      if (diff > 0 && selected > 0) setSelected(selected - 1);
      dragging.current = false;
      startX.current = null;
    }
  };
  
  const handleTouchEnd = () => {
    dragging.current = false;
    startX.current = null;
  };

  // Mouse drag (desktop) - solo activo si hay múltiples imágenes
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!hasMultipleImages) return;
    mouseStartX.current = e.clientX;
    dragging.current = true;
  };
    const handleMouseMove = (e: React.MouseEvent) => {
    if (!hasMultipleImages || !dragging.current || mouseStartX.current === null) return;
    const diff = e.clientX - mouseStartX.current;
    if (Math.abs(diff) > 50) {
      if (diff < 0 && selected < imagenesValidas.length - 1) setSelected(selected + 1);
      if (diff > 0 && selected > 0) setSelected(selected - 1);
      dragging.current = false;
      mouseStartX.current = null;
    }
  };
  
  const handleMouseUp = () => {
    dragging.current = false;
    mouseStartX.current = null;
  };  return (
    <div className="flex flex-col gap-6 w-full">      <div
        className={`relative w-full aspect-square bg-gray-50 rounded-2xl border border-gray-200 shadow-lg overflow-hidden flex items-center justify-center group ${
          hasMultipleImages ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ userSelect: 'none' }}
      >        {/* Imagen principal */}
        <div className="relative w-full h-full p-8 z-10">
          {/* Solo renderizar Image si la URL es válida */}
          {isValidUrl(getImageSrc(imagenesValidas[selected], selected)) ? (
            <Image
              src={getImageSrc(imagenesValidas[selected], selected)}
              alt={imagenesValidas[selected].altText || nombre}
              fill
              className="object-contain transition-all duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 80vw, 500px"
              priority
              onError={() => handleImageError(selected)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-4"></div>
                <p className="text-gray-500 text-sm">Imagen no disponible</p>
              </div>
            </div>
          )}
        </div>
          {/* Controles de navegación - Solo si hay múltiples imágenes */}
        {hasMultipleImages && (
          <>
            {/* Botón anterior */}
            {selected > 0 && (
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-[#CC9F53] text-[#CC9F53] hover:text-white rounded-full shadow-md w-10 h-10 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-300"
                onClick={() => setSelected(selected - 1)}
                aria-label="Imagen anterior"
                tabIndex={0}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
            
            {/* Botón siguiente */}
            {selected < imagenesValidas.length - 1 && (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-[#CC9F53] text-[#CC9F53] hover:text-white rounded-full shadow-md w-10 h-10 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-300"
                onClick={() => setSelected(selected + 1)}
                aria-label="Imagen siguiente"
                tabIndex={0}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
            
            {/* Indicadores de posición */}            {imagenesValidas.length > 2 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {imagenesValidas.map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      idx === selected 
                        ? 'bg-[#CC9F53] scale-125 shadow-lg' 
                        : 'bg-white/60 hover:bg-white/80 hover:scale-110'
                    }`}
                    onClick={() => setSelected(idx)}
                    aria-label={`Ver imagen ${idx + 1}`}
                  />
                ))}
              </div>
            )}
            
            {/* Contador de imágenes */}
            <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium z-20">
              {selected + 1} / {imagenesValidas.length}
            </div>
          </>
        )}
      </div>      
      {/* Thumbnails para escritorio - Adaptativo según cantidad de imágenes */}
      {hasMultipleImages && (        <div className={`hidden sm:flex gap-3 ${
          imagenesValidas.length === 2 ? 'justify-center' : 
          imagenesValidas.length <= 4 ? 'justify-center' : 
          'justify-start overflow-x-auto pb-2'
        }`}>
          {imagenesValidas.map((imagen, idx) => (
            <button
              key={idx}              className={`relative flex-shrink-0 rounded-xl border-2 overflow-hidden transition-all duration-300 group/thumb ${
                imagenesValidas.length === 2 ? 'w-24 h-24' : 'w-20 h-20'
              } ${
                idx === selected 
                  ? 'border-[#CC9F53] shadow-lg scale-105' 
                  : 'border-gray-200 hover:border-[#CC9F53]/50 hover:scale-105'
              }`}
              onClick={() => setSelected(idx)}
              aria-label={`Ver imagen ${idx + 1} de ${imagenesValidas.length}`}            >
              {/* Solo renderizar Image si la URL es válida */}
              {isValidUrl(getImageSrc(imagen, idx)) ? (
                <Image
                  src={getImageSrc(imagen, idx)}
                  alt={imagen.altText || `${nombre} ${idx + 1}`}
                  width={imagenesValidas.length === 2 ? 96 : 80}
                  height={imagenesValidas.length === 2 ? 96 : 80}
                  className="w-full h-full object-cover transition-all duration-300 group-hover/thumb:scale-110"
                  onError={() => handleImageError(idx)}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <div className="text-gray-400 text-xs text-center">
                    Sin imagen
                  </div>
                </div>
              )}
              {idx === selected && (
                <div className="absolute inset-0 bg-[#CC9F53]/20 flex items-center justify-center">
                  <div className="w-2 h-2 bg-[#CC9F53] rounded-full"></div>
                </div>
              )}              {/* Número de imagen para productos con muchas imágenes */}
              {imagenesValidas.length > 4 && (
                <div className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1 rounded">
                  {idx + 1}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}