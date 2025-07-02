/**
 * Utilidades para manejo de imágenes de productos
 * Garantiza consistencia en la obtención de imágenes principales
 */

export interface ProductImage {
  id?: number;
  url: string;
  altText?: string;
  principal: boolean;
  orden?: number;
}

export interface ProductWithImages {
  imagenes?: ProductImage[];
  image?: string; // Para compatibilidad con diferentes interfaces
}

/**
 * Obtiene la imagen principal de un producto de manera consistente
 * Siempre retorna la misma imagen principal sin importar el contexto
 */
export function getProductMainImage(product: ProductWithImages): string {
  const fallbackImage = '/images/product-fallback.svg';
  
  // Si el producto tiene una propiedad image directa, usarla
  if (product.image && product.image !== fallbackImage) {
    return product.image;
  }
  
  // Si tiene array de imágenes, buscar la principal
  if (Array.isArray(product.imagenes) && product.imagenes.length > 0) {
    // Buscar la imagen marcada como principal
    const principalImage = product.imagenes.find(img => img.principal === true);
    if (principalImage?.url) {
      return principalImage.url;
    }
    
    // Si no hay imagen principal marcada, tomar la primera imagen disponible
    const firstImage = product.imagenes.find(img => img.url);
    if (firstImage?.url) {
      return firstImage.url;
    }
  }
  
  // Fallback si no hay imágenes
  return fallbackImage;
}

/**
 * Obtiene el texto alternativo para la imagen principal
 */
export function getProductImageAlt(product: ProductWithImages, productName?: string): string {
  if (Array.isArray(product.imagenes) && product.imagenes.length > 0) {
    const principalImage = product.imagenes.find(img => img.principal === true);
    if (principalImage?.altText) {
      return principalImage.altText;
    }
    
    const firstImage = product.imagenes.find(img => img.url);
    if (firstImage?.altText) {
      return firstImage.altText;
    }
  }
  
  return productName ? `Imagen de ${productName}` : 'Imagen del producto';
}
