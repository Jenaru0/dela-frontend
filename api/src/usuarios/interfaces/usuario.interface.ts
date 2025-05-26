export interface Usuario {
  id: number;
  email: string;
  nombres?: string;
  apellidos?: string;
  celular?: string;
  tipoUsuarioId: number;
  eliminado: boolean;
  creadoEn: Date;
  actualizadoEn: Date;
}
