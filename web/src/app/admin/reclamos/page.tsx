'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import {
  MessageSquare,
  Eye,
  Edit,
  Search,
  MessageCircle,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  AlertCircle,
  X,
  Package,
} from 'lucide-react';
import {
  reclamosService,
  Reclamo,
  UpdateReclamoDto,
} from '@/services/reclamos.service';
import {
  EstadoReclamo,
  EstadoReclamoLabels,
  EstadoReclamoColors,
  PrioridadReclamo,
  PrioridadReclamoLabels,
  PrioridadReclamoColors,
  TipoReclamo,
  TipoReclamoLabels,
} from '@/types/enums';
import EnhancedReclamoDetailModal from '@/components/admin/modals/reclamo/EnhancedReclamoDetailModal';
import ReclamoManageModal from '@/components/admin/modals/reclamo/ReclamoManageModal';

interface FilterState {
  search: string;
  estado: string;
  prioridad: string;
  tipoReclamo: string;
  fechaInicio: string;
  fechaFin: string;
}

const ReclamosAdminPage: React.FC = () => {
  const [reclamos, setReclamos] = useState<Reclamo[]>([]);
  const [allReclamos, setAllReclamos] = useState<Reclamo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Filtros
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    estado: '',
    prioridad: '',
    tipoReclamo: '',
    fechaInicio: '',
    fechaFin: '',
  });
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Estados para los modales
  const [selectedReclamo, setSelectedReclamo] = useState<Reclamo | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  // Función para mostrar notificaciones
  const showNotification = useCallback(
    (type: 'success' | 'error', message: string) => {
      setNotification({ type, message });
      setTimeout(() => setNotification(null), 5000);
    },
    []
  );

  // Funciones para manejar los modales
  const handleViewDetails = (reclamo: Reclamo) => {
    setSelectedReclamo(reclamo);
    setIsDetailModalOpen(true);
  };

  const handleOpenManageModal = (reclamo: Reclamo) => {
    setSelectedReclamo(reclamo);
    setIsManageModalOpen(true);
  };

  const handleCloseModals = () => {
    setSelectedReclamo(null);
    setIsDetailModalOpen(false);
    setIsManageModalOpen(false);
  };
  const handleReclamoUpdated = async () => {
    // Recargar todos los reclamos para actualizar estadísticas
    try {
      // Usar obtenerConPaginacion con límite alto para obtener todos los reclamos
      const allResponse = await reclamosService.obtenerConPaginacion(1, 9999);

      if (allResponse.data && Array.isArray(allResponse.data)) {
        setAllReclamos(allResponse.data);
      } else {
        setAllReclamos([]);
      }
    } catch (error) {
      console.error('❌ Error al recargar todos los reclamos:', error);
    }

    // Recargar los datos de la página actual
    await loadReclamos(
      currentPage,
      filters.search,
      filters.estado,
      filters.prioridad,
      filters.tipoReclamo,
      filters.fechaInicio,
      filters.fechaFin
    );
    showNotification('success', 'Reclamo actualizado correctamente');
  };

  // Calcular estadísticas desde allReclamos
  const stats = useMemo(() => {
    if (!Array.isArray(allReclamos)) {
      return { total: 0, abiertos: 0, enProceso: 0, resueltos: 0, criticos: 0 };
    }

    const estadisticas = {
      total: allReclamos.length,
      abiertos: allReclamos.filter((r) => r.estado === EstadoReclamo.ABIERTO)
        .length,
      enProceso: allReclamos.filter(
        (r) => r.estado === EstadoReclamo.EN_PROCESO
      ).length,
      resueltos: allReclamos.filter((r) => r.estado === EstadoReclamo.RESUELTO)
        .length,
      criticos: allReclamos.filter(
        (r) => r.prioridad === PrioridadReclamo.CRITICA
      ).length,
    };

    return estadisticas;
  }, [allReclamos]); // Función para verificar si un filtro de estadística está activo
  const isStatFilterActive = (
    filterType: 'total' | 'abierto' | 'proceso' | 'resuelto' | 'critico'
  ) => {
    switch (filterType) {
      case 'total':
        return !filters.estado && !filters.prioridad;
      case 'abierto':
        return filters.estado === EstadoReclamo.ABIERTO;
      case 'proceso':
        return filters.estado === EstadoReclamo.EN_PROCESO;
      case 'resuelto':
        return filters.estado === EstadoReclamo.RESUELTO;
      case 'critico':
        return filters.prioridad === PrioridadReclamo.CRITICA;
      default:
        return false;
    }
  };

  // Función para aplicar filtro por estadística
  const handleStatFilter = (
    filterType: 'total' | 'abierto' | 'proceso' | 'resuelto' | 'critico'
  ) => {
    const baseFilters = { ...filters, estado: '', prioridad: '' };
    
    let newFilters;
    switch (filterType) {
      case 'total':
        newFilters = baseFilters;
        break;
      case 'abierto':
        newFilters = { ...baseFilters, estado: EstadoReclamo.ABIERTO };
        break;
      case 'proceso':
        newFilters = { ...baseFilters, estado: EstadoReclamo.EN_PROCESO };
        break;
      case 'resuelto':
        newFilters = { ...baseFilters, estado: EstadoReclamo.RESUELTO };
        break;
      case 'critico':
        newFilters = { ...baseFilters, prioridad: PrioridadReclamo.CRITICA };
        break;
      default:
        newFilters = baseFilters;
        break;
    }

    handleFilterChange(newFilters);
  };

  // Cargar reclamos con paginación (función simple)
  const loadReclamos = useCallback(
    async (
      page = 1,
      search = '',
      estado = '',
      prioridad = '',
      tipoReclamo = '',
      fechaInicio = '',
      fechaFin = ''
    ) => {
      try {
        setIsLoading(true);

        // Usar paginación del backend
        const response = await reclamosService.obtenerConPaginacion(
          page,
          itemsPerPage,
          search,
          (estado as EstadoReclamo) || undefined,
          (prioridad as PrioridadReclamo) || undefined,
          (tipoReclamo as TipoReclamo) || undefined,
          fechaInicio,
          fechaFin
        );
        setReclamos(response.data);
        setTotalPages(response.totalPages);
        setTotalItems(response.total);
        setCurrentPage(response.page);
      } catch (error) {
        console.error('Error al cargar reclamos:', error);
        showNotification('error', 'Error al cargar reclamos');
        setReclamos([]);
      } finally {
        setIsLoading(false);
      }
    },
    [itemsPerPage, showNotification]
  );

  // Cargar reclamos iniciales al montar
  useEffect(() => {
    const loadInitialData = async () => {
      console.log('� Cargando datos iniciales...');

      try {
        setIsLoading(true);

        const allResponse = await reclamosService.obtenerConPaginacion(1, 9999);

        if (allResponse.data && Array.isArray(allResponse.data)) {
          setAllReclamos(allResponse.data);
        } else {
          setAllReclamos([]);
        }

        // Cargar la primera página para la tabla
        const response = await reclamosService.obtenerConPaginacion(
          1,
          itemsPerPage,
          '',
          undefined, // estado como undefined
          undefined, // prioridad como undefined
          undefined, // tipoReclamo como undefined
          '',
          ''
        );
        setReclamos(response.data);
        setTotalPages(response.totalPages);
        setTotalItems(response.total);
        setCurrentPage(response.page);
      } catch (error) {
        console.error('Error al cargar reclamos iniciales:', error);
        setReclamos([]);
        setAllReclamos([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [itemsPerPage]); // Solo depende de itemsPerPage
  const handleFilterChange = useCallback(
    async (newFilters: FilterState) => {
      console.log('🔍 Aplicando filtros:', newFilters);
      setFilters(newFilters);
      setCurrentPage(1);

      // Usar siempre el backend para filtros (simplificado)
      await loadReclamos(
        1,
        newFilters.search,
        newFilters.estado,
        newFilters.prioridad,
        newFilters.tipoReclamo,
        newFilters.fechaInicio,
        newFilters.fechaFin
      );
    },
    [loadReclamos]
  );

  // Función para manejar cambio individual de filtros (patrón consistente)
  const handleSingleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    handleFilterChange(newFilters);
  };

  // Contar filtros activos (patrón consistente)
  const activeFiltersCount = Object.entries(filters).filter(([, value]) => {
    return value !== '';
  }).length;
  const clearFilters = () => {
    const emptyFilters: FilterState = {
      search: '',
      estado: '',
      prioridad: '',
      tipoReclamo: '',
      fechaInicio: '',
      fechaFin: '',
    };
    handleFilterChange(emptyFilters);
  };
  // Cambiar página
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    loadReclamos(
      newPage,
      filters.search,
      filters.estado,
      filters.prioridad,
      filters.tipoReclamo,
      filters.fechaInicio,
      filters.fechaFin
    );
  };

  // Actualizar reclamo
  const handleUpdateReclamo = async (id: number, data: UpdateReclamoDto) => {
    try {
      await reclamosService.actualizar(id, data);
      await handleReclamoUpdated();
    } catch (error) {
      console.error('Error al actualizar reclamo:', error);
      showNotification('error', 'Error al actualizar reclamo');
    }
  };

  // Recargar un reclamo específico
  const handleReloadReclamo = async (reclamoId: number) => {
    try {
      console.log('🔄 Recargando reclamo específico:', reclamoId);
      const updatedReclamo = await reclamosService.obtenerPorId(reclamoId);
      console.log('📄 Reclamo recargado:', updatedReclamo.data);
      console.log(
        'Comentarios en reclamo recargado:',
        updatedReclamo.data.comentarios
      );
      setSelectedReclamo(updatedReclamo.data);
    } catch (error) {
      console.error('❌ Error al recargar reclamo:', error);
    }
  };

  // Agregar comentario
  const handleAddComment = async (
    reclamoId: number,
    comentario: string,
    esInterno: boolean
  ) => {
    try {
      console.log('🔄 Agregando comentario...', {
        reclamoId,
        comentario,
        esInterno,
      });

      // Agregar el comentario
      const comentarioResponse = await reclamosService.agregarComentario(
        reclamoId,
        comentario,
        esInterno
      );
      console.log('✅ Comentario agregado:', comentarioResponse);

      // Recargar los datos del reclamo específico
      console.log('🔄 Recargando datos del reclamo...');
      const updatedReclamo = await reclamosService.obtenerPorId(reclamoId);
      console.log('📄 Reclamo actualizado:', updatedReclamo.data);
      console.log(
        '💬 Comentarios en reclamo actualizado:',
        updatedReclamo.data.comentarios
      );

      // Actualizar el reclamo seleccionado
      setSelectedReclamo(updatedReclamo.data);

      // Recargar la lista completa (para actualizar contadores)
      await handleReclamoUpdated();

      showNotification('success', 'Comentario agregado correctamente');
    } catch (error) {
      console.error('❌ Error al agregar comentario:', error);
      showNotification('error', 'Error al agregar comentario');
    }
  };

  const getStatusIcon = (estado: EstadoReclamo) => {
    switch (estado) {
      case EstadoReclamo.ABIERTO:
        return <Clock className="w-4 h-4" />;
      case EstadoReclamo.EN_PROCESO:
        return <MessageCircle className="w-4 h-4" />;
      case EstadoReclamo.RESUELTO:
        return <CheckCircle className="w-4 h-4" />;
      case EstadoReclamo.RECHAZADO:
        return <XCircle className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getPriorityIcon = (prioridad: PrioridadReclamo) => {
    switch (prioridad) {
      case PrioridadReclamo.CRITICA:
        return <AlertTriangle className="w-4 h-4" />;
      case PrioridadReclamo.ALTA:
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-40 p-4 rounded-lg shadow-lg ${
            notification.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <XCircle className="h-5 w-5 mr-2" />
            )}
            {notification.message}
          </div>
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#3A3A3A]">
            Gestión de Reclamos
          </h1>
          <p className="text-[#9A8C61] mt-1">
            Administra y resuelve reclamos de clientes
          </p>
        </div>
      </div>
      {/* Stats Cards - Compact Design */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Total */}
        <button
          onClick={() => handleStatFilter('total')}
          className={`bg-white rounded-xl p-4 shadow-sm border transition-all duration-200 text-left transform hover:scale-105 ${
            isStatFilterActive('total')
              ? 'border-[#CC9F53] bg-[#F5E6C6]/20 shadow-md'
              : 'border-[#ecd8ab]/30 hover:border-[#CC9F53]/50 hover:shadow-md'
          }`}
          title="Ver todos los reclamos"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-[#9A8C61]">Total</p>
              <p className="text-xl font-bold text-[#3A3A3A]">{stats.total}</p>
            </div>
          </div>
        </button>

        {/* Abiertos */}
        <button
          onClick={() => handleStatFilter('abierto')}
          className={`bg-white rounded-xl p-4 shadow-sm border transition-all duration-200 text-left transform hover:scale-105 ${
            isStatFilterActive('abierto')
              ? 'border-[#CC9F53] bg-[#F5E6C6]/20 shadow-md'
              : 'border-[#ecd8ab]/30 hover:border-[#CC9F53]/50 hover:shadow-md'
          }`}
          title="Filtrar reclamos abiertos"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-[#9A8C61]">Abiertos</p>
              <p className="text-xl font-bold text-[#3A3A3A]">
                {stats.abiertos}
              </p>
            </div>
          </div>
        </button>

        {/* En Proceso */}
        <button
          onClick={() => handleStatFilter('proceso')}
          className={`bg-white rounded-xl p-4 shadow-sm border transition-all duration-200 text-left transform hover:scale-105 ${
            isStatFilterActive('proceso')
              ? 'border-[#CC9F53] bg-[#F5E6C6]/20 shadow-md'
              : 'border-[#ecd8ab]/30 hover:border-[#CC9F53]/50 hover:shadow-md'
          }`}
          title="Filtrar reclamos en proceso"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-[#9A8C61]">En Proceso</p>
              <p className="text-xl font-bold text-[#3A3A3A]">
                {stats.enProceso}
              </p>
            </div>
          </div>
        </button>

        {/* Resueltos */}
        <button
          onClick={() => handleStatFilter('resuelto')}
          className={`bg-white rounded-xl p-4 shadow-sm border transition-all duration-200 text-left transform hover:scale-105 ${
            isStatFilterActive('resuelto')
              ? 'border-[#CC9F53] bg-[#F5E6C6]/20 shadow-md'
              : 'border-[#ecd8ab]/30 hover:border-[#CC9F53]/50 hover:shadow-md'
          }`}
          title="Filtrar reclamos resueltos"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-[#9A8C61]">Resueltos</p>
              <p className="text-xl font-bold text-[#3A3A3A]">
                {stats.resueltos}
              </p>
            </div>
          </div>
        </button>

        {/* Críticos */}
        <button
          onClick={() => handleStatFilter('critico')}
          className={`bg-white rounded-xl p-4 shadow-sm border transition-all duration-200 text-left transform hover:scale-105 ${
            isStatFilterActive('critico')
              ? 'border-[#CC9F53] bg-[#F5E6C6]/20 shadow-md'
              : 'border-[#ecd8ab]/30 hover:border-[#CC9F53]/50 hover:shadow-md'
          }`}
          title="Filtrar reclamos críticos"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-[#9A8C61]">Críticos</p>
              <p className="text-xl font-bold text-[#3A3A3A]">
                {stats.criticos}
              </p>
            </div>
          </div>
        </button>
      </div>{' '}
      {/* Filters */}
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
                placeholder="Buscar reclamos..."
                value={filters.search}
                onChange={(e) =>
                  handleSingleFilterChange('search', e.target.value)
                }
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
              onChange={(e) =>
                handleSingleFilterChange('estado', e.target.value)
              }
              className="w-full px-3 py-2 border border-[#ecd8ab]/50 rounded-md focus:border-[#CC9F53] focus:ring-[#CC9F53]/20 bg-white text-sm"
            >
              <option value="">Todos los estados</option>
              {Object.values(EstadoReclamo).map((estado) => (
                <option key={estado} value={estado}>
                  {EstadoReclamoLabels[estado]}
                </option>
              ))}
            </select>
          </div>
          {/* Filtro Prioridad */}
          <div>
            <label className="block text-xs font-medium text-[#9A8C61] mb-1">
              Prioridad
            </label>
            <select
              value={filters.prioridad}
              onChange={(e) =>
                handleSingleFilterChange('prioridad', e.target.value)
              }
              className="w-full px-3 py-2 border border-[#ecd8ab]/50 rounded-md focus:border-[#CC9F53] focus:ring-[#CC9F53]/20 bg-white text-sm"
            >
              <option value="">Todas las prioridades</option>
              {Object.values(PrioridadReclamo).map((prioridad) => (
                <option key={prioridad} value={prioridad}>
                  {PrioridadReclamoLabels[prioridad]}
                </option>
              ))}
            </select>
          </div>
          {/* Filtro Tipo */}
          <div>
            <label className="block text-xs font-medium text-[#9A8C61] mb-1">
              Tipo
            </label>
            <select
              value={filters.tipoReclamo}
              onChange={(e) =>
                handleSingleFilterChange('tipoReclamo', e.target.value)
              }
              className="w-full px-3 py-2 border border-[#ecd8ab]/50 rounded-md focus:border-[#CC9F53] focus:ring-[#CC9F53]/20 bg-white text-sm"
            >
              <option value="">Todos los tipos</option>
              {Object.values(TipoReclamo).map((tipo) => (
                <option key={tipo} value={tipo}>
                  {TipoReclamoLabels[tipo]}
                </option>
              ))}
            </select>
          </div>
          {/* Fecha Desde */}
          <div>
            <label className="block text-xs font-medium text-[#9A8C61] mb-1">
              Desde
            </label>
            <Input
              type="date"
              value={filters.fechaInicio}
              max={filters.fechaFin || undefined}
              onChange={(e) =>
                handleSingleFilterChange('fechaInicio', e.target.value)
              }
              className="border-[#ecd8ab]/50 focus:border-[#CC9F53] focus:ring-[#CC9F53]/20 text-sm"
            />
          </div>{' '}
          {/* Fecha Hasta */}
          <div>
            <label className="block text-xs font-medium text-[#9A8C61] mb-1">
              Hasta
            </label>
            <Input
              type="date"
              value={filters.fechaFin}
              min={filters.fechaInicio || undefined}
              onChange={(e) =>
                handleSingleFilterChange('fechaFin', e.target.value)
              }
              className="border-[#ecd8ab]/50 focus:border-[#CC9F53] focus:ring-[#CC9F53]/20 text-sm"
            />
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

        {/* Atajos rápidos de fechas */}
        <div className="mt-4 pt-4 border-t border-[#ecd8ab]/30">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-[#9A8C61] font-medium">
              Atajos rápidos:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  const today = new Date().toISOString().split('T')[0];
                  const newFilters = {
                    ...filters,
                    fechaInicio: today,
                    fechaFin: today,
                  };
                  handleFilterChange(newFilters);
                }}
                className="text-sm px-3 py-1.5 bg-[#F5E6C6]/40 text-[#CC9F53] rounded-md hover:bg-[#F5E6C6]/60 transition-colors border border-[#CC9F53]/20"
              >
                Hoy
              </button>
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  const weekAgo = new Date(
                    today.getTime() - 7 * 24 * 60 * 60 * 1000
                  );
                  const newFilters = {
                    ...filters,
                    fechaInicio: weekAgo.toISOString().split('T')[0],
                    fechaFin: today.toISOString().split('T')[0],
                  };
                  handleFilterChange(newFilters);
                }}
                className="text-sm px-3 py-1.5 bg-[#F5E6C6]/40 text-[#CC9F53] rounded-md hover:bg-[#F5E6C6]/60 transition-colors border border-[#CC9F53]/20"
              >
                Últimos 7 días
              </button>
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  const monthAgo = new Date(
                    today.getFullYear(),
                    today.getMonth() - 1,
                    today.getDate()
                  );
                  const newFilters = {
                    ...filters,
                    fechaInicio: monthAgo.toISOString().split('T')[0],
                    fechaFin: today.toISOString().split('T')[0],
                  };
                  handleFilterChange(newFilters);
                }}
                className="text-sm px-3 py-1.5 bg-[#F5E6C6]/40 text-[#CC9F53] rounded-md hover:bg-[#F5E6C6]/60 transition-colors border border-[#CC9F53]/20"
              >
                Últimos 30 días
              </button>
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  const yearAgo = new Date(
                    today.getFullYear() - 1,
                    today.getMonth(),
                    today.getDate()
                  );
                  const newFilters = {
                    ...filters,
                    fechaInicio: yearAgo.toISOString().split('T')[0],
                    fechaFin: today.toISOString().split('T')[0],
                  };
                  handleFilterChange(newFilters);
                }}
                className="text-sm px-3 py-1.5 bg-[#F5E6C6]/40 text-[#CC9F53] rounded-md hover:bg-[#F5E6C6]/60 transition-colors border border-[#CC9F53]/20"
              >
                Último año
              </button>
            </div>
          </div>
        </div>

        {/* Botón Limpiar anterior se elimina */}
      </div>
      {/* Claims Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#ecd8ab]/30 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CC9F53] mx-auto mb-4"></div>
            <p className="text-[#9A8C61]">Cargando reclamos...</p>
          </div>
        ) : reclamos.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#CC9F53] to-[#b08a3c] rounded-xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>{' '}
            <h3 className="text-lg font-bold text-[#3A3A3A] mb-2">
              Sin resultados
            </h3>
            <p className="text-[#9A8C61] mb-6">
              No se encontraron reclamos que coincidan con tu búsqueda.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="bg-gradient-to-r from-[#F5E6C6]/50 to-[#FAF3E7]/30 border-b border-[#ecd8ab]">
                <tr>
                  <th className="px-3 md:px-4 py-3 text-left text-xs md:text-sm font-semibold text-[#3A3A3A] w-[30%]">
                    Reclamo
                  </th>
                  <th className="px-3 md:px-4 py-3 text-left text-xs md:text-sm font-semibold text-[#3A3A3A] w-[20%]">
                    Cliente
                  </th>
                  <th className="px-2 md:px-3 py-3 text-left text-xs md:text-sm font-semibold text-[#3A3A3A] w-[12%]">
                    Tipo
                  </th>
                  <th className="px-2 md:px-3 py-3 text-left text-xs md:text-sm font-semibold text-[#3A3A3A] w-[10%]">
                    Prioridad
                  </th>
                  <th className="px-2 md:px-3 py-3 text-left text-xs md:text-sm font-semibold text-[#3A3A3A] w-[10%]">
                    Estado
                  </th>
                  <th className="px-2 md:px-3 py-3 text-left text-xs md:text-sm font-semibold text-[#3A3A3A] w-[10%]">
                    Fecha
                  </th>
                  <th className="px-2 md:px-3 py-3 text-right text-xs md:text-sm font-semibold text-[#3A3A3A] w-[8%]">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ecd8ab]/30">
                {reclamos.map((reclamo) => (
                  <tr
                    key={reclamo.id}
                    className="hover:bg-[#F5E6C6]/20 transition-colors duration-200"
                  >
                    <td className="px-3 md:px-4 py-3">
                      <div className="flex items-start">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-[#F5E6C6]/30 rounded-lg flex items-center justify-center mr-2 md:mr-3 flex-shrink-0">
                          <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-[#CC9F53]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-[#3A3A3A] text-sm md:text-base truncate">
                            {reclamo.asunto}
                          </p>
                          <p className="text-xs md:text-sm text-[#9A8C61] truncate max-w-[200px] md:max-w-xs">
                            {reclamo.descripcion}
                          </p>
                          {reclamo.pedidoId && (
                            <div className="flex items-center mt-1">
                              <Package className="w-3 h-3 text-[#CC9F53] mr-1" />
                              <p className="text-xs text-[#CC9F53]">
                                #{reclamo.pedido?.numero || reclamo.pedidoId}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 md:px-4 py-3">
                      <div className="flex items-center">
                        <User className="w-3 h-3 md:w-4 md:h-4 text-[#CC9F53] mr-1 md:mr-2 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-[#3A3A3A] text-xs md:text-sm truncate">
                            {reclamo.usuario?.nombres}{' '}
                            {reclamo.usuario?.apellidos}
                          </p>
                          <p className="text-xs text-[#9A8C61] truncate">
                            {reclamo.usuario?.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 md:px-3 py-3">
                      <span className="text-xs md:text-sm text-[#3A3A3A] truncate block">
                        {TipoReclamoLabels[reclamo.tipoReclamo]}
                      </span>
                    </td>
                    <td className="px-2 md:px-3 py-3">
                      <span
                        className={`inline-flex items-center px-1.5 md:px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          PrioridadReclamoColors[reclamo.prioridad]
                        }`}
                      >
                        {getPriorityIcon(reclamo.prioridad)}
                        <span
                          className={
                            getPriorityIcon(reclamo.prioridad)
                              ? 'ml-1 hidden md:inline'
                              : 'hidden md:inline'
                          }
                        >
                          {PrioridadReclamoLabels[reclamo.prioridad]}
                        </span>
                      </span>
                    </td>
                    <td className="px-2 md:px-3 py-3">
                      <span
                        className={`inline-flex items-center px-1.5 md:px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          EstadoReclamoColors[reclamo.estado]
                        }`}
                      >
                        {getStatusIcon(reclamo.estado)}
                        <span className="ml-1 hidden md:inline">
                          {EstadoReclamoLabels[reclamo.estado]}
                        </span>
                      </span>
                    </td>
                    <td className="px-2 md:px-3 py-3 text-xs md:text-sm text-[#9A8C61]">
                      <div className="hidden md:block">
                        {new Date(reclamo.creadoEn).toLocaleDateString(
                          'es-PE',
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          }
                        )}
                      </div>
                      <div className="md:hidden">
                        {new Date(reclamo.creadoEn).toLocaleDateString(
                          'es-PE',
                          {
                            month: 'short',
                            day: 'numeric',
                          }
                        )}
                      </div>
                    </td>
                    <td className="px-2 md:px-3 py-3 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(reclamo)}
                          className="hover:bg-[#F5E6C6]/30 p-1 md:p-2"
                        >
                          <Eye className="h-3 w-3 md:h-4 md:w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenManageModal(reclamo)}
                          className="hover:bg-[#F5E6C6]/30 p-1 md:p-2"
                        >
                          <Edit className="h-3 w-3 md:h-4 md:w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}{' '}
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-3 md:px-6 py-4 border-t border-[#ecd8ab]/30 bg-[#FAF3E7]/20">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs md:text-sm text-[#9A8C61]">
                Mostrando {(currentPage - 1) * itemsPerPage + 1} -{' '}
                {Math.min(currentPage * itemsPerPage, totalItems)} de{' '}
                {totalItems} reclamos
              </div>
              <div className="flex items-center space-x-1 md:space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="border-[#ecd8ab] text-[#9A8C61] hover:bg-[#F5E6C6]/30 text-xs md:text-sm px-2 md:px-3"
                >
                  Anterior
                </Button>

                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum =
                      Math.max(1, Math.min(totalPages - 4, currentPage - 2)) +
                      i;
                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? 'default' : 'outline'
                        }
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className={`text-xs md:text-sm px-2 md:px-3 ${
                          currentPage === pageNum
                            ? 'bg-[#CC9F53] text-white'
                            : 'border-[#ecd8ab] text-[#9A8C61] hover:bg-[#F5E6C6]/30'
                        }`}
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
                  className="border-[#ecd8ab] text-[#9A8C61] hover:bg-[#F5E6C6]/30 text-xs md:text-sm px-2 md:px-3"
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Modals */}
      <EnhancedReclamoDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseModals}
        reclamo={selectedReclamo}
        onAddComment={handleAddComment}
        onReloadReclamo={handleReloadReclamo}
      />
      <ReclamoManageModal
        isOpen={isManageModalOpen}
        onClose={handleCloseModals}
        reclamo={selectedReclamo}
        onUpdate={handleUpdateReclamo}
      />
    </div>
  );
};

export default ReclamosAdminPage;
