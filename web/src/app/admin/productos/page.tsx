'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { productosService, ProductoAdmin } from '@/services/productos-admin.service';
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
  X
} from 'lucide-react';
import CreateProductoModal from '@/components/admin/CreateProductoModal';
import EditProductoModal from '@/components/admin/EditProductoModal';
import EnhancedProductoDetailModal from '@/components/admin/EnhancedProductoDetailModal';

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
  
  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [statsData, setStatsData] = useState({
    total: 0,
    enStock: 0,
    sinStock: 0,
    destacados: 0
  });
  const itemsPerPage = 10;
  
  // NUEVO: Estado para manejar productos filtrados en frontend
  const [allFilteredProducts, setAllFilteredProducts] = useState<ProductoAdmin[]>([]);
  const [isUsingFrontendPagination, setIsUsingFrontendPagination] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    categoria: '',
    estado: '',
    destacado: false,
    stock: ''
  });

  // Estados de modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<ProductoAdmin | null>(null);  const loadProductos = useCallback(async (page: number = 1, scrollToTop: boolean = true) => {
    try {
      setIsLoading(true);
      
      // Scroll hacia arriba suavemente cuando se cambia de página
      if (scrollToTop && page !== currentPage) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }

      // Detectar si necesitamos filtros especiales (frontend)
      const needsFrontendFiltering = filters.destacado || filters.estado || filters.stock;
      
      if (needsFrontendFiltering) {        // Obtener TODOS los productos y filtrar en frontend
        const backendFilters = {
          busqueda: filters.search || undefined, // CORREGIDO: usar 'busqueda' en lugar de 'search'
          categoriaId: filters.categoria ? parseInt(filters.categoria) : undefined,
        };

        const response = await productosService.obtenerTodos(backendFilters);
        let allProducts = response.data;
        
        // Ordenar por ID ascendente
        allProducts = allProducts.sort((a, b) => a.id - b.id);
        
        // Aplicar filtros especiales en frontend
        if (filters.destacado) {
          allProducts = allProducts.filter(producto => producto.destacado === true);
        }
        
        if (filters.estado) {
          allProducts = allProducts.filter(producto => producto.estado === filters.estado);
        }
        
        if (filters.stock === 'sin_stock') {
          allProducts = allProducts.filter(producto => producto.stock === 0);
        } else if (filters.stock === 'stock_bajo') {
          allProducts = allProducts.filter(producto => producto.stock > 0 && producto.stock <= (producto.stockMinimo || 5));
        }
        
        // Guardar todos los productos filtrados
        setAllFilteredProducts(allProducts);
        setIsUsingFrontendPagination(true);
        
        // Calcular paginación en frontend
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedProducts = allProducts.slice(startIndex, endIndex);
        
        setProductos(paginatedProducts);
        setTotalProducts(allProducts.length);
        setTotalPages(Math.ceil(allProducts.length / itemsPerPage));
        setCurrentPage(page);
      } else {        // Paginación normal del backend (sin filtros especiales)
        const backendFilters = {
          busqueda: filters.search || undefined, // CORREGIDO: usar 'busqueda' en lugar de 'search'
          categoriaId: filters.categoria ? parseInt(filters.categoria) : undefined,
        };const response = await productosService.obtenerConPaginacion(page, itemsPerPage, backendFilters);
        
        // Ordenar por ID ascendente como backup
        const sortedProducts = response.data.sort((a: ProductoAdmin, b: ProductoAdmin) => a.id - b.id);
        
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
      setIsLoading(false);
    }
  }, [filters, currentPage]);
  const loadEstadisticas = useCallback(async () => {
    try {
      // Cargar todos los productos para calcular estadísticas (sin filtros)
      const response = await productosService.obtenerTodos();
      const todosLosProductos = response.data.sort((a, b) => a.id - b.id);
      
      setStatsData({
        total: todosLosProductos.length,
        enStock: todosLosProductos.filter(p => p.stock > 0).length,
        sinStock: todosLosProductos.filter(p => p.stock === 0).length,
        destacados: todosLosProductos.filter(p => p.destacado).length
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  }, []);const loadCategorias = async () => {
    try {
      const response = await categoriasService.obtenerTodas();
      setCategorias(response.data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      setCategorias([]);
    }
  };  // useEffect separado para cargar datos cuando cambian los filtros
  useEffect(() => {
    loadProductos(1, false); // Siempre página 1 cuando cambian filtros
    loadCategorias();
    loadEstadisticas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]); // Solo cuando cambian los filtros

  // useEffect separado para cargar datos cuando cambia la página (sin cambiar filtros)
  useEffect(() => {
    if (currentPage > 1) {
      loadProductos(currentPage, true); // Hacer scroll cuando cambia página
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Cargar productos y estadísticas al montar el componente
  useEffect(() => {
    loadProductos();
    loadEstadisticas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Recargar productos cuando cambien los filtros
  useEffect(() => {
    if (filters.search || filters.categoria || filters.estado || filters.destacado || filters.stock) {
      setCurrentPage(1); // Reset a página 1 cuando hay filtros
      loadProductos(1);
    } else {
      loadProductos(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, currentPage]);
  const handleFilterChange = (key: keyof FilterState, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    // No necesita resetear currentPage aquí porque lo hace el useEffect
  };

  // Función para limpiar filtros
  const clearFilters = () => {
    setFilters({
      search: '',
      categoria: '',
      estado: '',
      destacado: false,
      stock: ''
    });
  };

  // Contar filtros activos
  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'destacado') {
      return value === true;
    }
    return value !== '';
  }).length;
  const refreshData = () => {
    loadProductos(currentPage, false); // false para no hacer scroll al refrescar
    loadEstadisticas();
  };

  const handleView = (producto: ProductoAdmin) => {
    setSelectedProducto(producto);
    setIsViewModalOpen(true);
  };

  const handleEdit = (producto: ProductoAdmin) => {
    setSelectedProducto(producto);
    setIsEditModalOpen(true);
  };  const handleDelete = async (producto: ProductoAdmin) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el producto "${producto.nombre}"?`)) {
      try {
        await productosService.eliminar(producto.id);
        refreshData();
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert('Error al eliminar el producto');
      }
    }
  };

  const getImagenPrincipal = (imagenes: ProductoAdmin['imagenes']) => {
    const imagenPrincipal = imagenes?.find(img => img.principal);
    return imagenPrincipal?.url || imagenes?.[0]?.url || null;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(price);
  };

  const handlePageChange = (newPage: number) => {
    // Scroll hacia arriba suavemente al cambiar de página
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    if (isUsingFrontendPagination) {
      // Si estamos usando paginación frontend (con filtros especiales)
      const startIndex = (newPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedProducts = allFilteredProducts.slice(startIndex, endIndex);
      
      setProductos(paginatedProducts);
      setCurrentPage(newPage);
    } else {
      // Si estamos usando paginación backend (sin filtros especiales)
      loadProductos(newPage, false); // false porque ya hicimos scroll arriba
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#3A3A3A]">Gestión de Productos</h1>
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
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>            <div className="ml-4">
              <p className="text-sm font-medium text-[#9A8C61]">Total Productos</p>
              <p className="text-2xl font-bold text-[#3A3A3A]">{statsData.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#9A8C61]">En Stock</p>
              <p className="text-2xl font-bold text-[#3A3A3A]">
                {statsData.enStock}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#9A8C61]">Sin Stock</p>
              <p className="text-2xl font-bold text-[#3A3A3A]">
                {statsData.sinStock}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#9A8C61]">Destacados</p>
              <p className="text-2xl font-bold text-[#3A3A3A]">
                {statsData.destacados}
              </p>
            </div>
          </div>
        </div>
      </div>      {/* Filtros */}
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
                onChange={(e) => handleFilterChange('destacado', e.target.checked)}
                className="h-4 w-4 text-[#CC9F53] focus:ring-[#CC9F53] border-[#ecd8ab]/50 rounded"
              />
              <label htmlFor="destacado" className="ml-2 text-sm text-[#3A3A3A]">Solo destacados</label>
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
      </div>{/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#ecd8ab]/30 overflow-hidden">
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
                : 'No se encontraron productos que coincidan con los filtros aplicados.'
              }
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
                    <tr key={producto.id} className="hover:bg-[#F5E6C6]/20 transition-colors duration-200">
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
                                  target.nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                            ) : null}
                            <ShoppingBag className={`w-6 h-6 text-[#CC9F53] ${imagenPrincipal ? 'hidden' : ''}`} />
                          </div>
                          <div>
                            <p className="font-medium text-[#3A3A3A]">{producto.nombre}</p>
                            <p className="text-sm text-[#9A8C61] truncate max-w-xs">
                              {producto.descripcion || 'Sin descripción'}
                            </p>
                            {producto.destacado && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                                <Star className="w-3 h-3 mr-1" />
                                Destacado
                              </span>
                            )}
                          </div>                        </div>
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
                          {producto.precioAnterior && producto.precioAnterior > producto.precioUnitario && (
                            <span className="text-xs text-gray-500 line-through">
                              {formatPrice(producto.precioAnterior)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          producto.stock > 10
                            ? 'bg-green-100 text-green-800'
                            : producto.stock > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          <Package className="w-3 h-3 mr-1" />
                          {producto.stock} unidades
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          producto.estado === 'ACTIVO'
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : producto.estado === 'AGOTADO'
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}>
                          {producto.estado === 'ACTIVO' ? 'Activo' : 
                           producto.estado === 'AGOTADO' ? 'Agotado' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
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
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(producto)}
                            title="Eliminar producto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center justify-between">
            <div className="text-sm text-[#9A8C61]">
              Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, totalProducts)} de {totalProducts} productos
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
                        variant={isCurrentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={isCurrentPage 
                          ? "bg-[#CC9F53] text-white hover:bg-[#b08a3c]" 
                          : "border-[#ecd8ab]/50 text-[#9A8C61] hover:bg-[#F5E6C6]/30"
                        }
                      >
                        {page}
                      </Button>
                    );
                  } else if (
                    page === currentPage - 3 ||
                    page === currentPage + 3
                  ) {
                    return <span key={page} className="text-[#9A8C61]">...</span>;
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

      {/* TODO: Agregar modales cuando estén implementados */}      {isCreateModalOpen && (
        <CreateProductoModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onProductoCreated={refreshData}
        />
      )}

      {isEditModalOpen && selectedProducto && (
        <EditProductoModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedProducto(null);
          }}
          producto={selectedProducto}
          onProductoUpdated={refreshData}
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
    </div>
  );
};

export default ProductosAdminPage;
