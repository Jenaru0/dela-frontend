'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { 
  Package, 
  Search, 
  Eye, 
  Edit, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Truck,
  XCircle,
  User,
  X
} from 'lucide-react';
import { pedidosService, Pedido } from '@/services/pedidos.service';
import { EstadoPedido, EstadoPedidoLabels, EstadoPedidoColors, MetodoPago, MetodoPagoLabels, MetodoEnvio, MetodoEnvioLabels } from '@/types/enums';
import EnhancedPedidoDetailModal from '@/components/admin/modals/orders/EnhancedPedidoDetailModal';
import PedidoChangeStatusModal from '@/components/admin/modals/orders/PedidoChangeStatusModal';

interface FilterState {
  search: string;
  estado: string;
  metodoPago: string;
  metodoEnvio: string;
  fechaInicio: string;
  fechaFin: string;
}

const PedidosAdminPage: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [allPedidos, setAllPedidos] = useState<Pedido[]>([]);
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
    metodoPago: '',
    metodoEnvio: '',
    fechaInicio: '',
    fechaFin: '',
  });
  const [allFilteredPedidos, setAllFilteredPedidos] = useState<Pedido[]>([]);
  const [isUsingFrontendPagination, setIsUsingFrontendPagination] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Estados para los modales
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  // Función para mostrar notificaciones
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };
  // Funciones para manejar los modales
  const handleViewDetails = (pedido: Pedido) => {
    setSelectedPedido(pedido);
    setIsDetailModalOpen(true);
  };

  const handleOpenStatusModal = (pedido: Pedido) => {
    setSelectedPedido(pedido);
    setIsStatusModalOpen(true);
  };

  const handleCloseModals = () => {
    setSelectedPedido(null);
    setIsDetailModalOpen(false);
    setIsStatusModalOpen(false);
  };

  const handleStatusChanged = async () => {
    // Recargar los datos después de cambiar el estado
    await loadOrders(currentPage, filters.search, filters.estado, filters.fechaInicio, filters.fechaFin);
    await loadAllOrders();
    showNotification('success', 'Estado del pedido actualizado correctamente');
  };

  // Cargar pedidos con paginación
  const loadOrders = useCallback(async (page = 1, search = '', estado = '', fechaInicio = '', fechaFin = '') => {
    try {
      setIsLoading(true);
      
      if (isUsingFrontendPagination) {
        // Usar datos ya filtrados en frontend
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setPedidos(allFilteredPedidos.slice(startIndex, endIndex));
        setTotalPages(Math.ceil(allFilteredPedidos.length / itemsPerPage));
        setTotalItems(allFilteredPedidos.length);
      } else {
        // Usar paginación del backend
        const response = await pedidosService.obtenerConPaginacion(
          page, 
          itemsPerPage, 
          search, 
          estado as EstadoPedido, 
          fechaInicio, 
          fechaFin
        );
        setPedidos(response.data);
        setTotalPages(response.totalPages);
        setTotalItems(response.total);
        setCurrentPage(response.page);
      }
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      showNotification('error', 'Error al cargar pedidos');
      setPedidos([]);
    } finally {
      setIsLoading(false);
    }
  }, [isUsingFrontendPagination, allFilteredPedidos, itemsPerPage]);  // Cargar todos los pedidos para estadísticas y filtros especiales
  const loadAllOrders = useCallback(async () => {
    try {
      console.log('🔍 Cargando todos los pedidos para estadísticas...');
      const response = await pedidosService.obtenerTodosAdmin();
      console.log('📊 Respuesta del backend:', response);
      console.log('📋 Datos recibidos:', response.data);
      const pedidosData = Array.isArray(response.data) ? response.data : [];
      console.log('✅ Pedidos procesados:', pedidosData.length);
      setAllPedidos(pedidosData);
    } catch (error) {
      console.error('❌ Error al cargar todos los pedidos:', error);
      setAllPedidos([]); // Asegurar que siempre sea un array
    }
  }, []);  // Manejar cambio de filtros
  const handleFilterChange = useCallback(async (newFilters: FilterState) => {
    console.log('🔍 Aplicando filtros:', newFilters);
    setFilters(newFilters);
    setCurrentPage(1);

    // Si hay filtros especiales (método pago, fechas), usar paginación frontend
    const hasSpecialFilters = newFilters.metodoPago !== '' || newFilters.metodoEnvio !== '' || newFilters.fechaInicio !== '' || newFilters.fechaFin !== '';
    
    if (hasSpecialFilters) {
      console.log('📋 Usando filtros especiales en frontend');
      
      // Si allPedidos está vacío, cargar todos los pedidos primero
      let allPedidosData = allPedidos;
      if (!Array.isArray(allPedidos) || allPedidos.length === 0) {
        console.log('🔄 Cargando todos los pedidos para filtrar...');
        try {
          const response = await pedidosService.obtenerTodosAdmin();
          allPedidosData = Array.isArray(response.data) ? response.data : [];
          setAllPedidos(allPedidosData);
          console.log('✅ Pedidos cargados para filtrar:', allPedidosData.length);
        } catch (error) {
          console.error('❌ Error al cargar pedidos para filtrar:', error);
          allPedidosData = [];
        }
      }
      
      console.log('📋 Datos disponibles para filtrar:', allPedidosData.length);
      let filtered = [...allPedidosData];
      
      // Filtro de estado
      if (newFilters.estado) {
        filtered = filtered.filter(pedido => pedido.estado === newFilters.estado);
        console.log('🎯 Después de filtro estado:', filtered.length);
      }
      
      // Filtro de método de pago
      if (newFilters.metodoPago) {
        console.log('💳 Filtrando por método de pago:', newFilters.metodoPago);
        console.log('💳 Métodos de pago disponibles:', allPedidosData.map(p => p.metodoPago).filter((v, i, a) => a.indexOf(v) === i));
        filtered = filtered.filter(pedido => {
          console.log(`💳 Comparando: ${pedido.metodoPago} === ${newFilters.metodoPago}`);
          return pedido.metodoPago === newFilters.metodoPago;
        });
        console.log('💳 Después de filtro método pago:', filtered.length);
      }

      // Filtro de método de envío
      if (newFilters.metodoEnvio) {
        console.log('🚚 Filtrando por método de envío:', newFilters.metodoEnvio);
        console.log('🚚 Métodos de envío disponibles:', allPedidosData.map(p => p.metodoEnvio).filter((v, i, a) => a.indexOf(v) === i));
        filtered = filtered.filter(pedido => {
          console.log(`🚚 Comparando: ${pedido.metodoEnvio} === ${newFilters.metodoEnvio}`);
          return pedido.metodoEnvio === newFilters.metodoEnvio;
        });
        console.log('🚚 Después de filtro método envío:', filtered.length);
      }
        // Filtro de fechas
      if (newFilters.fechaInicio) {
        const fechaInicio = new Date(newFilters.fechaInicio);
        fechaInicio.setHours(0, 0, 0, 0); // Inicio del día
        filtered = filtered.filter(pedido => {
          const fechaPedido = new Date(pedido.creadoEn);
          fechaPedido.setHours(0, 0, 0, 0); // Normalizar para comparar solo fecha
          return fechaPedido >= fechaInicio;
        });
        console.log('📅 Después de filtro fecha inicio:', filtered.length);
      }
      
      if (newFilters.fechaFin) {
        const fechaFin = new Date(newFilters.fechaFin);
        fechaFin.setHours(23, 59, 59, 999); // Final del día
        filtered = filtered.filter(pedido => {
          const fechaPedido = new Date(pedido.creadoEn);
          return fechaPedido <= fechaFin;
        });
        console.log('📅 Después de filtro fecha fin:', filtered.length);
      }
      
      // Filtro de búsqueda local
      if (newFilters.search) {
        filtered = filtered.filter(pedido =>
          pedido.numero.toLowerCase().includes(newFilters.search.toLowerCase()) ||
          (pedido.usuario?.nombres && pedido.usuario.nombres.toLowerCase().includes(newFilters.search.toLowerCase())) ||
          (pedido.usuario?.apellidos && pedido.usuario.apellidos.toLowerCase().includes(newFilters.search.toLowerCase())) ||
          (pedido.usuario?.email && pedido.usuario.email.toLowerCase().includes(newFilters.search.toLowerCase()))
        );
        console.log('🔍 Después de filtro búsqueda:', filtered.length);
      }
      
      console.log('✅ Resultados finales filtrados:', filtered.length);
      setAllFilteredPedidos(filtered);
      setIsUsingFrontendPagination(true);
      
      // Mostrar primera página de resultados filtrados
      const startIndex = 0;
      const endIndex = itemsPerPage;
      setPedidos(filtered.slice(startIndex, endIndex));
      setTotalPages(Math.ceil(filtered.length / itemsPerPage));
      setTotalItems(filtered.length);
      setCurrentPage(1);
      setIsLoading(false);
    } else {
      // Solo búsqueda simple y estado, usar backend
      console.log('🔄 Usando filtros simples en backend');
      setIsUsingFrontendPagination(false);
      await loadOrders(1, newFilters.search, newFilters.estado, newFilters.fechaInicio, newFilters.fechaFin);
    }
  }, [allPedidos, itemsPerPage, loadOrders]);

  // Limpiar filtros
  const clearFilters = useCallback(() => {
    const clearedFilters = {
      search: '',
      estado: '',
      metodoPago: '',
      metodoEnvio: '',
      fechaInicio: '',
      fechaFin: '',
    };
    setFilters(clearedFilters);
    setIsUsingFrontendPagination(false);
    loadOrders(1, '', '', '', '');
  }, [loadOrders]);

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
      setPedidos(allFilteredPedidos.slice(startIndex, endIndex));
    } else {
      loadOrders(page, filters.search, filters.estado, filters.fechaInicio, filters.fechaFin);
    }
  }, [isUsingFrontendPagination, allFilteredPedidos, itemsPerPage, loadOrders, filters]);

  // Función para filtrar por estado desde las tarjetas
  const handleFilterByEstado = useCallback((estado: string) => {
    const newFilters = {
      ...filters,
      estado: filters.estado === estado ? '' : estado, // Toggle: si ya está seleccionado, quitar filtro
      search: '', // Limpiar búsqueda al usar filtro rápido
    };
    setFilters(newFilters);
    handleFilterChange(newFilters);
  }, [filters, handleFilterChange]);

  // Cambiar estado del pedido
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleChangeStatus = async (id: number, newEstado: EstadoPedido) => {
    try {
      await pedidosService.cambiarEstado(id, newEstado);
      await loadOrders(currentPage, filters.search, filters.estado, filters.fechaInicio, filters.fechaFin);
      await loadAllOrders();
      showNotification('success', 'Estado del pedido actualizado correctamente');
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      showNotification('error', 'Error al cambiar estado del pedido');
    }
  };
  useEffect(() => {
    loadOrders();
    loadAllOrders();
  }, [loadOrders, loadAllOrders]);

  // Filtrar pedidos por búsqueda (solo para mostrar en tiempo real)
  const filteredOrders = useMemo(() => {
    return pedidos; // Ya están filtrados por el backend o frontend
  }, [pedidos]);

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE':
        return <Clock className="w-4 h-4" />;
      case 'CONFIRMADO':
        return <CheckCircle className="w-4 h-4" />;
      case 'PROCESANDO':
        return <Package className="w-4 h-4" />;
      case 'ENVIADO':
        return <Truck className="w-4 h-4" />;
      case 'ENTREGADO':
        return <CheckCircle className="w-4 h-4" />;
      case 'CANCELADO':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
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
          <h1 className="text-3xl font-bold text-[#3A3A3A]">Gestión de Pedidos</h1>
          <p className="text-[#9A8C61] mt-1">
            Administra todos los pedidos del sistema y su estado de entrega
          </p>
        </div>
      </div>      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        <button
          onClick={() => handleFilterByEstado('')}
          className={`bg-white rounded-xl p-4 shadow-sm border transition-all duration-200 text-left transform hover:scale-105 ${
            filters.estado === '' 
              ? 'border-[#CC9F53] bg-[#F5E6C6]/20 shadow-md' 
              : 'border-[#ecd8ab]/30 hover:border-[#CC9F53]/50 hover:shadow-md'
          }`}
          title="Ver todos los pedidos"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>            
            <div className="ml-3">
              <p className="text-xs font-medium text-[#9A8C61]">Total</p>
              <p className="text-xl font-bold text-[#3A3A3A]">
                {Array.isArray(allPedidos) ? allPedidos.length : 0}
              </p>
            </div>
          </div>
        </button>
        <button
          onClick={() => handleFilterByEstado('PENDIENTE')}
          className={`bg-white rounded-xl p-4 shadow-sm border transition-all duration-200 text-left transform hover:scale-105 ${
            filters.estado === 'PENDIENTE' 
              ? 'border-[#CC9F53] bg-[#F5E6C6]/20 shadow-md' 
              : 'border-[#ecd8ab]/30 hover:border-[#CC9F53]/50 hover:shadow-md'
          }`}
          title="Filtrar pedidos pendientes"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-[#9A8C61]">Pendientes</p>
              <p className="text-xl font-bold text-[#3A3A3A]">
                {Array.isArray(allPedidos) ? allPedidos.filter(p => p.estado === 'PENDIENTE').length : 0}
              </p>
            </div>
          </div>
        </button>
        <button
          onClick={() => handleFilterByEstado('CONFIRMADO')}
          className={`bg-white rounded-xl p-4 shadow-sm border transition-all duration-200 text-left transform hover:scale-105 ${
            filters.estado === 'CONFIRMADO' 
              ? 'border-[#CC9F53] bg-[#F5E6C6]/20 shadow-md' 
              : 'border-[#ecd8ab]/30 hover:border-[#CC9F53]/50 hover:shadow-md'
          }`}
          title="Filtrar pedidos confirmados"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-[#9A8C61]">Confirmados</p>
              <p className="text-xl font-bold text-[#3A3A3A]">
                {Array.isArray(allPedidos) ? allPedidos.filter(p => p.estado === 'CONFIRMADO').length : 0}
              </p>
            </div>
          </div>
        </button>
        <button
          onClick={() => handleFilterByEstado('PROCESANDO')}
          className={`bg-white rounded-xl p-4 shadow-sm border transition-all duration-200 text-left transform hover:scale-105 ${
            filters.estado === 'PROCESANDO' 
              ? 'border-[#CC9F53] bg-[#F5E6C6]/20 shadow-md' 
              : 'border-[#ecd8ab]/30 hover:border-[#CC9F53]/50 hover:shadow-md'
          }`}
          title="Filtrar pedidos en procesamiento"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-[#9A8C61]">Procesando</p>
              <p className="text-xl font-bold text-[#3A3A3A]">
                {Array.isArray(allPedidos) ? allPedidos.filter(p => p.estado === 'PROCESANDO').length : 0}
              </p>
            </div>
          </div>
        </button>
        <button
          onClick={() => handleFilterByEstado('ENVIADO')}
          className={`bg-white rounded-xl p-4 shadow-sm border transition-all duration-200 text-left transform hover:scale-105 ${
            filters.estado === 'ENVIADO' 
              ? 'border-[#CC9F53] bg-[#F5E6C6]/20 shadow-md' 
              : 'border-[#ecd8ab]/30 hover:border-[#CC9F53]/50 hover:shadow-md'
          }`}
          title="Filtrar pedidos enviados"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-[#9A8C61]">Enviados</p>
              <p className="text-xl font-bold text-[#3A3A3A]">
                {Array.isArray(allPedidos) ? allPedidos.filter(p => p.estado === 'ENVIADO').length : 0}
              </p>
            </div>
          </div>
        </button>
        <button
          onClick={() => handleFilterByEstado('ENTREGADO')}
          className={`bg-white rounded-xl p-4 shadow-sm border transition-all duration-200 text-left transform hover:scale-105 ${
            filters.estado === 'ENTREGADO' 
              ? 'border-[#CC9F53] bg-[#F5E6C6]/20 shadow-md' 
              : 'border-[#ecd8ab]/30 hover:border-[#CC9F53]/50 hover:shadow-md'
          }`}
          title="Filtrar pedidos entregados"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-[#9A8C61]">Entregados</p>
              <p className="text-xl font-bold text-[#3A3A3A]">
                {Array.isArray(allPedidos) ? allPedidos.filter(p => p.estado === 'ENTREGADO').length : 0}
              </p>
            </div>
          </div>
        </button>
        <button
          onClick={() => handleFilterByEstado('CANCELADO')}
          className={`bg-white rounded-xl p-4 shadow-sm border transition-all duration-200 text-left transform hover:scale-105 ${
            filters.estado === 'CANCELADO' 
              ? 'border-[#CC9F53] bg-[#F5E6C6]/20 shadow-md' 
              : 'border-[#ecd8ab]/30 hover:border-[#CC9F53]/50 hover:shadow-md'
          }`}
          title="Filtrar pedidos cancelados"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-[#9A8C61]">Cancelados</p>
              <p className="text-xl font-bold text-[#3A3A3A]">
                {Array.isArray(allPedidos) ? allPedidos.filter(p => p.estado === 'CANCELADO').length : 0}
              </p>
            </div>
          </div>
        </button>
      </div>        {/* Filtros */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          {/* Búsqueda */}
          <div className="relative">
            <label className="block text-xs font-medium text-[#9A8C61] mb-1">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9A8C61] h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar pedidos..."
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
              <option value="PENDIENTE">Pendiente</option>
              <option value="CONFIRMADO">Confirmado</option>
              <option value="PROCESANDO">Procesando</option>
              <option value="ENVIADO">Enviado</option>
              <option value="ENTREGADO">Entregado</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>

          {/* Filtro Método de Pago */}
          <div>
            <label className="block text-xs font-medium text-[#9A8C61] mb-1">
              Método de Pago
            </label>
            <select
              value={filters.metodoPago}
              onChange={(e) => {
                const newFilters = { ...filters, metodoPago: e.target.value };
                setFilters(newFilters);
                handleFilterChange(newFilters);
              }}
              className="w-full px-3 py-2 border border-[#ecd8ab]/50 rounded-md focus:border-[#CC9F53] focus:ring-[#CC9F53]/20 bg-white text-sm"
            >
              <option value="">Todos los métodos</option>
              {Object.entries(MetodoPago).map(([key, value]) => (
                <option key={key} value={value}>
                  {MetodoPagoLabels[value]}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro Método de Envío */}
          <div>
            <label className="block text-xs font-medium text-[#9A8C61] mb-1">
              Método de Envío
            </label>
            <select
              value={filters.metodoEnvio}
              onChange={(e) => {
                const newFilters = { ...filters, metodoEnvio: e.target.value };
                setFilters(newFilters);
                handleFilterChange(newFilters);
              }}
              className="w-full px-3 py-2 border border-[#ecd8ab]/50 rounded-md focus:border-[#CC9F53] focus:ring-[#CC9F53]/20 bg-white text-sm"
            >
              <option value="">Todos los envíos</option>
              {Object.entries(MetodoEnvio).map(([key, value]) => (
                <option key={key} value={value}>
                  {MetodoEnvioLabels[value]}
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
              onChange={(e) => {
                const newFilters = { ...filters, fechaInicio: e.target.value };
                setFilters(newFilters);
                handleFilterChange(newFilters);
              }}
              className="border-[#ecd8ab]/50 focus:border-[#CC9F53] focus:ring-[#CC9F53]/20 text-sm"
            />
          </div>

          {/* Fecha Hasta */}
          <div>
            <label className="block text-xs font-medium text-[#9A8C61] mb-1">
              Hasta
            </label>
            <Input
              type="date"
              value={filters.fechaFin}
              min={filters.fechaInicio || undefined}
              onChange={(e) => {
                const newFilters = { ...filters, fechaFin: e.target.value };
                setFilters(newFilters);
                handleFilterChange(newFilters);
              }}
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
          </div>        </div>
        
        {/* Atajos rápidos de fechas */}
        <div className="mt-4 pt-4 border-t border-[#ecd8ab]/30">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-[#9A8C61] font-medium">Atajos rápidos:</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  const today = new Date().toISOString().split('T')[0];
                  const newFilters = { ...filters, fechaInicio: today, fechaFin: today };
                  setFilters(newFilters);
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
                  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                  const newFilters = { 
                    ...filters, 
                    fechaInicio: weekAgo.toISOString().split('T')[0], 
                    fechaFin: today.toISOString().split('T')[0] 
                  };
                  setFilters(newFilters);
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
                  const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
                  const newFilters = { 
                    ...filters, 
                    fechaInicio: monthAgo.toISOString().split('T')[0], 
                    fechaFin: today.toISOString().split('T')[0] 
                  };
                  setFilters(newFilters);
                  handleFilterChange(newFilters);
                }}
                className="text-sm px-3 py-1.5 bg-[#F5E6C6]/40 text-[#CC9F53] rounded-md hover:bg-[#F5E6C6]/60 transition-colors border border-[#CC9F53]/20"
              >
                Últimos 30 días
              </button>
            </div>
          </div>
        </div>
      </div>{/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#ecd8ab]/30 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CC9F53] mx-auto mb-4"></div>
            <p className="text-[#9A8C61]">Cargando pedidos...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#CC9F53] to-[#b08a3c] rounded-xl flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-[#3A3A3A] mb-2">
              {pedidos.length === 0 ? 'No hay pedidos' : 'Sin resultados'}
            </h3>
            <p className="text-[#9A8C61] mb-6">
              {pedidos.length === 0 
                ? 'Aún no hay pedidos en el sistema.'
                : 'No se encontraron pedidos que coincidan con tu búsqueda.'
              }
            </p>
          </div>
        ) : (          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#F5E6C6]/50 to-[#FAF3E7]/30 border-b border-[#ecd8ab]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">Pedido</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">Cliente</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">Total</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">Estado</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">Pago y Envío</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">Fecha</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-[#3A3A3A]">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ecd8ab]/30">
                {filteredOrders.map((pedido: Pedido) => (
                  <tr key={pedido.id} className="hover:bg-[#FAF3E7]/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#CC9F53] to-[#b08a3c] rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-white" />
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-[#3A3A3A]">#{pedido.numero}</p>
                          <p className="text-sm text-[#9A8C61]">
                            {pedido.detallePedidos?.length || 0} productos
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-[#CC9F53] mr-2" />
                        <div>
                          <p className="font-medium text-[#3A3A3A]">
                            {pedido.usuario?.nombres} {pedido.usuario?.apellidos}
                          </p>
                          <p className="text-sm text-[#9A8C61]">{pedido.usuario?.email}</p>
                        </div>
                      </div>                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="font-medium text-[#3A3A3A]">
                          S/ {parseFloat(pedido.total?.toString() || '0').toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${EstadoPedidoColors[pedido.estado as keyof typeof EstadoPedidoColors]}`}>
                        {getStatusIcon(pedido.estado)}
                        <span className="ml-1">{EstadoPedidoLabels[pedido.estado as keyof typeof EstadoPedidoLabels]}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-[#9A8C61]">💳</span>
                          <span className="text-sm text-[#3A3A3A]">
                            {MetodoPagoLabels[pedido.metodoPago as keyof typeof MetodoPagoLabels]}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-[#9A8C61]">🚚</span>
                          <span className="text-xs text-[#9A8C61]">
                            {MetodoEnvioLabels[pedido.metodoEnvio as keyof typeof MetodoEnvioLabels]}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#9A8C61]">
                      {new Date(pedido.creadoEn).toLocaleDateString('es-PE', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(pedido)}
                          className="hover:bg-[#F5E6C6]/30"
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenStatusModal(pedido)}
                          className="hover:bg-[#F5E6C6]/30"
                          title="Cambiar estado"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && filteredOrders.length > 0 && totalPages > 1 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-[#9A8C61]">
              Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} resultados
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="border-[#ecd8ab]/50 text-[#9A8C61] hover:bg-[#F5E6C6]/30"
              >
                Anterior
              </Button>
              
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNumber)}
                    className={
                      currentPage === pageNumber
                        ? "bg-[#CC9F53] text-white hover:bg-[#b08a3c]"
                        : "border-[#ecd8ab]/50 text-[#9A8C61] hover:bg-[#F5E6C6]/30"
                    }
                  >
                    {pageNumber}
                  </Button>
                );
              })}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="border-[#ecd8ab]/50 text-[#9A8C61] hover:bg-[#F5E6C6]/30"
              >
                Siguiente
              </Button>
            </div>
          </div>        </div>
      )}

      {/* Modales */}
      {selectedPedido && (
        <>
          <EnhancedPedidoDetailModal
            pedido={selectedPedido}
            isOpen={isDetailModalOpen}
            onClose={handleCloseModals}
          />
          <PedidoChangeStatusModal
            pedido={selectedPedido}
            isOpen={isStatusModalOpen}
            onClose={handleCloseModals}
            onStatusChanged={handleStatusChanged}
          />
        </>
      )}

      {/* Información de filtros rápidos */}
      <div className="flex items-center justify-center">
        <p className="text-sm text-[#9A8C61] bg-[#F5E6C6]/30 px-4 py-2 rounded-lg border border-[#ecd8ab]/50">
          💡 Haz clic en cualquier tarjeta de estadísticas para filtrar por ese estado
        </p>
      </div>
    </div>
  );
};

export default PedidosAdminPage;
