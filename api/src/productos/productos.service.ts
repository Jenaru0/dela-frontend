// src/productos/productos.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FiltrosProductosDto } from './dto/filtros-productos.dto';
import { PaginacionDto } from './dto/paginacion.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductosService {
  constructor(private readonly prisma: PrismaService) {}

  // Buscar todos los productos con filtros y paginación
  async findAllWithFilters(
    filtros: FiltrosProductosDto,
  ): Promise<PaginacionDto<any>> {
    const {
      busqueda,
      categoriaId,
      precioMin,
      precioMax,
      destacado,
      disponible,
      orderBy = 'nombre',
      sortOrder = 'asc',
      page = 1,
      limit = 12,
    } = filtros;

    // Construir condiciones WHERE dinámicamente
    const where: Prisma.ProductoWhereInput = {
      estado: 'ACTIVO',
    };

    // Filtro de búsqueda por nombre o descripción
    if (busqueda) {
      where.OR = [
        { nombre: { contains: busqueda, mode: 'insensitive' } },
        { descripcion: { contains: busqueda, mode: 'insensitive' } },
        { sku: { contains: busqueda, mode: 'insensitive' } },
      ];
    }

    // Filtro por categoría
    if (categoriaId) {
      where.categoriaId = categoriaId;
    }

    // Filtro por rango de precios
    if (precioMin !== undefined || precioMax !== undefined) {
      where.precioUnitario = {};
      if (precioMin !== undefined) {
        where.precioUnitario.gte = precioMin;
      }
      if (precioMax !== undefined) {
        where.precioUnitario.lte = precioMax;
      }
    }

    // Filtro por destacado
    if (destacado !== undefined) {
      where.destacado = destacado;
    }

    // Filtro por disponibilidad (stock > 0)
    if (disponible !== undefined && disponible) {
      where.stock = { gt: 0 };
    }

    // Configurar ordenamiento
    const orderByClause: Prisma.ProductoOrderByWithRelationInput = {};
    orderByClause[orderBy] = sortOrder;

    // Calcular offset para paginación
    const skip = (page - 1) * limit;

    // Ejecutar consultas en paralelo
    const [productos, total] = await Promise.all([
      this.prisma.producto.findMany({
        where,
        include: {
          categoria: true,
        },
        orderBy: orderByClause,
        skip,
        take: limit,
      }),
      this.prisma.producto.count({ where }),
    ]);

    // Calcular metadatos de paginación
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return new PaginacionDto(productos, page, limit, total);
  }

  // Obtener todos los productos (sin filtros, para compatibilidad)
  findAll() {
    return this.prisma.producto.findMany({
      where: { estado: 'ACTIVO' },
      include: { categoria: true },
      orderBy: { nombre: 'asc' },
    });
  }

  // Obtener productos destacados
  findDestacados(limit: number = 8) {
    return this.prisma.producto.findMany({
      where: {
        estado: 'ACTIVO',
        destacado: true,
      },
      include: { categoria: true },
      orderBy: { creadoEn: 'desc' },
      take: limit,
    });
  }

  // Buscar productos por término
  buscarProductos(searchTerm: string, limit: number = 10) {
    return this.prisma.producto.findMany({
      where: {
        estado: 'ACTIVO',
        OR: [
          { nombre: { contains: searchTerm, mode: 'insensitive' } },
          { descripcion: { contains: searchTerm, mode: 'insensitive' } },
          { sku: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      include: { categoria: true },
      take: limit,
    });
  }

  // Obtener categorías con conteo de productos
  findCategorias() {
    return this.prisma.categoriaProducto.findMany({
      include: {
        _count: {
          select: {
            productos: {
              where: { estado: 'ACTIVO' },
            },
          },
        },
      },
      orderBy: { nombre: 'asc' },
    });
  }

  // Obtener producto por ID
  async findOne(id: number) {
    const producto = await this.prisma.producto.findFirst({
      where: {
        id,
        estado: 'ACTIVO',
      },
      include: {
        categoria: true,
      },
    });

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return producto;
  }

  // Obtener producto por slug
  async findBySlug(slug: string) {
    const producto = await this.prisma.producto.findFirst({
      where: {
        slug,
        estado: 'ACTIVO',
      },
      include: {
        categoria: true,
      },
    });

    if (!producto) {
      throw new NotFoundException(`Producto con slug "${slug}" no encontrado`);
    }

    return producto;
  }

  // Obtener productos por categoría
  findByCategoria(categoriaId: number, limit?: number) {
    const where = {
      categoriaId,
      estado: 'ACTIVO' as const,
    };

    const queryOptions: any = {
      where,
      include: { categoria: true },
      orderBy: { nombre: 'asc' },
    };

    if (limit) {
      queryOptions.take = limit;
    }

    return this.prisma.producto.findMany(queryOptions);
  }
}
