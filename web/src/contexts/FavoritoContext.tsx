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
    try {
      await addFavorito(token, productoId);
      await fetchFavoritos();
    } catch {
      // Error silenciado
    }
  };

  const removeFavorite = async (productoId: string | number) => {
    if (!token) return;
    try {
      await removeFavorito(token, productoId);
      await fetchFavoritos();
    } catch {
      // Error silenciado
    }
  };

  const isFavorite = (productoId: string | number) => {
    return favorites.some((fav) => fav.productoId.toString() === productoId.toString());
  };

  return (
    <FavoritoContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, refreshFavorites, isLoading }}>
      {children}
    </FavoritoContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritoContext);