import Image from 'next/image';
import { useRef, useState } from 'react';
import type { Producto } from '@/types/productos';

interface ProductoGalleryProps {
  imagenes: NonNullable<Producto['imagenes']>;
  nombre: string;
}

export function ProductoGallery({ imagenes, nombre }: ProductoGalleryProps) {
  // Siempre inicia en la imagen principal si existe, si no la primera
  const principalIdx = imagenes.findIndex(img => img.principal);
  const [selected, setSelected] = useState(principalIdx !== -1 ? principalIdx : 0);
  const startX = useRef<number | null>(null);
  const dragging = useRef(false);
  const mouseStartX = useRef<number | null>(null);

  if (imagenes.length === 0) return null;

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    dragging.current = true;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging.current || startX.current === null) return;
    const diff = e.touches[0].clientX - startX.current;
    if (Math.abs(diff) > 50) {
      if (diff < 0 && selected < imagenes.length - 1) setSelected(selected + 1);
      if (diff > 0 && selected > 0) setSelected(selected - 1);
      dragging.current = false;
      startX.current = null;
    }
  };
  const handleTouchEnd = () => {
    dragging.current = false;
    startX.current = null;
  };

  // Mouse drag (desktop)
  const handleMouseDown = (e: React.MouseEvent) => {
    mouseStartX.current = e.clientX;
    dragging.current = true;
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current || mouseStartX.current === null) return;
    const diff = e.clientX - mouseStartX.current;
    if (Math.abs(diff) > 50) {
      if (diff < 0 && selected < imagenes.length - 1) setSelected(selected + 1);
      if (diff > 0 && selected > 0) setSelected(selected - 1);
      dragging.current = false;
      mouseStartX.current = null;
    }
  };
  const handleMouseUp = () => {
    dragging.current = false;
    mouseStartX.current = null;
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div
        className="relative w-full aspect-square bg-gradient-to-br from-[#FFF9EC] via-white to-[#FFF9EC]/80 rounded-2xl border border-[#ECD8AB]/60 shadow-inner overflow-hidden flex items-center justify-center group"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ userSelect: 'none', cursor: 'grab' }}
      >
        {/* Imagen con transición de opacidad suave, sin escalas ni rotaciones */}
        <Image
          src={imagenes[selected].url}
          alt={imagenes[selected].altText || nombre}
          fill
          className="object-contain p-8 transition-opacity duration-400 opacity-100"
          style={{ transition: 'opacity 0.4s' }}
          sizes="(max-width: 768px) 80vw, 320px"
          priority
        />
        {/* Chevron anterior */}
        {selected > 0 && (
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-[#CC9F53]/80 text-[#CC9F53] hover:text-white rounded-full shadow w-8 h-8 flex items-center justify-center z-10 border border-[#ECD8AB] opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-200"
            onClick={() => setSelected(selected - 1)}
            aria-label="Imagen anterior"
            tabIndex={0}
          >
            {/* Chevron SVG minimalista */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 16L8 10L13 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
        {/* Chevron siguiente */}
        {selected < imagenes.length - 1 && (
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-[#CC9F53]/80 text-[#CC9F53] hover:text-white rounded-full shadow w-8 h-8 flex items-center justify-center z-10 border border-[#ECD8AB] opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-200"
            onClick={() => setSelected(selected + 1)}
            aria-label="Imagen siguiente"
            tabIndex={0}
          >
            {/* Chevron SVG minimalista */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 4L12 10L7 16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
        {/* Paginador de puntos */}
        {imagenes.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {imagenes.map((img, idx) => (
              <button
                key={img.id}
                className={`w-2.5 h-2.5 rounded-full border-2 transition-all duration-200 ${
                  idx === selected
                    ? 'bg-[#CC9F53] border-[#CC9F53] scale-110 shadow'
                    : 'bg-white border-[#ECD8AB] opacity-70'
                }`}
                onClick={() => setSelected(idx)}
                aria-label={`Ver imagen ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      {imagenes[selected].altText && (
        <span className="text-xs text-[#A09574] mt-1 text-center block max-w-xs animate-fade-in">
          {imagenes[selected].altText}
        </span>
      )}
    </div>
  );
}
