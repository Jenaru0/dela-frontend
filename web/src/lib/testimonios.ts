export interface Testimonio {
  nombre: string;
  texto: string;
  calificacion: number;
}

export const testimonios: Testimonio[] = [
  {
    nombre: 'María Quispe',
    texto:
      'La Leche DELA Premium es simplemente excepcional. Tiene un sabor fresco que me recuerda a la leche de mi abuela en Cerro Azul.',
    calificacion: 5,
  },
  {
    nombre: 'Carlos Mendoza',
    texto:
      'Como chef, valoro mucho la calidad de los lácteos. El Queso Fresco DELA es perfecto para mis recetas tradicionales peruanas.',
    calificacion: 5,
  },
  {
    nombre: 'Ana Fernández',
    texto:
      'El Yogurt Griego DELA es mi favorito para los desayunos. Tiene la consistencia perfecta y un sabor natural incomparable.',
    calificacion: 4,
  },
];
