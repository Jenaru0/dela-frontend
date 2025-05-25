// src/productos/dto/producto.dto.ts
export class ProductoDto {
  id: number;
  nombre: string;
  sku: string;
  slug: string;
  descripcion?: string;
  descripcionCorta?: string;
  precioUnitario: number;
  stock: number;
  imagenUrl?: string;
  estado: 'ACTIVO' | 'INACTIVO';
  categoriaId: number;
}
