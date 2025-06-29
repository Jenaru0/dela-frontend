export interface Categoria {
  nombre: string;
  imagen: string;
}

export const categorias: Categoria[] = [
  { nombre: 'Leche DELA', imagen: '/images/categories/lacteos.svg' },
  { nombre: 'Yogurt DELA', imagen: '/images/categories/mieles.svg' },
  { nombre: 'Quesos DELA', imagen: '/images/categories/conservas.svg' },
  { nombre: 'Helados DELA', imagen: '/images/categories/mermeladas.svg' },
];
