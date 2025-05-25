export interface Testimonio {
  nombre: string;
  texto: string;
  calificacion: number;
}

export const testimonios: Testimonio[] = [
  {
    nombre: "María González",
    texto:
      "Los productos de DELA son simplemente excepcionales. El sabor auténtico me transporta a mi infancia.",
    calificacion: 5,
  },
  {
    nombre: "Carlos Rodríguez",
    texto:
      "La calidad es incomparable. Cada producto refleja el cuidado y la pasión con la que están elaborados.",
    calificacion: 5,
  },
  {
    nombre: "Laura Martínez",
    texto:
      "He probado muchos productos artesanales, pero los de DELA están en otro nivel. ¡Totalmente recomendados!",
    calificacion: 4,
  },
];
