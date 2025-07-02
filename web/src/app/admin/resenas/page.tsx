'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { 
  Star, 
  Search,
  Eye,
  Check,
  X,
  AlertTriangle,
  User,
  AlertCircle,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import { resenasService, Resena } from '@/services/resenas.service';
import { EstadoResena } from '@/types/enums';
import { ReviewDetailModal } from '@/components/admin/modals/resena/ReviewDetailModal';

const ResenasAdminPage: React.FC = () => {
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    pendientes: 0,
    aprobadas: 0,
    rechazadas: 0,
    promedioCalificacion: 0
  });
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [selectedResena, setSelectedResena] = useState<Resena | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Función para mostrar notificaciones
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Cargar reseñas
  const loadResenas = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await resenasService.obtenerTodas();
      setResenas(response?.data || []);
    } catch (error) {
      console.error('Error al cargar reseñas:', error);
      showNotification('error', 'Error al cargar reseñas');
      setResenas([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar estadísticas
  const loadEstadisticas = useCallback(async () => {
    try {
      const response = await resenasService.obtenerEstadisticas();
      setEstadisticas(response?.data || {
        total: 0,
        pendientes: 0,
        aprobadas: 0,
        rechazadas: 0,
        promedioCalificacion: 0
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      const resenasArray = resenas || [];
      setEstadisticas({
        total: resenasArray.length,
        pendientes: resenasArray.filter(r => r.estado === EstadoResena.PENDIENTE).length,
        aprobadas: resenasArray.filter(r => r.estado === EstadoResena.APROBADO).length,
        rechazadas: resenasArray.filter(r => r.estado === EstadoResena.RECHAZADO).length,
        promedioCalificacion: resenasArray.length > 0 ? resenasArray.reduce((acc, r) => acc + r.calificacion, 0) / resenasArray.length : 0
      });
    }
  }, [resenas]);

  useEffect(() => {
    loadResenas();
  }, [loadResenas]);

  useEffect(() => {
    if (resenas && resenas.length > 0) {
      loadEstadisticas();
    }
  }, [resenas, loadEstadisticas]);

  // Filtrar reseñas
  const filteredResenas = (resenas || []).filter(resena => {
    const matchesSearch = resena.comentario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resena.usuario?.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resena.producto?.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'TODOS' || resena.estado === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Cambiar estado de reseña
  const handleChangeStatus = async (id: number, newStatus: EstadoResena) => {
    try {
      await resenasService.cambiarEstado(id, newStatus);
      await loadResenas();
      showNotification('success', `Reseña ${newStatus.toLowerCase()} correctamente`);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      showNotification('error', 'Error al cambiar estado de la reseña');
    }
  };

  // Abrir modal de detalle
  const handleViewDetails = (resena: Resena) => {
    setSelectedResena(resena);
    setIsModalOpen(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedResena(null);
  };


  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
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
          <h1 className="text-3xl font-bold text-[#2D2D2D]">Gestión de Reseñas</h1>
          <p className="text-[#8B7355] mt-1">
            Modera y gestiona todas las reseñas de productos de los clientes
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#8B7355]">Total Reseñas</p>
              <p className="text-2xl font-bold text-[#2D2D2D]">{estadisticas.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#8B7355]">Pendientes</p>
              <p className="text-2xl font-bold text-[#2D2D2D]">{estadisticas.pendientes}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#8B7355]">Aprobadas</p>
              <p className="text-2xl font-bold text-[#2D2D2D]">{estadisticas.aprobadas}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <X className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#8B7355]">Rechazadas</p>
              <p className="text-2xl font-bold text-[#2D2D2D]">{estadisticas.rechazadas}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#8B7355]">Promedio</p>
              <p className="text-2xl font-bold text-[#2D2D2D]">{estadisticas.promedioCalificacion.toFixed(1)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B7355] h-5 w-5" />
            <Input
              type="text"
              placeholder="Buscar por comentario, cliente o producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-[#ecd8ab]/50 focus:border-[#CC9F53] focus:ring-[#CC9F53]/20"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-[#ecd8ab]/50 rounded-lg focus:border-[#CC9F53] focus:ring-[#CC9F53]/20"
          >
            <option value="TODOS">Todos los estados</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="APROBADO">Aprobada</option>
            <option value="RECHAZADO">Rechazada</option>
          </select>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-3 border-[#CC9F53] mx-auto mb-6"></div>
            <p className="text-gray-600 text-lg">Cargando reseñas...</p>
          </div>
        ) : filteredResenas.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#CC9F53] to-[#b08a3c] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Star className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {!resenas || resenas.length === 0 ? 'No hay reseñas disponibles' : 'Sin resultados'}
            </h3>
            <p className="text-gray-600 text-lg max-w-md mx-auto">
              {!resenas || resenas.length === 0 
                ? 'Aún no hay reseñas de productos para moderar en el sistema.'
                : 'No se encontraron reseñas que coincidan con los criterios de búsqueda.'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">
                    cliente
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">
                    producto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">
                    puntuación
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">
                    estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">
                    fecha
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wide">
                    acción
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {filteredResenas.map((resena) => (
                  <tr key={resena.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                    <td className="px-6 py-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-500" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {resena.usuario?.nombres} {resena.usuario?.apellidos}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm text-gray-900 font-medium max-w-xs truncate">
                        {resena.producto?.nombre}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-1">
                        {renderStars(resena.calificacion)}
                        <span className="ml-2 text-sm text-gray-600 font-medium">
                          {resena.calificacion}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                        resena.estado === 'PENDIENTE' 
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : resena.estado === 'APROBADO'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {resena.estado === 'PENDIENTE' && 'Pendiente'}
                        {resena.estado === 'APROBADO' && 'Aprobada'}
                        {resena.estado === 'RECHAZADO' && 'Rechazada'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm text-gray-600">
                        {new Date(resena.creadoEn).toLocaleDateString('es-PE', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button
                        onClick={() => handleViewDetails(resena)}
                        className="inline-flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-150"
                        title="Ver detalle"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de detalle */}
      <ReviewDetailModal
        resena={selectedResena}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onChangeStatus={handleChangeStatus}
      />
    </div>
  );
};

export default ResenasAdminPage;
