// src/productos/productos.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductosService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.producto.findMany({
      where: { estado: 'ACTIVO' },
      include: { categoria: true },
    });
  }
}
