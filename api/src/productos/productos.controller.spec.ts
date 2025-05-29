import { Test, TestingModule } from '@nestjs/testing';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';

describe('ProductosController', () => {
  let controller: ProductosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductosController],
      providers: [
        {
          provide: ProductosService,
          useValue: {
            findAllWithFilters: jest.fn(),
            findAll: jest.fn(),
            findDestacados: jest.fn(),
            buscarProductos: jest.fn(),
            findCategorias: jest.fn(),
            findOne: jest.fn(),
            findBySlug: jest.fn(),
            findByCategoria: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductosController>(ProductosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
