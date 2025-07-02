import { Favorito } from '@/types/favorito';
import { authService } from '@/services/auth.service';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function getFavoritos(token: string): Promise<Favorito[]> {
  // Si no hay token, retornar array vacío
  if (!token) {
    return [];
  }

  try {
    const res = await authService.authenticatedFetch(`${API_URL}/favoritos`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      if (res.status === 401) {
        // Si es 401, retornar array vacío (la sesión ya fue limpiada por authenticatedFetch)
        return [];
      }
      throw new Error(`Error al cargar favoritos: ${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    // Si hay error de sesión expirada, retornar array vacío
    if (error instanceof Error && error.message.includes('Sesión expirada')) {
      return [];
    }
    throw error;
  }
}

export async function addFavorito(token: string, productoId: string | number) {
  // Si no hay token, no hacer nada
  if (!token) {
    throw new Error('Usuario no autenticado');
  }

  try {
    const res = await authService.authenticatedFetch(`${API_URL}/favoritos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productoId: Number(productoId) }),
    });
    
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Usuario no autenticado');
      }
      if (res.status === 409) {
        // El favorito ya existe, considerarlo como éxito
        console.log('El producto ya está en favoritos');
        return { mensaje: 'El producto ya está en favoritos' };
      }
      throw new Error('Error al agregar favorito');
    }
    return res.json();
  } catch (error) {
    if (error instanceof Error && error.message.includes('Sesión expirada')) {
      throw new Error('Tu sesión ha expirado. Por favor inicia sesión nuevamente');
    }
    throw error;
  }
}

export async function removeFavorito(token: string, productoId: string | number) {
  // Si no hay token, no hacer nada
  if (!token) {
    throw new Error('Usuario no autenticado');
  }

  try {
    const res = await authService.authenticatedFetch(`${API_URL}/favoritos/${productoId}`, {
      method: 'DELETE',
    });
    
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Usuario no autenticado');
      }
      if (res.status === 404) {
        // El favorito no existe, considerarlo como éxito
        console.log('El producto ya no está en favoritos');
        return { mensaje: 'El producto ya no está en favoritos' };
      }
      throw new Error('Error al eliminar favorito');
    }
    return res.json();
  } catch (error) {
    if (error instanceof Error && error.message.includes('Sesión expirada')) {
      throw new Error('Tu sesión ha expirado. Por favor inicia sesión nuevamente');
    }
    throw error;
  }
}