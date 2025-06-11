import { useEffect, useState } from 'react';
import { fetchCatalogoProductos } from '@/services/catalogo.service';
import { Producto } from '@/types/productos';

// Adaptador para tu DTO real
type CatalogoCardProduct = {
  id: number | string;
  name: string;
  image: string;
  category: string;
  price?: number;
  priceFormatted?: string;
  shortDescription?: string;
  destacado?: boolean;
  disponible?: boolean;
};

function normalizaProducto(prod: Producto): CatalogoCardProduct {
  // Imagen principal: primero de "imagenes", luego "imagenUrl", si no, placeholder
  const image =
    (Array.isArray(prod.imagenes) &&
      prod.imagenes.find((img: { url?: string; principal?: boolean }) => img.principal)?.url) ||
    (Array.isArray(prod.imagenes) &&
      prod.imagenes.length > 0 &&
      prod.imagenes[0].url) ||
    (prod as { imagenUrl?: string }).imagenUrl ||
    '/images/product-placeholder.png';

  // Precio como número
  const precio =
    typeof prod.precioUnitario === 'string'
      ? parseFloat(prod.precioUnitario)
      : typeof prod.precioUnitario === 'number'
        ? prod.precioUnitario
        : undefined;

  return {
    id: prod.id,
    name: prod.nombre ?? 'Sin nombre',
    image,
    category: prod.categoria?.nombre ?? 'Sin categoría',
    price: precio,
    priceFormatted:
      typeof precio === 'number' ? `S/ ${precio.toFixed(2)}` : undefined,
    shortDescription: (prod as { descripcionCorta?: string; descripcion?: string }).descripcionCorta ?? prod.descripcion ?? '',
    destacado: !!prod.destacado,
    disponible: prod.stock === undefined ? undefined : prod.stock > 0,
  };
}

export function useCatalogo() {
  const [productos, setProductos] = useState<CatalogoCardProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCatalogoProductos()
      .then((prods) => {
        setProductos(Array.isArray(prods) ? prods.map(normalizaProducto) : []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { productos, loading, error };
}
