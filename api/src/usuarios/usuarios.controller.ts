import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { JwtAutenticacionGuard } from '../autenticacion/guards/jwt-autenticacion.guard';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  // Creación de usuario (solo admin puede crear usuarios de cualquier tipo)
  @Post()
  @UseGuards(JwtAutenticacionGuard)
  async create(@Body() createUsuarioDto: CreateUsuarioDto, @Request() req) {
    if (req.user.tipoUsuarioId !== 2) {
      throw new ForbiddenException(
        'Solo administradores pueden crear usuarios.',
      );
    }
    const usuario = await this.usuariosService.create(createUsuarioDto);
    return {
      mensaje: 'Usuario creado exitosamente por admin.',
      data: usuario,
    };
  }

  @Get()
  @UseGuards(JwtAutenticacionGuard)
  async findAll(@Request() req) {
    // Solo admin puede listar todos
    if (req.user.tipoUsuarioId !== 2) {
      throw new ForbiddenException(
        'Solo administradores pueden listar todos los usuarios.',
      );
    }
    const usuarios = await this.usuariosService.findAll();
    return {
      mensaje: 'Lista de usuarios obtenida correctamente.',
      data: usuarios,
    };
  }

  @Get('me')
  @UseGuards(JwtAutenticacionGuard)
  async getProfile(@Request() req) {
    const usuario = await this.usuariosService.findOne(Number(req.user.sub));
    return {
      mensaje: 'Perfil obtenido correctamente.',
      data: usuario,
    };
  }

  @Get(':id')
  @UseGuards(JwtAutenticacionGuard)
  async findOne(@Param('id') id: string, @Request() req) {
    const usuario = await this.usuariosService.findOne(+id);
    // Solo admin o el propio usuario puede ver
    if (req.user.tipoUsuarioId !== 2 && req.user.sub !== usuario?.id) {
      throw new ForbiddenException('No tienes permisos para ver este usuario.');
    }
    return {
      mensaje: 'Usuario obtenido correctamente.',
      data: usuario,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAutenticacionGuard)
  async update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @Request() req,
  ) {
    // Solo admin o el propio usuario puede editar
    if (req.user.tipoUsuarioId !== 2 && req.user.sub !== +id) {
      throw new ForbiddenException(
        'No tienes permisos para editar este usuario.',
      );
    }
    const usuario = await this.usuariosService.update(+id, updateUsuarioDto);
    return {
      mensaje: 'Usuario actualizado correctamente.',
      data: usuario,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAutenticacionGuard)
  async remove(@Param('id') id: string, @Request() req) {
    // Solo admin o el propio usuario puede eliminar
    if (req.user.tipoUsuarioId !== 2 && req.user.sub !== +id) {
      throw new ForbiddenException(
        'No tienes permisos para eliminar este usuario.',
      );
    }
    await this.usuariosService.remove(+id);
    return {
      mensaje: 'Usuario eliminado correctamente.',
    };
  }
}
