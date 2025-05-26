import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  IsOptional,
  IsInt,
} from 'class-validator';

// Este DTO valida los datos enviados al endpoint de registro.
// Si algo falla (correo mal escrito, contraseña muy corta, etc.), responde con un mensaje claro.
export class RegistroDto {
  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  contrasena: string;

  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @IsString({ message: 'El nombre debe ser un texto.' })
  nombres: string;

  @IsNotEmpty({ message: 'El apellido es obligatorio.' })
  @IsString({ message: 'El apellido debe ser un texto.' })
  apellidos: string;

  @IsOptional()
  @IsString({ message: 'El celular debe ser un texto.' })
  celular?: string;

  @IsNotEmpty({ message: 'El tipo de usuario es obligatorio.' })
  @IsInt({ message: 'El tipo de usuario debe ser un número entero.' })
  tipoUsuarioId: number;
}
