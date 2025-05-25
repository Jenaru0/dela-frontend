export interface Categoria {
  nombre: string;
  imagen: string;
}

export const categorias: Categoria[] = [
  { nombre: "Dulces", imagen: "/images/category-1.png" },
  { nombre: "Conservas", imagen: "/images/category-2.png" },
  { nombre: "Bebidas", imagen: "/images/category-3.png" },
  { nombre: "Artesanías", imagen: "/images/category-4.png" },
];
