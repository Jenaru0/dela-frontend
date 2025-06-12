// Tipos para el panel de administración

export interface AdminStats {
  totalUsuarios: number;
  usuariosClientes: number;
  usuariosAdmin: number;
  totalProductos: number;
  totalPedidos: number;
  totalReclamos: number;
}

export interface Direccion {
  id: number;
  nombre: string;
  direccion: string;
  distrito: string;
  referencia?: string;
  telefono?: string;
  tipoDireccion: 'DOMICILIO' | 'TRABAJO' | 'OTRO';
  usuarioId: number;
  usuario?: {
    nombres: string;
    apellidos: string;
    email: string;
  };
  creadoEn: Date;
  actualizadoEn: Date;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  activo: boolean;
  destacado: boolean;
  categoriaId?: number;
  categoria?: {
    id: number;
    nombre: string;
  };
  creadoEn: Date;
  actualizadoEn: Date;
}

export interface Pedido {
  id: number;
  numero: string;
  total: number;
  estado: 'PENDIENTE' | 'CONFIRMADO' | 'EN_PREPARACION' | 'EN_CAMINO' | 'ENTREGADO' | 'CANCELADO';
  usuarioId: number;
  usuario?: {
    nombres: string;
    apellidos: string;
    email: string;
  };
  items?: Array<{
    id: number;
    cantidad: number;
    precio: number;
    producto: {
      nombre: string;
    };
  }>;
  creadoEn: Date;
  actualizadoEn: Date;
}

export interface Reclamo {
  id: number;
  titulo: string;
  descripcion: string;
  tipoReclamo: 'PRODUCTO_DEFECTUOSO' | 'ENTREGA_TARDÍA' | 'SERVICIO_CLIENTE' | 'OTRO';
  estado: 'ABIERTO' | 'EN_PROCESO' | 'RESUELTO' | 'RECHAZADO';
  prioridad: 'ALTA' | 'MEDIA' | 'BAJA';
  usuarioId: number;
  usuario?: {
    nombres: string;
    apellidos: string;
    email: string;
  };
  creadoEn: Date;
  actualizadoEn: Date;
}

export interface Resena {
  id: number;
  puntuacion: number;
  comentario?: string;
  estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
  usuarioId: number;
  usuario?: {
    nombres: string;
    apellidos: string;
    email: string;
  };
  productoId: number;
  producto?: {
    nombre: string;
    categoria?: {
      nombre: string;
    };
  };
  creadoEn: Date;
  actualizadoEn: Date;
}

export interface NewsletterSuscriptor {
  id: number;
  email: string;
  activo: boolean;
  ultimaActividad?: Date;
  creadoEn: Date;
  actualizadoEn: Date;
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  activa: boolean;
  _count?: {
    productos: number;
  };
  creadoEn: Date;
  actualizadoEn: Date;
}
