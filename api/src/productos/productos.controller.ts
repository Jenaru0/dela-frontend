// src/productos/productos.controller.ts
import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { FiltrosProductosDto } from './dto/filtros-productos.dto';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  async findAll(@Query() filtros: FiltrosProductosDto) {
    return this.productosService.findAllWithFilters(filtros);
  }

  @Get('destacados')
  findDestacados(@Query('limite') limite?: number) {
    return this.productosService.findDestacados(limite || 8);
  }

  @Get('categorias')
  findCategorias() {
    return this.productosService.findCategorias();
  }

  @Get('buscar')
  buscar(@Query('q') searchTerm: string, @Query('limite') limite?: number) {
    return this.productosService.buscarProductos(searchTerm, limite || 10);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.productosService.findBySlug(slug);
  }

  @Get('categoria/:categoriaId')
  findByCategoria(
    @Param('categoriaId', ParseIntPipe) categoriaId: number,
    @Query('limite') limite?: number,
  ) {
    return this.productosService.findByCategoria(categoriaId, limite);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.findOne(id);
  }
}
