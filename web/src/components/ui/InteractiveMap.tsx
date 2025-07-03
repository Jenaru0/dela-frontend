'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { Button } from './Button';
import { MapPin, Loader2 } from 'lucide-react';

interface InteractiveMapProps {
  latitud?: number;
  longitud?: number;
  onLocationChange?: (lat: number, lng: number, address?: string) => void;
  className?: string;
  zoom?: number;
  allowDrag?: boolean;
  showConfirmButton?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  latitud = -12.0463731, // Lima por defecto
  longitud = -77.0427934,
  onLocationChange,
  className = 'w-full h-64',
  zoom = 15,
  allowDrag = true,
  showConfirmButton = false,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const marker = useRef<maptilersdk.Marker | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [currentLat, setCurrentLat] = useState(latitud);
  const [currentLng, setCurrentLng] = useState(longitud);
  const [currentAddress, setCurrentAddress] = useState('');
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Configurar MapTiler
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;
    if (apiKey && apiKey !== 'tu_api_key_aqui' && apiKey !== 'ABCDEEEEFFF') {
      maptilersdk.config.apiKey = apiKey;
    } else {
      console.warn('⚠️ API Key de MapTiler no configurada o usando valor de ejemplo');
      setMapError('API Key de MapTiler no configurada correctamente');
    }
  }, []);

  // Geocodificación inversa para obtener dirección desde coordenadas
  const obtenerDireccionDesdeCoordenadas = useCallback(async (lat: number, lng: number) => {
    if (isReverseGeocoding) return '';
    
    setIsReverseGeocoding(true);
    try {
      // Verificar conectividad del backend
      const backendUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!backendUrl) {
        console.warn('⚠️ URL del backend no configurada');
        return '';
      }

      const response = await fetch(`${backendUrl}/geocoding/reverse?lat=${lat}&lng=${lng}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          'Content-Type': 'application/json',
        },
        // Timeout para evitar esperas indefinidas
        signal: AbortSignal.timeout(10000),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.direccionCompleta) {
          setCurrentAddress(data.data.direccionCompleta);
          return data.data.direccionCompleta;
        }
      } else {
        console.warn('⚠️ Backend no disponible o error en geocodificación:', response.status);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'TimeoutError') {
        console.warn('⚠️ Timeout en conexión con backend');
      } else {
        console.warn('⚠️ Error en geocodificación inversa:', error);
      }
    } finally {
      setIsReverseGeocoding(false);
    }
    return '';
  }, [isReverseGeocoding]);

  // Inicializar el mapa
  useEffect(() => {
    if (!mapContainer.current || map.current || mapError) return;

    try {
      // Configurar el estilo usando la API key
      const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;
      const styleUrl = apiKey && apiKey !== 'ABCDEEEEFFF' && apiKey !== 'tu_api_key_aqui'
        ? `https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`
        : 'https://api.maptiler.com/maps/streets-v2/style.json';

      const newMap = new maptilersdk.Map({
        container: mapContainer.current,
        style: styleUrl,
        center: [currentLng, currentLat],
        zoom: zoom,
        // Configuraciones mejoradas para evitar warnings
        attributionControl: false,
        cooperativeGestures: false,
        // No agregar controles automáticamente
        geolocateControl: false,
        navigationControl: false, 
        fullscreenControl: false,
        scaleControl: false,
        terrainControl: false,
      });

      // Esperar a que el mapa cargue
      newMap.on('load', () => {
        setIsMapReady(true);
        
        // Agregar controles básicos de navegación
        try {
          const navigationControl = new maptilersdk.NavigationControl({
            showCompass: true,
            showZoom: true,
          });
          newMap.addControl(navigationControl, 'top-right');
        } catch (error) {
          console.warn('⚠️ No se pudo agregar control de navegación:', error);
        }

        // Agregar control de geolocalización
        try {
          const geolocateControl = new maptilersdk.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 60000,
            },
            trackUserLocation: false,
            showAccuracyCircle: false,
          });
          newMap.addControl(geolocateControl, 'top-right');
          
          // Escuchar eventos de geolocalización
          geolocateControl.on('geolocate', async (e) => {
            const lat = e.coords.latitude;
            const lng = e.coords.longitude;
            
            setCurrentLat(lat);
            setCurrentLng(lng);
            
            // Mover marcador a la nueva ubicación
            if (marker.current) {
              marker.current.setLngLat([lng, lat]);
            }
            
            // Obtener dirección de la nueva ubicación
            const address = await obtenerDireccionDesdeCoordenadas(lat, lng);
            
            // Notificar el cambio al componente padre
            if (onLocationChange) {
              onLocationChange(lat, lng, address);
            }
          });

          geolocateControl.on('error', (e) => {
            console.warn('⚠️ Error de geolocalización:', e.message || e);
          });
        } catch (error) {
          console.warn('⚠️ No se pudo agregar control de geolocalización:', error);
        }

        // Crear marcador personalizado
        const markerElement = document.createElement('div');
        markerElement.className = 'custom-marker';
        markerElement.style.cssText = `
          width: 20px;
          height: 20px;
          background: #2563eb;
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          cursor: ${allowDrag ? 'grab' : 'pointer'};
        `;

        // Crear marcador
        const newMarker = new maptilersdk.Marker({
          element: markerElement,
          draggable: allowDrag,
        })
          .setLngLat([currentLng, currentLat])
          .addTo(newMap);

        // Manejar arrastre del marcador
        if (allowDrag) {
          newMarker.on('dragstart', () => {
            markerElement.style.cursor = 'grabbing';
            setIsDragging(true);
          });
          
          newMarker.on('dragend', async () => {
            markerElement.style.cursor = 'grab';
            const lngLat = newMarker.getLngLat();
            setCurrentLat(lngLat.lat);
            setCurrentLng(lngLat.lng);
            
            // Obtener dirección de las nuevas coordenadas
            const address = await obtenerDireccionDesdeCoordenadas(lngLat.lat, lngLat.lng);
            
            // Notificar el cambio
            if (onLocationChange) {
              onLocationChange(lngLat.lat, lngLat.lng, address);
            }
            
            // Reset drag state
            setTimeout(() => {
              setIsDragging(false);
            }, 100);
          });
        }

        marker.current = newMarker;
      });

      map.current = newMap;
    } catch (error) {
      console.error('Error al inicializar el mapa:', error);
      setMapError('Error al cargar el mapa');
    }

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [currentLat, currentLng, zoom, allowDrag, obtenerDireccionDesdeCoordenadas, onLocationChange, mapError]);

  // Actualizar posición del marcador cuando cambien las coordenadas desde el padre
  useEffect(() => {
    // No actualizar si el usuario está arrastrando el marcador
    if (isDragging) return;
    
    // Actualizar solo si hay cambios significativos en las coordenadas Y las coordenadas son válidas
    if (marker.current && map.current && isMapReady && latitud !== undefined && longitud !== undefined) {
      const newLat = latitud;
      const newLng = longitud;
      
      // Verificar si hay un cambio significativo (más de 0.0001 grados ~ 10 metros)
      const latDiff = Math.abs(newLat - currentLat);
      const lngDiff = Math.abs(newLng - currentLng);
      
      if (latDiff > 0.0001 || lngDiff > 0.0001) {
        setCurrentLat(newLat);
        setCurrentLng(newLng);
        marker.current.setLngLat([newLng, newLat]);
        map.current.setCenter([newLng, newLat]);
        
        // Limpiar la dirección actual para que se actualice con la nueva ubicación
        setCurrentAddress('');
      }
    }
  }, [latitud, longitud, currentLat, currentLng, isDragging, isMapReady]);

  // Confirmar ubicación seleccionada
  const confirmarUbicacion = () => {
    if (onLocationChange) {
      onLocationChange(currentLat, currentLng, currentAddress);
    }
  };

  // Si hay error con la API key, mostrar mensaje
  if (mapError) {
    return (
      <div className={`${className} border border-gray-300 rounded-lg overflow-hidden relative flex items-center justify-center bg-red-50`}>
        <div className="text-center text-red-600 p-4">
          <MapPin className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm font-medium mb-2">Error del Mapa</p>
          <p className="text-xs">{mapError}</p>
          <p className="text-xs mt-2">Verifica tu configuración de API Key</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative border border-gray-300 rounded-lg overflow-hidden bg-gray-100`}>
      {/* Contenedor del mapa */}
      <div 
        ref={mapContainer} 
        className="w-full h-full [&_.maplibregl-ctrl-logo]:hidden [&_.maptiler-logo]:hidden"
        style={{
          // CSS básico para ocultar logos
          '--map-controls': `
            .maplibregl-ctrl-logo,
            .maptiler-logo {
              display: none !important;
            }
          `
        } as React.CSSProperties & { '--map-controls': string }}
      />
      
      {/* Loading overlay */}
      {!isMapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <div className="text-center text-gray-500">
            <Loader2 className="h-6 w-6 mx-auto mb-2 animate-spin" />
            <p className="text-sm">Cargando mapa...</p>
          </div>
        </div>
      )}
      
      {/* Información de coordenadas - Compacta y posicionada para no tapar controles */}
      {isMapReady && (
        <div className="absolute top-2 left-2 z-10 max-w-[calc(100%-1rem)]">
          <div className="bg-white/95 text-xs px-2 py-1.5 rounded shadow-lg border">
            <div className="flex items-center space-x-2">
              <MapPin className="h-3 w-3 text-blue-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                {currentAddress ? (
                  <div className="text-gray-700 truncate font-medium" title={currentAddress}>
                    {currentAddress}
                  </div>
                ) : (
                  <div className="text-gray-600">
                    {Number(currentLat).toFixed(4)}, {Number(currentLng).toFixed(4)}
                  </div>
                )}
                {isReverseGeocoding && (
                  <div className="text-blue-600 flex items-center">
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    <span>Buscando...</span>
                  </div>
                )}
              </div>
              
              {/* Botón de confirmar (si está habilitado) */}
              {showConfirmButton && (
                <Button
                  type="button"
                  size="sm"
                  onClick={confirmarUbicacion}
                  className="flex-shrink-0"
                >
                  Confirmar
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
