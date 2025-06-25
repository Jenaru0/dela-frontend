'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import {
  productosService,
  ProductoAdmin,
} from '@/services/productos-admin.service';
import { categoriasService, Categoria } from '@/services/categorias.service';
import Image from 'next/image';
import {
  ShoppingBag,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Package,
  Star,
  AlertTriangle,
  X,
  CheckCircle,
} from 'lucide-react';
import CreateProductoModal from '@/components/admin/modals/producto/CreateProductoModal';
import EditProductoModal from '@/components/admin/modals/producto/EditProductoModal';
import EnhancedProductoDetailModal from '@/components/admin/modals/producto/EnhancedProductoDetailModal';
import DeleteProductModal from '@/components/admin/modals/producto/DeleteProductModal';
import ActivateProductModal from '@/components/admin/modals/producto/ActivateProductModal';

interface FilterState {
  search: string;
  categoria: string;
  estado: string;
  destacado: boolean;
  stock: string;
}

const ProductosAdminPage: React.FC = () => {
  const [productos, setProductos] = useState<ProductoAdmin[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // OPTIMIZACIÓN: Cache de productos para evitar recargas innecesarias
  const [allProductsCache, setAllProductsCache] = useState<ProductoAdmin[]>([]);
  const [lastCacheUpdate, setLastCacheUpdate] = useState<number>(0);
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos de cache

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [statsData, setStatsData] = useState({
    total: 0,
    activos: 0,
    inactivos: 0,
    enStock: 0,
    sinStock: 0,
    stockBajo: 0,
    destacados: 0,
  });
  const itemsPerPage = 10;

  // NUEVO: Estado para manejar productos filtrados en frontend
  const [allFilteredProducts, setAllFilteredProducts] = useState<
    ProductoAdmin[]
  >([]);
  const [isUsingFrontendPagination, setIsUsingFrontendPagination] =
    useState(false);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    categoria: '',
    estado: '',
    destacado: false,
    stock: '',
  }); // Estados de modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] =
    useState<ProductoAdmin | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const loadProductos = useCallback(
    async (page: number = 1, scrollToTop: boolean = true) => {
      try {
        // Optimización: Solo mostrar loading en carga inicial
        const isInitialLoad = page === 1 && productos.length === 0;
        if (isInitialLoad) {
          setIsLoading(true);
        }

        // Scroll optimizado
        if (scrollToTop && page !== currentPage) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // OPTIMIZACIÓN: Detectar si necesitamos filtros especiales
        const needsSpecialFiltering =
          filters.destacado || filters.estado || filters.stock;

        if (needsSpecialFiltering) {
          // OPTIMIZACIÓN: Usar cache si está disponible y es reciente
          const now = Date.now();
          const cacheIsValid =
            allProductsCache.length > 0 &&
            now - lastCacheUpdate < CACHE_DURATION;

          let allProducts: ProductoAdmin[];

          if (cacheIsValid) {
            // Usar datos del cache
            allProducts = allProductsCache;
          } else {
            // Cargar desde servidor y actualizar cache
            const backendFilters = {
              busqueda: filters.search || undefined,
              categoriaId: filters.categoria
                ? parseInt(filters.categoria)
                : undefined,
            };

            const response = await productosService.obtenerTodos(
              backendFilters
            );
            allProducts = response.data.sort((a, b) => a.id - b.id);

            // Actualizar cache solo si no hay filtros de backend
            if (!filters.search && !filters.categoria) {
              setAllProductsCache(allProducts);
              setLastCacheUpdate(now);
            }
          }
          // OPTIMIZACIÓN: Aplicar filtros de una vez usando reduce
          const filteredProducts = allProducts.filter((producto) => {
            // Filtro de búsqueda (optimizado)
            if (filters.search) {
              const searchTerm = filters.search.toLowerCase();
              const matchesName = producto.nombre
                .toLowerCase()
                .includes(searchTerm);
              const matchesSku = producto.sku
                .toLowerCase()
                .includes(searchTerm);
              const matchesDescription = producto.descripcion
                ?.toLowerCase()
                .includes(searchTerm);

              if (!matchesName && !matchesSku && !matchesDescription) {
                return false;
              }
            }

            // Filtro de categoría (si aplica desde frontend)
            if (
              filters.categoria &&
              producto.categoria?.id !== parseInt(filters.categoria)
            ) {
              return false;
            }

            // Filtro destacado
            if (filters.destacado && !producto.destacado) {
              return false;
            }

            // Filtro estado
            if (filters.estado && producto.estado !== filters.estado) {
              return false;
            }

            // Filtro stock (optimizado)
            if (filters.stock) {
              switch (filters.stock) {
                case 'sin_stock':
                  return producto.stock === 0;
                case 'stock_bajo':
                  return (
                    producto.stock > 0 &&
                    producto.stock <= (producto.stockMinimo || 5)
                  );
                case 'con_stock':
                  return producto.stock > 0;
                default:
                  break;
              }
            }

            return true;
          });

          // OPTIMIZACIÓN: Paginación eficiente
          const startIndex = (page - 1) * itemsPerPage;
          const paginatedProducts = filteredProducts.slice(
            startIndex,
            startIndex + itemsPerPage
          );

          // Actualización atómica de estados
          setAllFilteredProducts(filteredProducts);
          setIsUsingFrontendPagination(true);
          setProductos(paginatedProducts);
          setTotalProducts(filteredProducts.length);
          setTotalPages(Math.ceil(filteredProducts.length / itemsPerPage));
          setCurrentPage(page);
        } else {
          // Paginación backend optimizada
          const backendFilters = {
            busqueda: filters.search || undefined,
            categoriaId: filters.categoria
              ? parseInt(filters.categoria)
              : undefined,
          };

          const response = await productosService.obtenerConPaginacion(
            page,
            itemsPerPage,
            backendFilters
          );
          const sortedProducts = response.data.sort(
            (a: ProductoAdmin, b: ProductoAdmin) => a.id - b.id
          );

          // Actualización atómica
          setProductos(sortedProducts);
          setTotalProducts(response.total);
          setTotalPages(Math.ceil(response.total / itemsPerPage));
          setCurrentPage(page);
          setAllFilteredProducts([]);
          setIsUsingFrontendPagination(false);
        }
      } catch (error) {
        console.error('Error al cargar productos:', error);
        setProductos([]);
        setAllFilteredProducts([]);
        setIsUsingFrontendPagination(false);
      } finally {
        if (page === 1 && productos.length === 0) {
          setIsLoading(false);
        }
      }
    },
    [
      filters,
      currentPage,
      allProductsCache,
      lastCacheUpdate,
      CACHE_DURATION,
      productos.length,
    ]
  );
  const loadEstadisticas = useCallback(async () => {
    try {
      // Cargar todos los productos para calcular estadísticas (sin filtros)
      const response = await productosService.obtenerTodos();
      const todosLosProductos = response.data.sort((a, b) => a.id - b.id);

      console.log('📊 Calculando estadísticas de productos:', {
        total: todosLosProductos.length,
        estados: todosLosProductos.reduce((acc, p) => {
          acc[p.estado] = (acc[p.estado] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      });
      setStatsData({
        total: todosLosProductos.length,
        activos: todosLosProductos.filter((p) => p.estado === 'ACTIVO').length,
        inactivos: todosLosProductos.filter((p) => p.estado === 'INACTIVO')
          .length,
        enStock: todosLosProductos.filter((p) => p.stock > 0).length,
        sinStock: todosLosProductos.filter((p) => p.stock === 0).length,
        stockBajo: todosLosProductos.filter(
          (p) => p.stock > 0 && p.stock <= (p.stockMinimo || 5)
        ).length,
        destacados: todosLosProductos.filter((p) => p.destacado).length,
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  }, []);
  const loadCategorias = async () => {
    try {
      const response = await categoriasService.obtenerTodas();
      setCategorias(response.data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      setCategorias([]);
    }
  }; // useEffect único para cargar datos iniciales
  useEffect(() => {
    loadCategorias();
    loadEstadisticas();
    loadProductos(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // OPTIMIZACIÓN: useEffect más eficiente para filtros
  useEffect(() => {
    const timeoutId = setTimeout(
      () => {
        setCurrentPage(1);
        loadProductos(1, false);
      },
      filters.search ? 150 : 0
    ); // Debounce más rápido: 150ms

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // useEffect para cambios de página (sin cambios de filtros)
  useEffect(() => {
    if (currentPage > 1) {
      loadProductos(currentPage, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);
  const handleFilterChange = useCallback(
    (key: keyof FilterState, value: string | boolean) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      // El useEffect con debounce se encargará de cargar los productos
    },
    []
  );
  // Función para limpiar filtros (optimizada)
  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      categoria: '',
      estado: '',
      destacado: false,
      stock: '',
    });
  }, []);

  // Contar filtros activos
  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'destacado') {
      return value === true;
    }
    return value !== '';
  }).length;
  const refreshData = () => {
    // OPTIMIZACIÓN: Limpiar cache al refrescar
    setAllProductsCache([]);
    setLastCacheUpdate(0);
    loadProductos(currentPage, false);
    loadEstadisticas();
  };

  const handleView = (producto: ProductoAdmin) => {
    setSelectedProducto(producto);
    setIsViewModalOpen(true);
  };

  const handleEdit = (producto: ProductoAdmin) => {
    setSelectedProducto(producto);
    setIsEditModalOpen(true);
  };
  const handleDelete = (producto: ProductoAdmin) => {
    setSelectedProducto(producto);
    setIsDeleteModalOpen(true);
  };
  const confirmDelete = async () => {
    if (!selectedProducto) return;

    try {
      setIsDeleting(true);
      await productosService.eliminar(selectedProducto.id);
      setIsDeleteModalOpen(false);
      setSelectedProducto(null);
      refreshData();
    } catch (error) {
      console.error('Error al desactivar producto:', error);
      alert('Error al desactivar el producto');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleActivate = (producto: ProductoAdmin) => {
    setSelectedProducto(producto);
    setIsActivateModalOpen(true);
  };

  const confirmActivate = async () => {
    if (!selectedProducto) return;

    try {
      setIsActivating(true);
      // Actualizar el producto para cambiar el estado a ACTIVO
      await productosService.actualizar(selectedProducto.id, {
        estado: 'ACTIVO',
      });
      setIsActivateModalOpen(false);
      setSelectedProducto(null);
      refreshData();
    } catch (error) {
      console.error('Error al activar producto:', error);
      alert('Error al activar el producto');
    } finally {
      setIsActivating(false);
    }
  };

  const getImagenPrincipal = (imagenes: ProductoAdmin['imagenes']) => {
    const imagenPrincipal = imagenes?.find((img) => img.principal);
    return imagenPrincipal?.url || imagenes?.[0]?.url || null;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(price);
  };
  const handlePageChange = useCallback(
    (newPage: number) => {
      // OPTIMIZACIÓN: Scroll más rápido
      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (isUsingFrontendPagination) {
        // OPTIMIZACIÓN: Paginación frontend instantánea
        const startIndex = (newPage - 1) * itemsPerPage;
        const paginatedProducts = allFilteredProducts.slice(
          startIndex,
          startIndex + itemsPerPage
        );

        setProductos(paginatedProducts);
        setCurrentPage(newPage);
      } else {
        // Paginación backend optimizada
        setCurrentPage(newPage);
        loadProductos(newPage, false);
      }
    },
    [
      isUsingFrontendPagination,
      allFilteredProducts,
      itemsPerPage,
      loadProductos,
    ]
  );

  // Función para aplicar filtros rápidos desde las tarjetas de estadísticas
  const applyQuickFilter = useCallback(
    (filterType: string, filterValue: string) => {
      setFilters((prev) => ({ ...prev, [filterType]: filterValue }));
    },
    []
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#3A3A3A]">
            Gestión de Productos
          </h1>
          <p className="text-[#9A8C61] mt-1">
            Administra el catálogo completo de productos de Dela
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-to-r from-[#CC9F53] to-[#b08a3c] hover:from-[#b08a3c] hover:to-[#9a7635] text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Crear Producto
          </Button>
        </div>
      </div>{' '}
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-4">        <div
          className={`bg-white rounded-xl p-4 shadow-sm border transition-all duration-200 cursor-pointer ${
            filters.estado === '' && filters.stock === '' && !filters.destacado
              ? 'border-blue-400 shadow-md bg-blue-50'
              : 'border-[#ecd8ab]/30 hover:shadow-md hover:border-blue-300'
          }`}
          onClick={() => {
            setFilters({
              search: filters.search,
              categoria: filters.categoria,
              estado: '',
              destacado: false,
              stock: '',
            });
          }}
          title="Mostrar todos los productos"
        >
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                filters.estado === '' && filters.stock === '' && !filters.destacado
                  ? 'bg-blue-100'
                  : 'bg-blue-50'
              }`}
            >
              <ShoppingBag
                className={`w-5 h-5 ${
                  filters.estado === '' && filters.stock === '' && !filters.destacado
                    ? 'text-blue-700'
                    : 'text-blue-600'
                }`}
              />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-[#9A8C61]">Total</p>
              <p className="text-xl font-bold text-[#3A3A3A]">
                {statsData.total}
              </p>
            </div>
          </div>
        </div>        <div
          className={`bg-white rounded-xl p-4 shadow-sm border transition-all duration-200 cursor-pointer ${
            filters.estado === 'ACTIVO'
              ? 'border-green-400 shadow-md bg-green-50'
              : 'border-[#ecd8ab]/30 hover:shadow-md hover:border-green-300'
          }`}
          onClick={() =>
            applyQuickFilter(
              'estado',
              filters.estado === 'ACTIVO' ? '' : 'ACTIVO'
            )
          }
          title={
            filters.estado === 'ACTIVO'
              ? 'Quitar filtro de activos'
              : 'Filtrar productos activos'
          }
        >
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                filters.estado === 'ACTIVO' ? 'bg-green-100' : 'bg-green-50'
              }`}
            >
              <Package
                className={`w-5 h-5 ${
                  filters.estado === 'ACTIVO'
                    ? 'text-green-700'
                    : 'text-green-600'
                }`}
              />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-[#9A8C61]">Activos</p>
              <p className="text-xl font-bold text-[#3A3A3A]">
                {statsData.activos}
              </p>
            </div>
          </div>
        </div>        <div
          className={`bg-white rounded-xl p-4 shadow-sm border transition-all duration-200 cursor-pointer ${
            filters.estado === 'INACTIVO'
              ? 'border-gray-400 shadow-md bg-gray-50'
              : 'border-[#ecd8ab]/30 hover:shadow-md hover:border-gray-300'
          }`}
          onClick={() =>
            applyQuickFilter(
              'estado',
              filters.estado === 'INACTIVO' ? '' : 'INACTIVO'
            )
          }
          title={
            filters.estado === 'INACTIVO'
              ? 'Quitar filtro de inactivos'
              : 'Filtrar productos inactivos'
          }
        >
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                filters.estado === 'INACTIVO' ? 'bg-gray-100' : 'bg-gray-50'
              }`}
            >
              <AlertTriangle
                className={`w-5 h-5 ${
                  filters.estado === 'INACTIVO'
                    ? 'text-gray-700'
                    : 'text-gray-600'
                }`}
              />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-[#9A8C61]">Inactivos</p>
              <p className="text-xl font-bold text-[#3A3A3A]">
                {statsData.inactivos}
              </p>
            </div>
          </div>
        </div>        <div
          className={`bg-white rounded-xl p-4 shadow-sm border transition-all duration-200 cursor-pointer ${
            filters.stock === 'con_stock'
              ? 'border-emerald-400 shadow-md bg-emerald-50'
              : 'border-[#ecd8ab]/30 hover:shadow-md hover:border-emerald-300'
          }`}
          onClick={() =>
            applyQuickFilter(
              'stock',
              filters.stock === 'con_stock' ? '' : 'con_stock'
            )
          }
          title={
            filters.stock === 'con_stock'
              ? 'Quitar filtro de en stock'
              : 'Filtrar productos en stock'
          }
        >
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                filters.stock === 'con_stock' ? 'bg-emerald-100' : 'bg-emerald-50'
              }`}
            >
              <Package
                className={`w-5 h-5 ${
                  filters.stock === 'con_stock'
                    ? 'text-emerald-700'
                    : 'text-emerald-600'
                }`}
              />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-[#9A8C61]">En Stock</p>
              <p className="text-xl font-bold text-[#3A3A3A]">
                {statsData.enStock}
              </p>
            </div>
          </div>
        </div>{' '}
        <div
          className={`bg-white rounded-xl p-4 shadow-sm border transition-all duration-200 cursor-pointer ${
            filters.stock === 'sin_stock'
              ? 'border-red-400 shadow-md bg-red-50'
              : 'border-[#ecd8ab]/30 hover:shadow-md hover:border-red-300'
          }`}
          onClick={() =>
            applyQuickFilter(
              'stock',
              filters.stock === 'sin_stock' ? '' : 'sin_stock'
            )
          }
          title={
            filters.stock === 'sin_stock'
              ? 'Quitar filtro de sin stock'
              : 'Filtrar productos sin stock'
          }
        >
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                filters.stock === 'sin_stock' ? 'bg-red-100' : 'bg-red-50'
              }`}
            >
              <AlertTriangle
                className={`w-5 h-5 ${
                  filters.stock === 'sin_stock'
                    ? 'text-red-700'
                    : 'text-red-600'
                }`}
              />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-[#9A8C61]">Sin Stock</p>
              <p className="text-xl font-bold text-[#3A3A3A]">
                {statsData.sinStock}
              </p>
            </div>
          </div>
        </div>        <div
          className={`bg-white rounded-xl p-4 shadow-sm border transition-all duration-200 cursor-pointer ${
            filters.destacado
              ? 'border-yellow-400 shadow-md bg-yellow-50'
              : 'border-[#ecd8ab]/30 hover:shadow-md hover:border-yellow-300'
          }`}          onClick={() => {
            setFilters((prev) => ({ ...prev, destacado: !prev.destacado }));
          }}
          title={
            filters.destacado
              ? 'Quitar filtro de destacados'
              : 'Filtrar productos destacados'
          }
        >
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                filters.destacado ? 'bg-yellow-100' : 'bg-yellow-50'
              }`}
            >
              <Star
                className={`w-5 h-5 ${
                  filters.destacado
                    ? 'text-yellow-700'
                    : 'text-yellow-600'
                }`}
              />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-[#9A8C61]">Destacados</p>
              <p className="text-xl font-bold text-[#3A3A3A]">
                {statsData.destacados}
              </p>
            </div>
          </div>
        </div>{' '}
        <div
          className={`bg-white rounded-xl p-4 shadow-sm border transition-all duration-200 cursor-pointer ${
            filters.stock === 'stock_bajo'
              ? 'border-amber-400 shadow-md bg-amber-50'
              : 'border-[#ecd8ab]/30 hover:shadow-md hover:border-amber-300'
          }`}
          onClick={() =>
            applyQuickFilter(
              'stock',
              filters.stock === 'stock_bajo' ? '' : 'stock_bajo'
            )
          }
          title={
            filters.stock === 'stock_bajo'
              ? 'Quitar filtro de stock bajo'
              : 'Filtrar productos con stock bajo'
          }
        >
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                filters.stock === 'stock_bajo' ? 'bg-amber-100' : 'bg-amber-50'
              }`}
            >
              <AlertTriangle
                className={`w-5 h-5 ${
                  filters.stock === 'stock_bajo'
                    ? 'text-amber-700'
                    : 'text-amber-600'
                }`}
              />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-[#9A8C61]">Stock Bajo</p>
              <p className="text-xl font-bold text-[#3A3A3A]">
                {statsData.stockBajo}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Filtros */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
          {/* Búsqueda */}
          <div className="relative">
            <label className="block text-xs font-medium text-[#9A8C61] mb-1">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9A8C61] h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar productos..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10 border-[#ecd8ab]/50 focus:border-[#CC9F53] focus:ring-[#CC9F53]/20 text-sm"
              />
            </div>
          </div>

          {/* Filtro Categoría */}
          <div>
            <label className="block text-xs font-medium text-[#9A8C61] mb-1">
              Categoría
            </label>
            <select
              value={filters.categoria}
              onChange={(e) => handleFilterChange('categoria', e.target.value)}
              className="w-full px-3 py-2 border border-[#ecd8ab]/50 rounded-md focus:border-[#CC9F53] focus:ring-[#CC9F53]/20 bg-white text-sm"
            >
              <option value="">Todas las categorías</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro Estado */}
          <div>
            <label className="block text-xs font-medium text-[#9A8C61] mb-1">
              Estado
            </label>
            <select
              value={filters.estado}
              onChange={(e) => handleFilterChange('estado', e.target.value)}
              className="w-full px-3 py-2 border border-[#ecd8ab]/50 rounded-md focus:border-[#CC9F53] focus:ring-[#CC9F53]/20 bg-white text-sm"
            >
              <option value="">Todos los estados</option>
              <option value="ACTIVO">Activo</option>
              <option value="INACTIVO">Inactivo</option>
            </select>
          </div>

          {/* Filtro Stock */}
          <div>
            <label className="block text-xs font-medium text-[#9A8C61] mb-1">
              Stock
            </label>
            <select
              value={filters.stock}
              onChange={(e) => handleFilterChange('stock', e.target.value)}
              className="w-full px-3 py-2 border border-[#ecd8ab]/50 rounded-md focus:border-[#CC9F53] focus:ring-[#CC9F53]/20 bg-white text-sm"
            >
              <option value="">Todos los stocks</option>
              <option value="con_stock">Con stock</option>
              <option value="sin_stock">Sin stock</option>
              <option value="stock_bajo">Stock bajo</option>
            </select>
          </div>

          {/* Filtro Destacado */}
          <div>
            <label className="block text-xs font-medium text-[#9A8C61] mb-1">
              Destacado
            </label>
            <div className="flex items-center h-9">
              <input
                type="checkbox"
                id="destacado"
                checked={filters.destacado}
                onChange={(e) =>
                  handleFilterChange('destacado', e.target.checked)
                }
                className="h-4 w-4 text-[#CC9F53] focus:ring-[#CC9F53] border-[#ecd8ab]/50 rounded"
              />
              <label
                htmlFor="destacado"
                className="ml-2 text-sm text-[#3A3A3A]"
              >
                Solo destacados
              </label>
            </div>
          </div>

          {/* Botón Limpiar */}
          <div className="flex items-end">
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full border-[#CC9F53] text-[#CC9F53] hover:bg-[#CC9F53] hover:text-white text-sm"
              >
                <X className="w-4 h-4 mr-1" />
                Limpiar ({activeFiltersCount})
              </Button>
            )}
          </div>
        </div>
      </div>{' '}
      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#ecd8ab]/30 overflow-hidden relative">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CC9F53] mx-auto"></div>
            <p className="mt-4 text-[#9A8C61]">Cargando productos...</p>
          </div>
        ) : productos.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#CC9F53] to-[#b08a3c] rounded-xl flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-[#3A3A3A] mb-2">
              {productos.length === 0 ? 'No hay productos' : 'Sin resultados'}
            </h3>
            <p className="text-[#9A8C61] mb-6">
              {productos.length === 0
                ? 'Aún no tienes productos. Crea el primero para comenzar tu catálogo.'
                : 'No se encontraron productos que coincidan con los filtros aplicados.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#F5E6C6]/50 to-[#FAF3E7]/30 border-b border-[#ecd8ab]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">
                    Producto
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">
                    SKU
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">
                    Categoría
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">
                    Precio
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-[#3A3A3A]">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ecd8ab]/30">
                {productos.map((producto) => {
                  const imagenPrincipal = getImagenPrincipal(producto.imagenes);

                  return (
                    <tr
                      key={producto.id}
                      className="hover:bg-[#F5E6C6]/20 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-[#F5E6C6]/30 rounded-lg flex items-center justify-center mr-3 overflow-hidden">
                            {imagenPrincipal ? (
                              <Image
                                src={imagenPrincipal}
                                alt={producto.nombre}
                                width={48}
                                height={48}
                                className="object-cover w-full h-full rounded-lg"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  target.nextElementSibling?.classList.remove(
                                    'hidden'
                                  );
                                }}
                              />
                            ) : null}
                            <ShoppingBag
                              className={`w-6 h-6 text-[#CC9F53] ${
                                imagenPrincipal ? 'hidden' : ''
                              }`}
                            />
                          </div>
                          <div>
                            <p className="font-medium text-[#3A3A3A]">
                              {producto.nombre}
                            </p>
                            <p className="text-sm text-[#9A8C61] truncate max-w-xs">
                              {producto.descripcion || 'Sin descripción'}
                            </p>
                            {producto.destacado && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                                <Star className="w-3 h-3 mr-1" />
                                Destacado
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-[#3A3A3A] bg-gray-50 px-2 py-1 rounded">
                          {producto.sku}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#3A3A3A]">
                        {producto.categoria?.nombre || 'Sin categoría'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-[#3A3A3A]">
                            {formatPrice(producto.precioUnitario)}
                          </span>
                          {producto.precioAnterior &&
                            producto.precioAnterior >
                              producto.precioUnitario && (
                              <span className="text-xs text-gray-500 line-through">
                                {formatPrice(producto.precioAnterior)}
                              </span>
                            )}
                        </div>
                      </td>{' '}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            producto.stock === 0
                              ? 'bg-red-100 text-red-800'
                              : producto.stock <= (producto.stockMinimo || 5)
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          <Package className="w-3 h-3 mr-1" />
                          {producto.stock} unidades
                          {producto.stock === 0 ? (
                            <span className="ml-1 text-xs">• Sin stock</span>
                          ) : producto.stock <= (producto.stockMinimo || 5) ? (
                            <span className="ml-1 text-xs">• Stock bajo</span>
                          ) : (
                            <span className="ml-1 text-xs">• En stock</span>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {' '}
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            producto.estado === 'ACTIVO'
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : producto.estado === 'AGOTADO'
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : 'bg-red-50 text-red-700 border border-red-300'
                          }`}
                        >
                          {producto.estado === 'ACTIVO'
                            ? 'Activo'
                            : producto.estado === 'AGOTADO'
                            ? 'Agotado'
                            : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {' '}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-[#F5E6C6]/30"
                            onClick={() => handleView(producto)}
                            title="Ver detalles"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-[#F5E6C6]/30"
                            onClick={() => handleEdit(producto)}
                            title="Editar producto"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {producto.estado === 'INACTIVO' ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-600 hover:bg-green-50"
                              onClick={() => handleActivate(producto)}
                              title="Activar producto"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => handleDelete(producto)}
                              title="Desactivar producto"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Paginación */}
      {totalPages > 1 && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center justify-between">
            <div className="text-sm text-[#9A8C61]">
              Mostrando {(currentPage - 1) * itemsPerPage + 1} a{' '}
              {Math.min(currentPage * itemsPerPage, totalProducts)} de{' '}
              {totalProducts} productos
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="border-[#ecd8ab]/50 text-[#9A8C61] hover:bg-[#F5E6C6]/30 disabled:opacity-50"
              >
                Anterior
              </Button>

              <div className="flex items-center space-x-1">
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  const isCurrentPage = page === currentPage;

                  // Mostrar solo algunas páginas alrededor de la actual
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 2 && page <= currentPage + 2)
                  ) {
                    return (
                      <Button
                        key={page}
                        variant={isCurrentPage ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={
                          isCurrentPage
                            ? 'bg-[#CC9F53] text-white hover:bg-[#b08a3c]'
                            : 'border-[#ecd8ab]/50 text-[#9A8C61] hover:bg-[#F5E6C6]/30'
                        }
                      >
                        {page}
                      </Button>
                    );
                  } else if (
                    page === currentPage - 3 ||
                    page === currentPage + 3
                  ) {
                    return (
                      <span key={page} className="text-[#9A8C61]">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="border-[#ecd8ab]/50 text-[#9A8C61] hover:bg-[#F5E6C6]/30 disabled:opacity-50"
              >
                Siguiente
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* TODO: Agregar modales cuando estén implementados */}
      {isCreateModalOpen && (
        <CreateProductoModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onProductoCreated={refreshData}
          onEditProducto={(producto) => {
            setSelectedProducto(producto);
            setIsEditModalOpen(true);
          }}
        />
      )}      {isEditModalOpen && selectedProducto && (
        <EditProductoModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedProducto(null);
          }}
          producto={selectedProducto}
          onProductoUpdated={async () => {
            await refreshData();
            // Refrescar también el selectedProducto con datos actualizados
            if (selectedProducto) {
              try {
                const productoActualizado = await productosService.obtenerPorId(selectedProducto.id);
                setSelectedProducto(productoActualizado.data);
              } catch (error) {
                console.error('Error al refrescar producto seleccionado:', error);
              }
            }
          }}
        />
      )}
      {isViewModalOpen && selectedProducto && (
        <EnhancedProductoDetailModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedProducto(null);
          }}
          producto={selectedProducto}
        />
      )}
      {isDeleteModalOpen && selectedProducto && (
        <DeleteProductModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedProducto(null);
          }}
          onConfirm={confirmDelete}
          producto={selectedProducto}
          isDeleting={isDeleting}
        />
      )}
      {isActivateModalOpen && selectedProducto && (
        <ActivateProductModal
          isOpen={isActivateModalOpen}
          onClose={() => {
            setIsActivateModalOpen(false);
            setSelectedProducto(null);
          }}
          onConfirm={confirmActivate}
          producto={selectedProducto}
          isActivating={isActivating}
        />
      )}
    </div>
  );
};

export default ProductosAdminPage;
