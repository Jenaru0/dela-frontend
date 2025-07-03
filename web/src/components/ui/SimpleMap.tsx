'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MapPin, ExternalLink, Loader2 } from 'lucide-react';

interface SimpleMapProps {
  latitud?: number;
  longitud?: number;
  className?: string;
  zoom?: number;
}

export const SimpleMap: React.FC<SimpleMapProps> = ({
  latitud = -12.0463731, // Lima por defecto
  longitud = -77.0427934,
  className = 'w-full h-48',
  zoom = 15,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Validar coordenadas
  if (!latitud || !longitud || isNaN(latitud) || isNaN(longitud)) {
    return (
      <div className={`${className} border border-gray-300 rounded-lg overflow-hidden relative flex items-center justify-center bg-gray-50`}>
        <div className="text-center text-gray-500">
          <MapPin className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">Ubicación no disponible</p>
        </div>
      </div>
    );
  }

  // Usar MapTiler embebido para consistencia con el backend
  const mapTilerKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY || 'get_your_own_OpIi9ZULNHzrESv6T2vL';
  
  // Usar MapTiler en lugar de OpenStreetMap para consistencia
  const mapUrl = `https://api.maptiler.com/maps/streets-v2/static/${longitud},${latitud},${zoom}/400x300.png?key=${mapTilerKey}&marker=pin-s-marker+ff6b35(${longitud},${latitud})`;
  
  // URL para abrir en MapTiler Maps (o OpenStreetMap como fallback)
  const openMapUrl = `https://cloud.maptiler.com/maps/streets-v2/?lng=${longitud}&lat=${latitud}&z=${zoom}#${latitud}/${longitud}/${zoom}`;

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className={`${className} border border-gray-300 rounded-lg overflow-hidden relative flex items-center justify-center bg-gray-50`}>
        <div className="text-center text-gray-500">
          <MapPin className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">Error al cargar el mapa</p>
          <a 
            href={openMapUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-xs inline-flex items-center mt-1"
          >
            Ver en OpenStreetMap <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} border border-gray-300 rounded-lg overflow-hidden relative bg-gray-100`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <div className="text-center text-gray-500">
            <Loader2 className="h-6 w-6 mx-auto mb-2 animate-spin" />
            <p className="text-sm">Cargando mapa...</p>
          </div>
        </div>
      )}
      
      <Image
        src={mapUrl}
        alt="Mapa de ubicación"
        fill
        className="object-cover"
        onLoad={handleLoad}
        onError={handleError}
        unoptimized // Para APIs externas como MapTiler
      />
      
      {/* Coordenadas y botón para abrir */}
      <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
        <div className="bg-white/95 text-xs px-2 py-1 rounded shadow">
          📍 {latitud.toFixed(6)}, {longitud.toFixed(6)}
        </div>
        <a 
          href={openMapUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-white/95 hover:bg-white text-xs px-2 py-1 rounded shadow transition-colors inline-flex items-center"
          title="Abrir en OpenStreetMap"
        >
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
};
