import { Producto } from './productos';

export interface Favorito {
  id: number;
  usuarioId: number;
  productoId: number;
  producto: Producto;
}