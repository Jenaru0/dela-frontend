import { IsEmail, IsOptional, IsString, IsInt } from 'class-validator';

export class CreateUsuarioDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  nombres?: string;

  @IsOptional()
  @IsString()
  apellidos?: string;

  @IsOptional()
  @IsString()
  celular?: string;

  @IsInt()
  tipoUsuarioId: number;
}
