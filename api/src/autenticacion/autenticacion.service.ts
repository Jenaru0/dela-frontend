import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegistroDto } from './dto/registro.dto';
import { InicioSesionDto } from './dto/inicio-sesion.dto';
import {
  RespuestaRegistro,
  RespuestaInicioSesion,
} from './interfaces/respuestas.interface';

@Injectable()
export class AutenticacionService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async registrar(dto: RegistroDto): Promise<RespuestaRegistro> {
    const usuarioExistente = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });
    if (usuarioExistente)
      throw new ConflictException(
        'El correo ya está registrado. Usa otro o recupera tu contraseña.',
      );

    if (dto.contrasena.length < 6)
      throw new BadRequestException(
        'La contraseña debe tener al menos 6 caracteres.',
      );

    const usuario = await this.prisma.usuario.create({
      data: {
        email: dto.email,
        nombres: dto.nombres,
        apellidos: dto.apellidos,
        celular: dto.celular,
        tipoUsuarioId: dto.tipoUsuarioId,
      },
    });

    const hash = await bcrypt.hash(dto.contrasena, 12);
    await this.prisma.usuarioAuth.create({
      data: {
        usuarioId: usuario.id,
        contrasena: hash,
      },
    });

    return {
      mensaje: '¡Registro exitoso! Ahora puedes iniciar sesión.',
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombres: usuario.nombres || '',
        apellidos: usuario.apellidos || '',
        tipoUsuarioId: usuario.tipoUsuarioId,
      },
    };
  }

  async iniciarSesion(dto: InicioSesionDto): Promise<RespuestaInicioSesion> {
    if (dto.contrasena.length < 6)
      throw new BadRequestException(
        'La contraseña debe tener al menos 6 caracteres.',
      );

    const usuario = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
      include: { auth: true },
    });

    if (!usuario)
      throw new UnauthorizedException(
        'El correo electrónico no está registrado.',
      );
    if (!usuario.auth)
      throw new UnauthorizedException(
        'Error de autenticación interna, comunícate con soporte.',
      );

    const valido = await bcrypt.compare(
      dto.contrasena,
      usuario.auth.contrasena,
    );
    if (!valido)
      throw new UnauthorizedException(
        'La contraseña es incorrecta. Verifica y vuelve a intentarlo.',
      );

    const payload = {
      sub: usuario.id,
      email: usuario.email,
      tipoUsuarioId: usuario.tipoUsuarioId,
    };
    const token = this.jwtService.sign(payload);

    await this.prisma.usuarioAuth.update({
      where: { usuarioId: usuario.id },
      data: { ultimoAcceso: new Date() },
    });

    return {
      mensaje: 'Inicio de sesión exitoso.',
      token_acceso: token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombres: usuario.nombres || '',
        apellidos: usuario.apellidos || '',
        tipoUsuarioId: usuario.tipoUsuarioId,
      },
    };
  }
}
