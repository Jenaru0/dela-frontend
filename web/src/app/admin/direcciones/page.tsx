'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { 
  Search,
  MapPin,
  Star,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { direccionesService } from '@/services/direcciones.service';
import { DireccionClienteConUsuario } from '@/types/direcciones';

// Interfaces para filtros (siguiendo patrón de productos y usuarios)
interface FilterState {
  search: string;
  estado: string; // 'activa', 'inactiva', ''
  predeterminada: string; // 'si', 'no', ''
  departamento: string; // departamento específico o ''
}

const DireccionesAdminPage: React.FC = () => {
  const [direcciones, setDirecciones] = useState<DireccionClienteConUsuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Estados de paginación (siguiendo patrón de productos y usuarios)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDirecciones, setTotalDirecciones] = useState(0);
  const [statsData, setStatsData] = useState({
    total: 0,
    activas: 0,
    inactivas: 0,
    predeterminadas: 0,
    porDepartamento: {} as { [key: string]: number }
  });
  const itemsPerPage = 10;

  // Estados de filtros (siguiendo patrón de productos y usuarios)
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    estado: '',
    predeterminada: '',
    departamento: ''
  });

  // Estados para manejar direcciones filtradas en frontend (igual que productos y usuarios)
  const [allFilteredDirecciones, setAllFilteredDirecciones] = useState<DireccionClienteConUsuario[]>([]);
  const [isUsingFrontendPagination, setIsUsingFrontendPagination] = useState(false);

  // Función para mostrar notificaciones
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Cargar direcciones con paginación (siguiendo patrón de productos y usuarios)
  const loadDirecciones = useCallback(async (page: number = 1, scrollToTop: boolean = true) => {
    try {
      setIsLoading(true);
      
      // Scroll hacia arriba suavemente cuando se cambia de página
      if (scrollToTop && page !== currentPage) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }

      // Detectar si necesitamos filtros especiales (frontend) como productos y usuarios
      const needsFrontendFiltering = filters.estado || filters.predeterminada || filters.departamento;
      
      if (needsFrontendFiltering) {
        // Obtener TODAS las direcciones y filtrar en frontend
        const response = await direccionesService.obtenerTodasAdmin();
        let allDirecciones = response.data;
        
        // Ordenar por ID ascendente
        allDirecciones = allDirecciones.sort((a, b) => a.id - b.id);
        
        // Aplicar filtros especiales en frontend
        if (filters.estado === 'activa') {
          allDirecciones = allDirecciones.filter(direccion => direccion.activa === true);
        } else if (filters.estado === 'inactiva') {
          allDirecciones = allDirecciones.filter(direccion => direccion.activa === false);
        }
        
        if (filters.predeterminada === 'si') {
          allDirecciones = allDirecciones.filter(direccion => direccion.predeterminada === true);
        } else if (filters.predeterminada === 'no') {
          allDirecciones = allDirecciones.filter(direccion => direccion.predeterminada === false);
        }
        
        if (filters.departamento) {
          allDirecciones = allDirecciones.filter(direccion => 
            direccion.provincia?.toLowerCase().includes(filters.departamento.toLowerCase())
          );
        }
        
        // Aplicar búsqueda en frontend también
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          allDirecciones = allDirecciones.filter(direccion =>
            direccion.direccion?.toLowerCase().includes(searchLower) ||
            direccion.distrito?.toLowerCase().includes(searchLower) ||
            direccion.provincia?.toLowerCase().includes(searchLower) ||
            direccion.alias?.toLowerCase().includes(searchLower) ||
            direccion.usuario?.nombres?.toLowerCase().includes(searchLower) ||
            direccion.usuario?.apellidos?.toLowerCase().includes(searchLower) ||
            direccion.usuario?.email?.toLowerCase().includes(searchLower)
          );
        }
        
        // Guardar todas las direcciones filtradas
        setAllFilteredDirecciones(allDirecciones);
        setIsUsingFrontendPagination(true);
        
        // Calcular paginación en frontend
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedDirecciones = allDirecciones.slice(startIndex, endIndex);
        
        setDirecciones(paginatedDirecciones);
        setTotalDirecciones(allDirecciones.length);
        setTotalPages(Math.ceil(allDirecciones.length / itemsPerPage));
        setCurrentPage(page);
      } else {
        // Paginación normal del backend (sin filtros especiales)
        const backendFilters = {
          search: filters.search || undefined,
        };

        const response = await direccionesService.obtenerConPaginacion(page, itemsPerPage, backendFilters);
        
        // Ordenar por ID ascendente como backup
        const sortedDirecciones = response.data.sort((a: DireccionClienteConUsuario, b: DireccionClienteConUsuario) => a.id - b.id);
        
        setDirecciones(sortedDirecciones);
        setTotalDirecciones(response.total);
        setTotalPages(Math.ceil(response.total / itemsPerPage));
        setCurrentPage(page);
        setAllFilteredDirecciones([]);
        setIsUsingFrontendPagination(false);
      }
    } catch (error) {
      console.error('Error al cargar direcciones:', error);
      showNotification('error', 'Error al cargar direcciones');
      setDirecciones([]);
      setAllFilteredDirecciones([]);
      setIsUsingFrontendPagination(false);
    } finally {
      setIsLoading(false);
    }
  }, [filters, currentPage]);

  // Cargar estadísticas (igual que productos y usuarios)
  const loadStats = useCallback(async () => {
    try {
      // Obtener todas las direcciones para calcular estadísticas (sin filtros)
      const response = await direccionesService.obtenerTodasAdmin();
      const todasLasDirecciones = response.data.sort((a, b) => a.id - b.id);
      
      // Calcular estadísticas locales
      const departamentos: { [key: string]: number } = {};
      todasLasDirecciones.forEach(dir => {
        if (dir.provincia) {
          departamentos[dir.provincia] = (departamentos[dir.provincia] || 0) + 1;
        }
      });

      const stats = {
        total: todasLasDirecciones.length,
        activas: todasLasDirecciones.filter(d => d.activa).length,
        inactivas: todasLasDirecciones.filter(d => !d.activa).length,
        predeterminadas: todasLasDirecciones.filter(d => d.predeterminada).length,
        porDepartamento: departamentos
      };
      
      setStatsData(stats);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  }, []);

  // Cargar direcciones y estadísticas al montar el componente
  useEffect(() => {
    loadDirecciones();
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recargar direcciones cuando cambien los filtros
  useEffect(() => {
    if (filters.search || filters.estado || filters.predeterminada || filters.departamento) {
      setCurrentPage(1); // Reset a página 1 cuando hay filtros
      loadDirecciones(1);
    } else {
      loadDirecciones(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, currentPage]);

  // Función para manejar cambio de filtros
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Función para limpiar filtros
  const clearFilters = () => {
    setFilters({
      search: '',
      estado: '',
      predeterminada: '',
      departamento: ''
    });
  };
  // Contar filtros activos
  const activeFiltersCount = Object.entries(filters).filter(([, value]) => {
    return value !== '';
  }).length;

  // Manejar cambio de página (igual que productos y usuarios)
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
      const paginatedDirecciones = allFilteredDirecciones.slice(startIndex, endIndex);
      
      setDirecciones(paginatedDirecciones);
      setCurrentPage(newPage);
    } else {
      // Si estamos usando paginación backend (sin filtros especiales)
      loadDirecciones(newPage, false); // false porque ya hicimos scroll arriba
    }
  };

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
          <h1 className="text-3xl font-bold text-[#3A3A3A]">Gestión de Direcciones</h1>
          <p className="text-[#9A8C61] mt-1">
            Administra todas las direcciones de entrega de los usuarios
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#9A8C61]">Total Direcciones</p>
              <p className="text-2xl font-bold text-[#3A3A3A]">{statsData.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#9A8C61]">Direcciones Activas</p>
              <p className="text-2xl font-bold text-[#3A3A3A]">{statsData.activas}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#9A8C61]">Direcciones Inactivas</p>
              <p className="text-2xl font-bold text-[#3A3A3A]">{statsData.inactivas}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#9A8C61]">Predeterminadas</p>
              <p className="text-2xl font-bold text-[#3A3A3A]">{statsData.predeterminadas}</p>
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
                placeholder="Buscar direcciones..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
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
              onChange={(e) => handleFilterChange('estado', e.target.value)}
              className="w-full px-3 py-2 border border-[#ecd8ab]/50 rounded-md focus:border-[#CC9F53] focus:ring-[#CC9F53]/20 bg-white text-sm"
            >
              <option value="">Todos los estados</option>
              <option value="activa">Activa</option>
              <option value="inactiva">Inactiva</option>
            </select>
          </div>

          {/* Filtro Predeterminada */}
          <div>
            <label className="block text-xs font-medium text-[#9A8C61] mb-1">
              Predeterminada
            </label>
            <select
              value={filters.predeterminada}
              onChange={(e) => handleFilterChange('predeterminada', e.target.value)}
              className="w-full px-3 py-2 border border-[#ecd8ab]/50 rounded-md focus:border-[#CC9F53] focus:ring-[#CC9F53]/20 bg-white text-sm"
            >
              <option value="">Todas</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </div>

          {/* Filtro Departamento */}
          <div>
            <label className="block text-xs font-medium text-[#9A8C61] mb-1">
              Departamento
            </label>
            <select
              value={filters.departamento}
              onChange={(e) => handleFilterChange('departamento', e.target.value)}
              className="w-full px-3 py-2 border border-[#ecd8ab]/50 rounded-md focus:border-[#CC9F53] focus:ring-[#CC9F53]/20 bg-white text-sm"
            >
              <option value="">Todos los departamentos</option>
              <option value="Lima">Lima</option>
              <option value="Arequipa">Arequipa</option>
              <option value="Cusco">Cusco</option>
              <option value="Trujillo">Trujillo</option>
              <option value="Piura">Piura</option>
              <option value="Chiclayo">Chiclayo</option>
              <option value="Huancayo">Huancayo</option>
            </select>
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
      </div>

      {/* Direcciones Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#ecd8ab]/30 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CC9F53] mx-auto"></div>
            <p className="mt-4 text-[#9A8C61]">Cargando direcciones...</p>
          </div>
        ) : direcciones.length === 0 ? (
          <div className="p-8 text-center">
            <MapPin className="h-12 w-12 text-[#CC9F53]/60 mx-auto mb-4" />
            <p className="text-[#9A8C61]">No se encontraron direcciones</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#F5E6C6]/50 to-[#FAF3E7]/30 border-b border-[#ecd8ab]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">Dirección</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">Usuario</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">Ubicación</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">Estado</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">Predeterminada</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">Fecha Creación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ecd8ab]/30">
                {direcciones.map((direccion) => (
                  <tr key={direccion.id} className="hover:bg-[#F5E6C6]/20 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#CC9F53] to-[#b08a3c] rounded-full text-white font-semibold mr-3">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-[#3A3A3A]">
                            {direccion.alias || 'Sin alias'}
                          </p>
                          <p className="text-sm text-[#9A8C61]">{direccion.direccion}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="font-medium text-[#3A3A3A]">
                          {direccion.usuario?.nombres} {direccion.usuario?.apellidos}
                        </p>
                        <p className="text-sm text-[#9A8C61]">{direccion.usuario?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm text-[#3A3A3A]">{direccion.distrito}</p>
                        <p className="text-xs text-[#9A8C61]">{direccion.provincia}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        direccion.activa
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {direccion.activa ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Activa
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Inactiva
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        direccion.predeterminada
                          ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                          : 'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}>
                        {direccion.predeterminada ? (
                          <>
                            <Star className="h-3 w-3 mr-1" />
                            Sí
                          </>
                        ) : (
                          'No'
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#9A8C61]">
                      {direccion.creadoEn 
                        ? new Date(direccion.creadoEn).toLocaleDateString('es-ES')
                        : 'No disponible'
                      }
                    </td>
                  </tr>
                ))}
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
              Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, totalDirecciones)} de {totalDirecciones} direcciones
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
    </div>
  );
};

export default DireccionesAdminPage;
