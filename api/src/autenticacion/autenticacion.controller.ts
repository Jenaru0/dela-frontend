import { Controller, Post, Body } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';
import { RegistroDto } from './dto/registro.dto';
import { InicioSesionDto } from './dto/inicio-sesion.dto';

@Controller('autenticacion')
export class AutenticacionController {
  constructor(private readonly autenticacionService: AutenticacionService) {}

  @Post('registro')
  async registrar(@Body() dto: RegistroDto) {
    // El tipo de retorno se infiere, y evitas el error TS4053
    return this.autenticacionService.registrar(dto);
  }

  @Post('inicio-sesion')
  async iniciarSesion(@Body() dto: InicioSesionDto) {
    return this.autenticacionService.iniciarSesion(dto);
  }

  @Post('logout')
  logout() {
    // El frontend debe borrar el token. Aquí solo devolvemos un mensaje de éxito.
    return { mensaje: 'Sesión cerrada correctamente.' };
  }
}
