import { Favorito } from '@/types/favorito';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://delabackend.episundc.pe';

export async function getFavoritos(token: string): Promise<Favorito[]> {
  const res = await fetch(`${API_BASE_URL}/favoritos`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Error al cargar favoritos');
  return res.json();
}

export async function addFavorito(token: string, productoId: string | number) {
  const res = await fetch(`${API_BASE_URL}/favoritos`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productoId: Number(productoId) }),
  });
  if (!res.ok) throw new Error('Error al agregar favorito');
  return res.json();
}

export async function removeFavorito(
  token: string,
  productoId: string | number
) {
  const res = await fetch(`${API_BASE_URL}/favoritos/${productoId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Error al eliminar favorito');
  return res.json();
}
