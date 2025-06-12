export async function fetchCatalogoProductos() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/catalogo/productos`, {
  });
  if (!res.ok) throw new Error('Error al cargar productos');
  return res.json();
}

export async function fetchCatalogoProductoById(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/catalogo/productos/${id}`);
  if (!res.ok) throw new Error('Error al cargar producto');
  return res.json();
}