'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DireccionValidada } from '@/types/direcciones';
import { geocodingService } from '@/services/geocoding.service';
import { Input } from '@/components/ui/input';
import { MapPin, Search, AlertCircle, Loader2 } from 'lucide-react';

interface AddressAutocompleteProps {
  onDireccionSeleccionada: (direccion: DireccionValidada) => void;
  placeholder?: string;
  initialValue?: string;
  className?: string;
}

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  onDireccionSeleccionada,
  placeholder = 'Buscar dirección...',
  initialValue = '',
  className = '',
}) => {
  const [query, setQuery] = useState(initialValue);
  const [resultados, setResultados] = useState<DireccionValidada[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [direccionValidada, setDireccionValidada] = useState<DireccionValidada | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sincronizar con initialValue cuando cambie desde el padre
  const prevInitialValue = useRef(initialValue);
  useEffect(() => {
    // Si el initialValue cambia a vacío, resetear todo
    if (initialValue === '' && prevInitialValue.current !== '') {
      setQuery('');
      setResultados([]);
      setShowDropdown(false);
      setDireccionValidada(null);
      setSelectedIndex(-1);
    }
    // Solo actualizar si el valor es diferente al anterior y no está vacío
    else if (initialValue && initialValue !== prevInitialValue.current && initialValue !== query) {
      setQuery(initialValue);
      setDireccionValidada(null); // Reset validación cuando cambia externamente
    }
    prevInitialValue.current = initialValue;
  }, [initialValue, query]);

  // Buscar direcciones con debounce
  useEffect(() => {
    if (query.length >= 3) {
      setIsSearching(true);
      geocodingService.buscarDireccionesDebounced(
        query,
        (direcciones) => {
          setResultados(direcciones);
          setIsSearching(false);
          setShowDropdown(direcciones.length > 0);
          setSelectedIndex(-1);
        },
        300
      );
    } else {
      setResultados([]);
      setShowDropdown(false);
      setDireccionValidada(null);
    }
  }, [query]);

  // Manejar selección de dirección
  const seleccionarDireccion = async (direccion: DireccionValidada) => {
    setQuery(direccion.direccionCompleta);
    setDireccionValidada(direccion);
    setShowDropdown(false);
    setSelectedIndex(-1);
    onDireccionSeleccionada(direccion);
  };

  // Manejar teclas de navegación
  const manejarTeclas = (e: React.KeyboardEvent) => {
    if (!showDropdown || resultados.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < resultados.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : resultados.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < resultados.length) {
          seleccionarDireccion(resultados[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Input principal */}
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            // Limpiar validación cuando el usuario empieza a escribir
            if (direccionValidada) {
              setDireccionValidada(null);
            }
          }}
          onKeyDown={manejarTeclas}
          placeholder={placeholder}
          className={`pl-10 pr-4 ${direccionValidada ? 'border-green-500' : ''}`}
        />
        
        {/* Icono de búsqueda */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          {isSearching ? (
            <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>

      {/* Dropdown de resultados */}
      {showDropdown && resultados.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {resultados.map((direccion, index) => (
            <button
              key={direccion.mapTilerPlaceId || index}
              type="button"
              onClick={() => seleccionarDireccion(direccion)}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                index === selectedIndex ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {direccion.direccionCompleta}
                  </p>
                  <p className="text-sm text-gray-600">
                    {direccion.distrito}, {direccion.provincia}, {direccion.departamento}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-block w-2 h-2 rounded-full ${
                      direccion.confianza > 0.8 ? 'bg-green-500' : 
                      direccion.confianza > 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <span className="text-xs text-gray-500">
                      {Math.round(direccion.confianza * 100)}% de coincidencia
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Estado de carga */}
      {isSearching && query.length >= 3 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Buscando direcciones...</span>
          </div>
        </div>
      )}

      {/* Sin resultados */}
      {!isSearching && query.length >= 3 && resultados.length === 0 && showDropdown && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <div className="flex items-center gap-2 text-gray-600">
            <AlertCircle className="w-4 h-4" />
            <span>No se encontraron direcciones</span>
          </div>
        </div>
      )}
    </div>
  );
};
