export interface DireccionCliente {
  id: number;
  usuarioId: number;
  alias?: string;
  direccion: string;
  distrito?: string;
  provincia?: string;
  codigoPostal?: string;
  referencia?: string;
  predeterminada: boolean;
  activa: boolean;
  creadoEn?: string;
  actualizadoEn?: string;
}

export interface DireccionClienteConUsuario extends DireccionCliente {
  usuario: {
    id: number;
    nombres?: string;
    apellidos?: string;
    email: string;
  };
}

export interface CreateDireccionDto {
  alias?: string;
  direccion: string;
  distrito?: string;
  provincia?: string;
  codigoPostal?: string;
  referencia?: string;
  predeterminada?: boolean;
}

export interface UpdateDireccionDto {
  alias?: string;
  direccion?: string;
  distrito?: string;
  provincia?: string;
  codigoPostal?: string;
  referencia?: string;
  predeterminada?: boolean;
}

export interface ApiResponse<T> {
  mensaje: string;
  data: T;
}
