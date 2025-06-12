'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { 
  FolderOpen, 
  Plus, 
  Edit, 
  Eye, 
  Search,
  AlertCircle,
  CheckCircle,
  Package,
  Power,
  Tag,
  X
} from 'lucide-react';
import { categoriasService, Categoria } from '@/services/categorias.service';
import CreateCategoriaModal from '@/components/admin/modals/CreateCategoriaModal';
import EditCategoriaModal from '@/components/admin/modals/EditCategoriaModal';
import EnhancedCategoriaDetailModal from '@/components/admin/EnhancedCategoriaDetailModal';

const CategoriasAdminPage: React.FC = () => {  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [allCategorias, setAllCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Filtros
  const [filters, setFilters] = useState({
    search: '',
    estado: '',
  });
  const [allFilteredCategorias, setAllFilteredCategorias] = useState<Categoria[]>([]);
  const [isUsingFrontendPagination, setIsUsingFrontendPagination] = useState(false);

  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  // Modal states
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Función para mostrar notificaciones
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };
  // Cargar categorías con paginación
  const loadCategories = useCallback(async (page = 1, search = '') => {
    try {
      setIsLoading(true);
      
      if (isUsingFrontendPagination) {
        // Usar datos ya filtrados en frontend
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setCategorias(allFilteredCategorias.slice(startIndex, endIndex));
        setTotalPages(Math.ceil(allFilteredCategorias.length / itemsPerPage));
        setTotalItems(allFilteredCategorias.length);
      } else {
        // Usar paginación del backend
        const response = await categoriasService.obtenerConPaginacion(page, itemsPerPage, search);
        setCategorias(response.data);
        setTotalPages(response.totalPages);
        setTotalItems(response.total);
        setCurrentPage(response.page);
      }
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      showNotification('error', 'Error al cargar categorías');
      setCategorias([]);
    } finally {
      setIsLoading(false);
    }
  }, [isUsingFrontendPagination, allFilteredCategorias, itemsPerPage]);

  // Cargar todas las categorías para estadísticas y filtros especiales
  const loadAllCategories = useCallback(async () => {
    try {
      const response = await categoriasService.obtenerTodasAdmin();
      setAllCategorias(response.data);
    } catch (error) {
      console.error('Error al cargar todas las categorías:', error);
    }
  }, []);

  // Manejar cambio de filtros
  const handleFilterChange = useCallback(async (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);

    // Si hay filtros especiales (estado), usar paginación frontend
    const hasSpecialFilters = newFilters.estado !== '';
    
    if (hasSpecialFilters) {
      let filtered = allCategorias;
      
      // Filtro de estado
      if (newFilters.estado === 'activa') {
        filtered = filtered.filter(cat => cat.activo);
      } else if (newFilters.estado === 'inactiva') {
        filtered = filtered.filter(cat => !cat.activo);
      }
      
      // Filtro de búsqueda local
      if (newFilters.search) {
        filtered = filtered.filter(cat =>
          cat.nombre.toLowerCase().includes(newFilters.search.toLowerCase()) ||
          (cat.descripcion && cat.descripcion.toLowerCase().includes(newFilters.search.toLowerCase()))
        );
      }
      
      setAllFilteredCategorias(filtered);
      setIsUsingFrontendPagination(true);
      
      // Mostrar primera página de resultados filtrados
      const startIndex = 0;
      const endIndex = itemsPerPage;
      setCategorias(filtered.slice(startIndex, endIndex));
      setTotalPages(Math.ceil(filtered.length / itemsPerPage));
      setTotalItems(filtered.length);
      setCurrentPage(1);
      setIsLoading(false);
    } else {
      // Solo búsqueda simple, usar backend
      setIsUsingFrontendPagination(false);
      await loadCategories(1, newFilters.search);
    }
  }, [allCategorias, itemsPerPage, loadCategories]);
  // Limpiar filtros
  const clearFilters = useCallback(() => {
    const clearedFilters = {
      search: '',
      estado: '',
    };
    setFilters(clearedFilters);
    setIsUsingFrontendPagination(false);
    loadCategories(1, '');
  }, [loadCategories]);

  // Contar filtros activos
  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter(value => value !== '' && value !== undefined).length;
  }, [filters]);

  // Cambiar página
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    if (isUsingFrontendPagination) {
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setCategorias(allFilteredCategorias.slice(startIndex, endIndex));
    } else {
      loadCategories(page, filters.search);
    }
  }, [isUsingFrontendPagination, allFilteredCategorias, itemsPerPage, loadCategories, filters.search]);  useEffect(() => {
    loadCategories();
    loadAllCategories();
  }, [loadCategories, loadAllCategories]);// Cambiar estado de categoría
  const handleToggleEstado = async (id: number, activo: boolean) => {
    try {
      await categoriasService.cambiarEstado(id, !activo);
      await loadCategories(currentPage, filters.search);
      await loadAllCategories();
      showNotification('success', `Categoría ${!activo ? 'activada' : 'desactivada'} correctamente`);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      showNotification('error', 'Error al cambiar estado de la categoría');
    }
  };

  const CategoriaRow: React.FC<{ categoria: Categoria; onView: () => void; onEdit: () => void; onToggle: () => void }> = ({ categoria, onView, onEdit, onToggle }) => (
    <tr className="hover:bg-[#F5E6C6]/20 transition-colors duration-200">
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-[#F5E6C6]/30 rounded-lg flex items-center justify-center mr-3">
            <FolderOpen className="w-6 h-6 text-[#CC9F53]" />
          </div>
          <div>
            <p className="font-medium text-[#3A3A3A]">{categoria.nombre}</p>
            <p className="text-sm text-[#9A8C61]">ID: {categoria.id}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <p className="text-[#3A3A3A] max-w-xs truncate">
          {categoria.descripcion || 'Sin descripción'}
        </p>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center">
          <Package className="w-4 h-4 text-[#CC9F53] mr-2" />
          <span className="font-medium text-[#3A3A3A]">
            {categoria._count?.productos || 0}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          categoria.activo
            ? 'bg-green-100 text-green-800 border border-green-200'
            : 'bg-gray-100 text-gray-800 border border-gray-200'
        }`}>
          {categoria.activo ? 'Activa' : 'Inactiva'}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onView}
            className="hover:bg-[#F5E6C6]/30"
            title="Ver detalles"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="hover:bg-[#F5E6C6]/30"
            title="Editar categoría"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className={`${
              categoria.activo 
                ? 'text-orange-600 hover:bg-orange-50' 
                : 'text-green-600 hover:bg-green-50'
            }`}
            title={categoria.activo ? 'Desactivar categoría' : 'Activar categoría'}
          >
            <Power className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' 
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            {notification.message}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#3A3A3A]">Gestión de Categorías</h1>
          <p className="text-[#9A8C61] mt-1">
            Organiza productos en categorías y subcategorías
          </p>
        </div>        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-gradient-to-r from-[#CC9F53] to-[#b08a3c] hover:from-[#b08a3c] hover:to-[#9a7635] text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Crear Categoría
        </Button>
      </div>      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#9A8C61]">Total</p>
              <p className="text-2xl font-bold text-[#3A3A3A]">
                {isUsingFrontendPagination ? allFilteredCategorias.length : totalItems}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#9A8C61]">Con Productos</p>
              <p className="text-2xl font-bold text-[#3A3A3A]">
                {allCategorias.filter(c => c._count?.productos && c._count.productos > 0).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Tag className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">              <p className="text-sm font-medium text-[#9A8C61]">Activas</p>
              <p className="text-2xl font-bold text-[#3A3A3A]">
                {allCategorias.filter(c => c.activo).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#9A8C61]">Inactivas</p>
              <p className="text-2xl font-bold text-[#3A3A3A]">
                {allCategorias.filter(c => !c.activo).length}
              </p>
            </div>
          </div>
        </div>
      </div>      {/* Filtros */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Búsqueda */}
          <div className="relative">
            <label className="block text-xs font-medium text-[#9A8C61] mb-1">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9A8C61] h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar categorías..."
                value={filters.search}
                onChange={(e) => {
                  const newFilters = { ...filters, search: e.target.value };
                  setFilters(newFilters);
                  handleFilterChange(newFilters);
                }}
                className="pl-10 border-[#ecd8ab]/50 focus:border-[#CC9F53] focus:ring-[#CC9F53]/20 text-sm"
              />
            </div>
          </div>
          
          {/* Filtro Estado */}
          <div>
            <label className="block text-xs font-medium text-[#9A8C61] mb-1">
              Estado
            </label>
            <select
              value={filters.estado}
              onChange={(e) => {
                const newFilters = { ...filters, estado: e.target.value };
                setFilters(newFilters);
                handleFilterChange(newFilters);
              }}
              className="w-full px-3 py-2 border border-[#ecd8ab]/50 rounded-md focus:border-[#CC9F53] focus:ring-[#CC9F53]/20 bg-white text-sm"
            >
              <option value="">Todos los estados</option>
              <option value="activa">Activas</option>
              <option value="inactiva">Inactivas</option>
            </select>
          </div>

          {/* Espacios vacíos para mantener la estructura */}
          <div></div>
          <div></div>

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
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#ecd8ab]/30 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CC9F53] mx-auto mb-4"></div>
            <p className="text-[#9A8C61]">Cargando categorías...</p>
          </div>
        ) : categorias.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#CC9F53] to-[#b08a3c] rounded-xl flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-[#3A3A3A] mb-2">
              {categorias.length === 0 ? 'No hay categorías' : 'Sin resultados'}
            </h3>
            <p className="text-[#9A8C61] mb-6">
              {categorias.length === 0 
                ? 'Aún no tienes categorías. Crea la primera para organizar tus productos.'
                : 'No se encontraron categorías que coincidan con tu búsqueda.'
              }
            </p>
          </div>        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#F5E6C6]/50 to-[#FAF3E7]/30 border-b border-[#ecd8ab]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">Categoría</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">Descripción</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">Productos</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">Estado</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-[#3A3A3A]">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ecd8ab]/30">
                {categorias.map((categoria: Categoria) => (
                  <CategoriaRow
                    key={categoria.id}
                    categoria={categoria}
                    onView={() => { setSelectedCategoria(categoria); setIsViewModalOpen(true); }}
                    onEdit={() => { setSelectedCategoria(categoria); setIsEditModalOpen(true); }}
                    onToggle={() => handleToggleEstado(categoria.id, categoria.activo)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center justify-between">
            <div className="text-sm text-[#9A8C61]">
              Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} - {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} categorías
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="border-[#ecd8ab] text-[#9A8C61] hover:bg-[#F5E6C6]/20"
              >
                Anterior
              </Button>
              
              {/* Números de página */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className={currentPage === pageNum 
                        ? "bg-[#CC9F53] text-white hover:bg-[#b08a3c]" 
                        : "border-[#ecd8ab] text-[#9A8C61] hover:bg-[#F5E6C6]/20"
                      }
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="border-[#ecd8ab] text-[#9A8C61] hover:bg-[#F5E6C6]/20"
              >
                Siguiente
              </Button>
            </div>
          </div>
        </div>
      )}      {/* Modals */}
      <CreateCategoriaModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          loadCategories(currentPage, filters.search);
          loadAllCategories();
          setIsCreateModalOpen(false);
          showNotification('success', 'Categoría creada correctamente');
        }}
        onError={(message) => showNotification('error', message)}
      />

      <EditCategoriaModal
        categoria={selectedCategoria}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCategoria(null);
        }}
        onSuccess={() => {
          loadCategories(currentPage, filters.search);
          loadAllCategories();
          setIsEditModalOpen(false);
          setSelectedCategoria(null);
          showNotification('success', 'Categoría actualizada correctamente');
        }}
        onError={(message) => showNotification('error', message)}
      />

      {/* Categoria Detail Modal */}
      {selectedCategoria && (
        <EnhancedCategoriaDetailModal
          categoria={selectedCategoria}
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedCategoria(null);
          }}
        />
      )}
    </div>
  );
};

export default CategoriasAdminPage;
