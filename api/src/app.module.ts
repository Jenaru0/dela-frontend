import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProductosController } from './productos/productos.controller';
import { ProductosService } from './productos/productos.service';
import { AutenticacionModule } from './autenticacion/autenticacion.module';

// Importa tu módulo de autenticación en el principal
@Module({
  imports: [PrismaModule, AutenticacionModule],
  controllers: [AppController, ProductosController],
  providers: [AppService, ProductosService],
})
export class AppModule {}
