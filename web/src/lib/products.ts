export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  discount?: number;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Mermelada de Fresa Artesanal",
    price: 6.99,
    oldPrice: 8.99,
    image: "/images/product-1.png",
    category: "Conservas",
  },
  {
    id: "2",
    name: "Miel de Flores Silvestres",
    price: 9.99,
    image: "/images/product-2.png",
    category: "Dulces",
  },
  {
    id: "3",
    name: "Dulce de Leche Tradicional",
    price: 7.5,
    image: "/images/product-3.png",
    category: "Dulces",
  },
  {
    id: "4",
    name: "Licor de Café del Valle",
    price: 19.99,
    oldPrice: 24.99,
    image: "/images/product-4.png",
    category: "Bebidas",
  },
  {
    id: "5",
    name: "Galletas de Mantequilla",
    price: 5.99,
    image: "/images/product-5.png",
    category: "Dulces",
  },
  {
    id: "6",
    name: "Aceite de Oliva Extra Virgen",
    price: 12.99,
    image: "/images/product-6.png",
    category: "Conservas",
  },
];
