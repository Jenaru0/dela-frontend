// Interfaces de autenticación basadas en el backend
export interface UsuarioResponse {
  id: number;
  email: string;
  nombres?: string;
  apellidos?: string;
  celular?: string;
  tipoUsuario: 'CLIENTE' | 'ADMIN';
  creadoEn?: string;
  actualizadoEn?: string;
}

export interface RespuestaRegistro {
  mensaje: string;
  usuario: UsuarioResponse;
}

export interface RespuestaInicioSesion {
  mensaje: string;
  token_acceso: string;
  refresh_token: string;
  usuario: UsuarioResponse;
}

export interface RespuestaRefreshToken {
  mensaje: string;
  token_acceso: string;
  refresh_token: string;
}

export interface RefreshTokenDto {
  refresh_token: string;
}

// DTOs para las requests
export interface InicioSesionDto {
  email: string;
  contrasena: string;
}

export interface RegistroDto {
  email: string;
  contrasena: string;
  nombres: string;
  apellidos: string;
  celular?: string;
  tipoUsuario?: 'CLIENTE' | 'ADMIN';
}

export interface RegistroFormDto extends RegistroDto {
  confirmarContrasena: string;
}

// Tipos para el estado de autenticación
export interface AuthState {
  usuario: UsuarioResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Respuesta de logout
export interface RespuestaLogout {
  mensaje: string;
}

// RegistroForm para el formulario de registro con confirmarContrasena
export interface RegistroForm extends RegistroDto {
  confirmarContrasena: string;
}
