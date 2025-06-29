// Enums para Estados y Tipos
export enum TipoUsuario {
  CLIENTE = 'CLIENTE',
  ADMIN = 'ADMIN'
}

export enum EstadoPedido {
  PENDIENTE = 'PENDIENTE',
  CONFIRMADO = 'CONFIRMADO',
  PROCESANDO = 'PROCESANDO',
  ENVIADO = 'ENVIADO',
  ENTREGADO = 'ENTREGADO',
  CANCELADO = 'CANCELADO'
}

export enum MetodoPago {
  EFECTIVO = 'EFECTIVO',
  TARJETA_CREDITO = 'TARJETA_CREDITO',
  TARJETA_DEBITO = 'TARJETA_DEBITO',
  TRANSFERENCIA = 'TRANSFERENCIA',
  YAPE = 'YAPE',
  PLIN = 'PLIN'
}

export enum MetodoEnvio {
  RECOJO_TIENDA = 'RECOJO_TIENDA',
  DELIVERY = 'DELIVERY',
  ENVIO_NACIONAL = 'ENVIO_NACIONAL'
}

export enum EstadoPago {
  PENDIENTE = 'PENDIENTE',
  COMPLETADO = 'COMPLETADO',
  RECHAZADO = 'RECHAZADO',
  REEMBOLSADO = 'REEMBOLSADO'
}

export enum EstadoReclamo {
  ABIERTO = 'ABIERTO',
  EN_PROCESO = 'EN_PROCESO',
  RESUELTO = 'RESUELTO',
  RECHAZADO = 'RECHAZADO'
}

export enum TipoReclamo {
  DEMORA_ENTREGA = 'DEMORA_ENTREGA',
  PRODUCTO_DEFECTUOSO = 'PRODUCTO_DEFECTUOSO',
  PEDIDO_INCOMPLETO = 'PEDIDO_INCOMPLETO',
  COBRO_INCORRECTO = 'COBRO_INCORRECTO',
  SOLICITUD_CANCELACION = 'SOLICITUD_CANCELACION',
  SERVICIO_CLIENTE = 'SERVICIO_CLIENTE',
  OTRO = 'OTRO'
}

export const TipoReclamoLabels = {
  [TipoReclamo.DEMORA_ENTREGA]: 'Demora en Entrega',
  [TipoReclamo.PRODUCTO_DEFECTUOSO]: 'Producto Defectuoso',
  [TipoReclamo.PEDIDO_INCOMPLETO]: 'Pedido Incompleto',
  [TipoReclamo.COBRO_INCORRECTO]: 'Cobro Incorrecto',
  [TipoReclamo.SOLICITUD_CANCELACION]: 'Solicitud de Cancelación',
  [TipoReclamo.SERVICIO_CLIENTE]: 'Servicio al Cliente',
  [TipoReclamo.OTRO]: 'Otro'
};

export enum PrioridadReclamo {
  BAJA = 'BAJA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA',
  CRITICA = 'CRITICA'
}

export enum EstadoResena {
  PENDIENTE = 'PENDIENTE',
  APROBADO = 'APROBADO',
  RECHAZADO = 'RECHAZADO'
}

export enum TipoPromocion {
  PORCENTAJE = 'PORCENTAJE',
  MONTO_FIJO = 'MONTO_FIJO',
  ENVIO_GRATIS = 'ENVIO_GRATIS',
  PRODUCTO_GRATIS = 'PRODUCTO_GRATIS'
}

export enum EstadoPromocion {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
  EXPIRADO = 'EXPIRADO'
}

// Interfaces para los datos
export interface Pedido {
  id: number;
  numero: string;
  usuarioId: number;
  total: number;
  estado: EstadoPedido;
  metodoPago: MetodoPago;
  metodoEnvio: MetodoEnvio;
  estadoPago: EstadoPago;
  fechaCreacion: string;
  fechaActualizacion: string;
  direccionEnvio?: {
    direccion: string;
    distrito: string;
    provincia: string;
    departamento: string;
  };
  detalles?: {
    id: number;
    productoId: number;
    cantidad: number;
    precio: number;
    subtotal: number;
  }[];
  usuario?: {
    id: number;
    email: string;
    nombres: string;
    apellidos: string;
  };
}

export interface Reclamo {
  id: number;
  usuarioId: number;
  pedidoId?: number;
  tipo: string;
  descripcion: string;
  estado: EstadoReclamo;
  prioridad: PrioridadReclamo;
  fechaCreacion: string;
  fechaActualizacion: string;
  usuario?: {
    id: number;
    email: string;
    nombres: string;
    apellidos: string;
  };
  pedido?: Pedido;
}

export interface Resena {
  id: number;
  usuarioId: number;
  productoId: number;
  calificacion: number;
  comentario?: string;
  estado: EstadoResena;
  fechaCreacion: string;
  fechaActualizacion: string;
  usuario?: {
    id: number;
    email: string;
    nombres: string;
    apellidos: string;
  };
  producto?: {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
  };
}

// Helper functions para mostrar labels amigables
export const EstadoPedidoLabels = {
  [EstadoPedido.PENDIENTE]: 'Pendiente',
  [EstadoPedido.CONFIRMADO]: 'Confirmado',
  [EstadoPedido.PROCESANDO]: 'Procesando',
  [EstadoPedido.ENVIADO]: 'Enviado',
  [EstadoPedido.ENTREGADO]: 'Entregado',
  [EstadoPedido.CANCELADO]: 'Cancelado'
};

export const MetodoPagoLabels = {
  [MetodoPago.EFECTIVO]: 'Efectivo',
  [MetodoPago.TARJETA_CREDITO]: 'Tarjeta de Crédito',
  [MetodoPago.TARJETA_DEBITO]: 'Tarjeta de Débito',
  [MetodoPago.TRANSFERENCIA]: 'Transferencia Bancaria',
  [MetodoPago.YAPE]: 'Yape',
  [MetodoPago.PLIN]: 'Plin'
};

export const MetodoEnvioLabels = {
  [MetodoEnvio.RECOJO_TIENDA]: 'Recojo en tienda',
  [MetodoEnvio.DELIVERY]: 'Delivery',
  [MetodoEnvio.ENVIO_NACIONAL]: 'Envío nacional'
};

export const EstadoPagoLabels = {
  [EstadoPago.PENDIENTE]: 'Pendiente',
  [EstadoPago.COMPLETADO]: 'Completado',
  [EstadoPago.RECHAZADO]: 'Rechazado',
  [EstadoPago.REEMBOLSADO]: 'Reembolsado'
};

export const EstadoReclamoLabels = {
  [EstadoReclamo.ABIERTO]: 'Abierto',
  [EstadoReclamo.EN_PROCESO]: 'En proceso',
  [EstadoReclamo.RESUELTO]: 'Resuelto',
  [EstadoReclamo.RECHAZADO]: 'Rechazado'
};

export const PrioridadReclamoLabels = {
  [PrioridadReclamo.BAJA]: 'Baja',
  [PrioridadReclamo.MEDIA]: 'Media',
  [PrioridadReclamo.ALTA]: 'Alta',
  [PrioridadReclamo.CRITICA]: 'Crítica'
};

export const EstadoResenaLabels = {
  [EstadoResena.PENDIENTE]: 'Pendiente',
  [EstadoResena.APROBADO]: 'Aprobado',
  [EstadoResena.RECHAZADO]: 'Rechazado'
};

// Colores para los estados
export const EstadoPedidoColors = {
  [EstadoPedido.PENDIENTE]: 'bg-yellow-100 text-yellow-800',
  [EstadoPedido.CONFIRMADO]: 'bg-blue-100 text-blue-800',
  [EstadoPedido.PROCESANDO]: 'bg-orange-100 text-orange-800',
  [EstadoPedido.ENVIADO]: 'bg-purple-100 text-purple-800',
  [EstadoPedido.ENTREGADO]: 'bg-green-100 text-green-800',
  [EstadoPedido.CANCELADO]: 'bg-red-100 text-red-800'
};

export const EstadoPagoColors = {
  [EstadoPago.PENDIENTE]: 'bg-yellow-100 text-yellow-800',
  [EstadoPago.COMPLETADO]: 'bg-green-100 text-green-800',
  [EstadoPago.RECHAZADO]: 'bg-red-100 text-red-800',
  [EstadoPago.REEMBOLSADO]: 'bg-gray-100 text-gray-800'
};

export const EstadoReclamoColors = {
  [EstadoReclamo.ABIERTO]: 'bg-red-100 text-red-800',
  [EstadoReclamo.EN_PROCESO]: 'bg-yellow-100 text-yellow-800',
  [EstadoReclamo.RESUELTO]: 'bg-green-100 text-green-800',
  [EstadoReclamo.RECHAZADO]: 'bg-gray-100 text-gray-800'
};

export const PrioridadReclamoColors = {
  [PrioridadReclamo.BAJA]: 'bg-green-100 text-green-800',
  [PrioridadReclamo.MEDIA]: 'bg-yellow-100 text-yellow-800',
  [PrioridadReclamo.ALTA]: 'bg-orange-100 text-orange-800',
  [PrioridadReclamo.CRITICA]: 'bg-red-100 text-red-800'
};
