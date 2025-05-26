export class PaginacionDto<T> {
  datos: T[];
  paginacion: {
    paginaActual: number;
    totalPaginas: number;
    totalElementos: number;
    elementosPorPagina: number;
    tienePaginaAnterior: boolean;
    tienePaginaSiguiente: boolean;
  };

  constructor(
    datos: T[],
    paginaActual: number,
    limite: number,
    totalElementos: number,
  ) {
    this.datos = datos;
    this.paginacion = {
      paginaActual,
      totalPaginas: Math.ceil(totalElementos / limite),
      totalElementos,
      elementosPorPagina: limite,
      tienePaginaAnterior: paginaActual > 1,
      tienePaginaSiguiente: paginaActual < Math.ceil(totalElementos / limite),
    };
  }
}
