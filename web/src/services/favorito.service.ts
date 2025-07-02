import { Favorito } from '@/types/favorito';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function getFavoritos(token: string): Promise<Favorito[]> {
  // Si no hay token, retornar array vacío
  if (!token) {
    return [];
  }

  const res = await fetch(`${API_URL}/favoritos`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  
  if (!res.ok) {
    if (res.status === 401) {
      // Si es 401, retornar array vacío en lugar de lanzar error
      return [];
    }
    throw new Error(`Error al cargar favoritos: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function addFavorito(token: string, productoId: string | number) {
  // Si no hay token, no hacer nada
  if (!token) {
    throw new Error('Usuario no autenticado');
  }

  const res = await fetch(`${API_URL}/favoritos`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
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
}

export async function removeFavorito(token: string, productoId: string | number) {
  // Si no hay token, no hacer nada
  if (!token) {
    throw new Error('Usuario no autenticado');
  }

  const res = await fetch(`${API_URL}/favoritos/${productoId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
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
}