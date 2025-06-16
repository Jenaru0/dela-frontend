'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, X } from 'lucide-react';
import { useCatalogo } from '@/hooks/useCatalogo';

interface SearchSuggestion {
  id: string | number;
  name: string;
  category: string;
  image: string;
  type: 'product';
}

interface SmartSearchBarProps {
  className?: string;
  placeholder?: string;
}

const SmartSearchBar: React.FC<SmartSearchBarProps> = ({
  className = '',
  placeholder = 'Buscar productos...'
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { productos } = useCatalogo();

  // Filtrar sugerencias basadas en la consulta
  useEffect(() => {
    if (query.trim().length >= 2) {
      const filtered = productos
        .filter(producto => 
          producto.name.toLowerCase().includes(query.toLowerCase()) ||
          producto.category.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 6) // Mostrar máximo 6 sugerencias
        .map(producto => ({
          id: producto.id,
          name: producto.name,
          category: producto.category,
          image: producto.image,
          type: 'product' as const
        }));
      
      setSuggestions(filtered);
      setIsOpen(filtered.length > 0);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  }, [query, productos]);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Manejar navegación con teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter') {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Ir a la página de productos con filtro de búsqueda
  const handleSearch = () => {
    if (query.trim()) {
      setIsOpen(false);
      setQuery('');
      router.push(`/productos?search=${encodeURIComponent(query.trim())}`);
    }
  };

  // Ir directamente al producto seleccionado
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setIsOpen(false);
    setQuery('');
    router.push(`/productos/${suggestion.id}`);
  };

  // Limpiar búsqueda
  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Input de búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          className="w-full pl-10 pr-10 py-2 border border-[#E6D5A8] rounded-full focus:outline-none focus:ring-2 focus:ring-[#CC9F53] focus:border-transparent transition-all duration-200"
        />
        
        {/* Botón limpiar */}
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Sugerencias */}
      {isOpen && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                index === selectedIndex 
                  ? 'bg-[#CC9F53]/10 border-l-4 border-[#CC9F53]' 
                  : 'hover:bg-gray-50'
              }`}
            >              {/* Imagen del producto */}
              <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                <Image
                  src={suggestion.image}
                  alt={suggestion.name}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Información del producto */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {suggestion.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {suggestion.category}
                </p>
              </div>
              
              {/* Icono de búsqueda */}
              <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
            </div>
          ))}
          
          {/* Opción para ver todos los resultados */}
          <div
            onClick={handleSearch}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-t border-gray-100 transition-colors ${
              selectedIndex === suggestions.length 
                ? 'bg-[#CC9F53]/10 border-l-4 border-[#CC9F53]' 
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="w-10 h-10 rounded-md bg-[#CC9F53]/10 flex items-center justify-center flex-shrink-0">
              <Search className="h-5 w-5 text-[#CC9F53]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Ver todos los resultados para &quot;{query}&quot;
              </p>
              <p className="text-xs text-gray-500">
                Buscar en todos los productos
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartSearchBar;
