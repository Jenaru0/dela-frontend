export interface Usuario {
  id: number;
  email: string;
  nombres?: string;
  apellidos?: string;
  celular?: string;
  tipoUsuario: 'CLIENTE' | 'ADMIN';
  activo?: boolean;
  creadoEn?: string;
  actualizadoEn?: string;
}

export interface CreateUsuarioDto {
  email: string;
  contrasena: string;
  nombres?: string;
  apellidos?: string;
  celular?: string;
  tipoUsuario?: 'CLIENTE' | 'ADMIN';
}

export interface UpdateUsuarioDto {
  email?: string;
  nombres?: string;
  apellidos?: string;
  celular?: string;
  tipoUsuario?: 'CLIENTE' | 'ADMIN';
}

export interface TipoUsuario {
  id: number;
  nombre: string;
  descripcion?: string;
}
