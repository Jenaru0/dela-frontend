import { useContext } from 'react';
import { FavoritoContext } from '@/contexts/FavoritoContext';

export const useFavorites = () => useContext(FavoritoContext);