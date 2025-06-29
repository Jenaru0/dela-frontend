'use client';

import { useState, useEffect } from 'react';
import { categoriasService, Categoria } from '@/services/categorias.service';

interface CategoryWithImage extends Categoria {
  image: string;
  productCount: number;
  description?: string;
  featured?: boolean;
}

interface UseCategoriesReturn {
  categories: CategoryWithImage[];
  loading: boolean;
  error: string | null;
}

// Mapeo de imágenes fallback (solo se usan si no hay imagen en la BD)
const categoryImages: { [key: string]: string } = {
  'leche': '/images/categories/leche.jpg',
  'yogurt': '/images/categories/yogurt.jpg',
  'queso': '/images/categories/queso.jpg',
  'quesos': '/images/categories/queso.jpg',
  'helado': '/images/categories/helado.jpg',
  'helados': '/images/categories/helado.jpg',
  'mantequilla': '/images/categories/mantequilla.jpg',
  'crema': '/images/categories/crema.jpg',
  'default': '/images/categories/default.jpg'
};

export const useCategories = () => {
  const [state, setState] = useState<UseCategoriesReturn>({
    categories: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));        const response = await categoriasService.obtenerActivas();
        const categorias = response.data;        // Transformar las categorías del backend al formato esperado por el componente
        const transformedCategories: CategoryWithImage[] = categorias
          .sort((a, b) => a.nombre.localeCompare(b.nombre)) // Ordenar por nombre ascendente
          .map((categoria, index) => {
            // Priorizar la imagen del backend
            let image = categoria.imagenUrl;
            
            // Si no hay imagen en el backend, usar fallback
            if (!image) {
              const slugLower = categoria.slug.toLowerCase();
              const nombreLower = categoria.nombre.toLowerCase();
              image = categoryImages[slugLower] || 
                     categoryImages[nombreLower] || 
                     categoryImages['default'];
            }
            
            // Usar descripción del backend si está disponible
            const description = categoria.descripcion || 
                              `Productos de ${categoria.nombre}`;

            return {
              ...categoria,
              image,
              description,
              productCount: categoria._count?.productos || 0,
              featured: index < 4, // Las primeras 4 como destacadas (después del ordenamiento)
            };
          });

        setState({
          categories: transformedCategories,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error al obtener categorías:', error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Error al cargar categorías',
        }));
      }
    };

    fetchCategories();
  }, []);

  return state;
};
