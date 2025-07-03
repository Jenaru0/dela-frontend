'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Favorito } from '@/types/favorito';
import { useAuth } from './AuthContext';
import { getFavoritos, addFavorito, removeFavorito } from '@/services/favorito.service';

interface FavoritoContextType {
  favorites: Favorito[];
  addFavorite: (productoId: string | number) => Promise<void>;
  removeFavorite: (productoId: string | number) => Promise<void>;
  isFavorite: (productoId: string | number) => boolean;
  refreshFavorites: () => void;
  isLoading: boolean;
}

export const FavoritoContext = createContext<FavoritoContextType>({
  favorites: [],
  addFavorite: async () => {},
  removeFavorite: async () => {},
  isFavorite: () => false,
  refreshFavorites: () => {},
  isLoading: false,
});

export const FavoritoProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, token } = useAuth();
  const [favorites, setFavorites] = useState<Favorito[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Manejar la hidratación
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  const fetchFavoritos = async () => {
    if (!isAuthenticated || !token || !isHydrated) {
      setFavorites([]);
      return;
    }
    setIsLoading(true);
    try {
      const favs = await getFavoritos(token);
      setFavorites(favs);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      // If it's an auth error, clear favorites
      if (error instanceof Error && error.message.includes('401')) {
        setFavorites([]);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isHydrated) {
      fetchFavoritos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, token, isHydrated]);

  const refreshFavorites = fetchFavoritos;

  const addFavorite = async (productoId: string | number) => {
    if (!token) return;
    
    // Actualización optimista: añadir inmediatamente a la UI
    const tempFavorito: Favorito = {
      id: Date.now(), // ID temporal usando timestamp
      usuarioId: 0, // Se llenará desde el backend
      productoId: typeof productoId === 'string' ? parseInt(productoId) : productoId,
      producto: {
        id: typeof productoId === 'string' ? parseInt(productoId) : productoId,
        nombre: 'Cargando...',
        slug: '',
        descripcion: '',
        precioUnitario: 0,
        stock: 0,
        destacado: false,
        categoria: { id: 0, nombre: '' },
        imagenes: []
      }
    };
    
    setFavorites(prev => [...prev, tempFavorito]);
    
    try {
      await addFavorito(token, productoId);
      // Actualizar con los datos reales del servidor
      await fetchFavoritos();
    } catch (error) {
      // Rollback en caso de error: remover el favorito temporal
      setFavorites(prev => prev.filter(fav => fav.id !== tempFavorito.id));
      console.error('Error adding favorite:', error);
    }
  };

  const removeFavorite = async (productoId: string | number) => {
    if (!token) return;
    
    // Encontrar el favorito a eliminar
    const productoIdNum = typeof productoId === 'string' ? parseInt(productoId) : productoId;
    const favoritoToRemove = favorites.find(fav => fav.productoId === productoIdNum);
    if (!favoritoToRemove) return;
    
    // Actualización optimista: remover inmediatamente de la UI
    setFavorites(prev => prev.filter(fav => fav.productoId !== productoIdNum));
    
    try {
      await removeFavorito(token, productoId);
      // No necesitamos refetch aquí ya que la actualización optimista es suficiente
    } catch (error) {
      // Rollback en caso de error: restaurar el favorito
      setFavorites(prev => [...prev, favoritoToRemove]);
      console.error('Error removing favorite:', error);
    }
  };

  const isFavorite = (productoId: string | number) => {
    const productoIdNum = typeof productoId === 'string' ? parseInt(productoId) : productoId;
    return favorites.some((fav) => fav.productoId === productoIdNum);
  };

  return (
    <FavoritoContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, refreshFavorites, isLoading }}>
      {children}
    </FavoritoContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritoContext);