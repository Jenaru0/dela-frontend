import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUsuarioDto) {
    // Solo verifica por email, ya que findUnique solo acepta campos únicos
    const existe: any = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });
    // Si existe y no está eliminado, lanza error
    if (existe && existe.eliminado === false)
      throw new ConflictException('El correo ya está registrado.');
    return this.prisma.usuario.create({ data: dto });
  }

  findAll() {
    // Solo usuarios no eliminados
    return this.prisma.usuario.findMany({
      where: { AND: [{ eliminado: false }] },
    });
  }

  findOne(id: number) {
    // Solo si no está eliminado
    return this.prisma.usuario.findFirst({
      where: { AND: [{ id }, { eliminado: false }] },
    });
  }

  async update(id: number, dto: UpdateUsuarioDto) {
    const usuario = await this.prisma.usuario.findFirst({
      where: { AND: [{ id }, { eliminado: false }] },
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return this.prisma.usuario.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    const usuario = await this.prisma.usuario.findFirst({
      where: { AND: [{ id }, { eliminado: false }] },
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    // Soft delete: actualiza el campo eliminado a true
    return this.prisma.usuario.update({
      where: { id },
      data: { eliminado: true },
    });
  }
}
