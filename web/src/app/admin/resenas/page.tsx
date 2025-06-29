'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { 
  Star, 
  Search,
  Eye,
  Check,
  X,
  AlertTriangle,
  User,
  ShoppingBag,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import { resenasService, Resena } from '@/services/resenas.service';
import { EstadoResena } from '@/types/enums';

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
      setResenas(response.data);
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
      setEstadisticas(response.data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      setEstadisticas({
        total: resenas.length,
        pendientes: resenas.filter(r => r.estado === EstadoResena.PENDIENTE).length,
        aprobadas: resenas.filter(r => r.estado === EstadoResena.APROBADO).length,
        rechazadas: resenas.filter(r => r.estado === EstadoResena.RECHAZADO).length,
        promedioCalificacion: resenas.length > 0 ? resenas.reduce((acc, r) => acc + r.calificacion, 0) / resenas.length : 0
      });
    }
  }, [resenas]);

  useEffect(() => {
    loadResenas();
  }, [loadResenas]);

  useEffect(() => {
    if (resenas.length > 0) {
      loadEstadisticas();
    }
  }, [resenas, loadEstadisticas]);

  // Filtrar reseñas
  const filteredResenas = resenas.filter(resena => {
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
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      showNotification('error', 'Error al cambiar estado de la reseña');
    }
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

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'APROBADO':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'RECHAZADO':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
          <h1 className="text-3xl font-bold text-[#3A3A3A]">Gestión de Reseñas</h1>
          <p className="text-[#9A8C61] mt-1">
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
              <p className="text-sm font-medium text-[#9A8C61]">Total Reseñas</p>
              <p className="text-2xl font-bold text-[#3A3A3A]">{estadisticas.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#9A8C61]">Pendientes</p>
              <p className="text-2xl font-bold text-[#3A3A3A]">{estadisticas.pendientes}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#9A8C61]">Aprobadas</p>
              <p className="text-2xl font-bold text-[#3A3A3A]">{estadisticas.aprobadas}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <X className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#9A8C61]">Rechazadas</p>
              <p className="text-2xl font-bold text-[#3A3A3A]">{estadisticas.rechazadas}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#9A8C61]">Promedio</p>
              <p className="text-2xl font-bold text-[#3A3A3A]">{estadisticas.promedioCalificacion.toFixed(1)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9A8C61] h-5 w-5" />
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
      <div className="bg-white rounded-xl shadow-sm border border-[#ecd8ab]/30 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CC9F53] mx-auto mb-4"></div>
            <p className="text-[#9A8C61]">Cargando reseñas...</p>
          </div>
        ) : filteredResenas.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#CC9F53] to-[#b08a3c] rounded-xl flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-[#3A3A3A] mb-2">
              {resenas.length === 0 ? 'No hay reseñas' : 'Sin resultados'}
            </h3>
            <p className="text-[#9A8C61] mb-6">
              {resenas.length === 0 
                ? 'Aún no hay reseñas de productos para moderar.'
                : 'No se encontraron reseñas que coincidan con tu búsqueda.'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#F5E6C6]/50 to-[#FAF3E7]/30 border-b border-[#ecd8ab]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">
                    Reseña
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">
                    Cliente
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">
                    Producto
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">
                    Puntuación
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-[#3A3A3A]">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ecd8ab]/30">
                {filteredResenas.map((resena) => (
                  <tr key={resena.id} className="hover:bg-[#F5E6C6]/20 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <div className="w-10 h-10 bg-[#F5E6C6]/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                          <MessageSquare className="w-5 h-5 text-[#CC9F53]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center mb-1">
                            {renderStars(resena.calificacion)}
                          </div>
                          <p className="text-sm text-[#3A3A3A] line-clamp-2">
                            {resena.comentario || 'Sin comentario'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-[#CC9F53] mr-2" />
                        <div>
                          <p className="font-medium text-[#3A3A3A]">
                            {resena.usuario?.nombres} {resena.usuario?.apellidos}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <ShoppingBag className="w-4 h-4 text-[#CC9F53] mr-2" />
                        <div>
                          <p className="font-medium text-[#3A3A3A]">
                            {resena.producto?.nombre}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {renderStars(resena.calificacion)}
                        <span className="ml-2 text-sm font-medium text-[#3A3A3A]">
                          {resena.calificacion}/5
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(resena.estado)}`}>
                        {resena.estado === 'PENDIENTE' && 'Pendiente'}
                        {resena.estado === 'APROBADO' && 'Aprobada'}
                        {resena.estado === 'RECHAZADO' && 'Rechazada'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#9A8C61]">
                      {new Date(resena.creadoEn).toLocaleDateString('es-PE')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // TODO: Implementar ver detalles
                            showNotification('success', 'Ver detalles próximamente disponible');
                          }}
                          className="hover:bg-[#F5E6C6]/30"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {resena.estado === EstadoResena.PENDIENTE && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleChangeStatus(resena.id, EstadoResena.APROBADO)}
                              className="text-green-600 hover:bg-green-50"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleChangeStatus(resena.id, EstadoResena.RECHAZADO)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {resena.estado !== EstadoResena.PENDIENTE && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleChangeStatus(resena.id, EstadoResena.PENDIENTE)}
                            className="text-orange-600 hover:bg-orange-50"
                          >
                            <AlertTriangle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResenasAdminPage;
