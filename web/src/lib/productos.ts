export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  precioAnterior?: number;
  imagen: string;
  categoria: string;
}

export const productos: Producto[] = [
  {
    id: "1",
    nombre: "Mermelada de Fresa Artesanal",
    precio: 6.99,
    precioAnterior: 8.99,
    imagen: "/images/product-1.png",
    categoria: "Conservas",
  },
  {
    id: "2",
    nombre: "Miel de Flores Silvestres",
    precio: 9.99,
    imagen: "/images/product-2.png",
    categoria: "Dulces",
  },
  {
    id: "3",
    nombre: "Dulce de Leche Tradicional",
    precio: 7.5,
    imagen: "/images/product-3.png",
    categoria: "Dulces",
  },
  {
    id: "4",
    nombre: "Licor de Café del Valle",
    precio: 19.99,
    precioAnterior: 24.99,
    imagen: "/images/product-4.png",
    categoria: "Bebidas",
  },
  {
    id: "5",
    nombre: "Galletas de Mantequilla",
    precio: 5.99,
    imagen: "/images/product-5.png",
    categoria: "Dulces",
  },
  {
    id: "6",
    nombre: "Aceite de Oliva Extra Virgen",
    precio: 12.99,
    imagen: "/images/product-6.png",
    categoria: "Conservas",
  },
];
