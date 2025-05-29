export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  discount?: number;
  // Propiedades adicionales para el catálogo completo
  description?: string;
  rating?: number;
  reviews?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  stock?: number;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Leche DELA - 100% leche pura de vaca',
    price: 4.5,
    image: 'https://dela.com.pe/img/tres_botellas-leche.png',
    category: 'Leche',
    description:
      'Leche fresca y natural, 100% pura de vaca, rica en calcio y proteínas.',
    isFeatured: true,
    stock: 50,
    rating: 4.8,
    reviews: 245,
  },
  {
    id: '2',
    name: 'Leche Chocolatada DELA - 100% leche pura de vaca',
    price: 5.2,
    image: 'https://dela.com.pe/img/tres_botellas-chocolatada.png',
    category: 'Leche',
    description:
      'Deliciosa leche chocolatada con el sabor auténtico del cacao.',
    stock: 45,
    rating: 4.7,
    reviews: 189,
  },
  {
    id: '3',
    name: 'Yogurt Frutado de Fresa DELA',
    price: 6.8,
    image: 'https://dela.com.pe/img/Three_yogurt_fresa.png',
    category: 'Yogurt',
    description:
      'Yogurt cremoso con trozos de fresa natural, rico en probióticos.',
    isNew: true,
    stock: 32,
    rating: 4.9,
    reviews: 156,
  },
  {
    id: '4',
    name: 'Yogurt Frutado de Pitahaya DELA',
    price: 7.5,
    image: 'https://dela.com.pe/img/tres_botellas-pitahaya.png',
    category: 'Yogurt',
    description:
      'Yogurt exótico con pitahaya, una fruta llena de antioxidantes.',
    stock: 28,
    rating: 4.6,
    reviews: 98,
  },
  {
    id: '5',
    name: 'Yogurt Frutado de Aguaymanto DELA',
    price: 7.2,
    image: 'https://dela.com.pe/img/tres_botellas-aguaymanto.png',
    category: 'Yogurt',
    description:
      'Yogurt con aguaymanto peruano, rico en vitamina C y antioxidantes.',
    stock: 30,
    rating: 4.5,
    reviews: 87,
  },
  {
    id: '6',
    name: 'Yogurt Griego con jalea de Arándanos',
    price: 9.5,
    oldPrice: 11.0,
    image: 'https://dela.com.pe/img/griego/griego-grande-arandanos.png',
    category: 'Yogurt',
    description: 'Yogurt griego espeso con deliciosa jalea de arándanos.',
    discount: 14,
    isFeatured: true,
    stock: 25,
    rating: 4.8,
    reviews: 203,
  },
  {
    id: '7',
    name: 'Yogurt Griego con jalea de Fresa',
    price: 9.2,
    oldPrice: 10.5,
    image: 'https://dela.com.pe/img/griego/griego-grande-fresa.png',
    category: 'Yogurt',
    description: 'Yogurt griego cremoso con jalea de fresa natural.',
    discount: 12,
    stock: 22,
    rating: 4.7,
    reviews: 178,
  },
  {
    id: '8',
    name: 'Helado de Fresa',
    price: 12.8,
    image: 'https://dela.com.pe/img/helado_fresa.jpg',
    category: 'Helados',
    description: 'Helado artesanal de fresa con trozos de fruta natural.',
    isNew: true,
    stock: 18,
    rating: 4.9,
    reviews: 134,
  },
  {
    id: '9',
    name: 'Helado de Arándano',
    price: 13.5,
    image: 'https://dela.com.pe/img/helado_arandanos.jpg',
    category: 'Helados',
    description: 'Helado cremoso de arándanos con antioxidantes naturales.',
    stock: 15,
    rating: 4.8,
    reviews: 112,
  },
  {
    id: '10',
    name: 'Helado de Maracuyá',
    price: 13.2,
    image: 'https://dela.com.pe/img/helado_maracuya.jpg',
    category: 'Helados',
    description:
      'Helado tropical de maracuyá con el sabor auténtico de la fruta.',
    isFeatured: true,
    stock: 20,
    rating: 4.9,
    reviews: 156,
  },
];
