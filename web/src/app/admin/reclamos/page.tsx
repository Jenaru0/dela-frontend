'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { 
  MessageSquare, 
  Search, 
  Eye, 
  MessageCircle, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  User,
  AlertCircle as AlertIcon
} from 'lucide-react';
import { reclamosService, Reclamo } from '@/services/reclamos.service';
import { EstadoReclamoLabels, EstadoReclamoColors, PrioridadReclamoLabels, PrioridadReclamoColors, TipoReclamoLabels } from '@/types/enums';

const ReclamosAdminPage: React.FC = () => {
  const [reclamos, setReclamos] = useState<Reclamo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Función para mostrar notificaciones
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Cargar reclamos (ADMIN)
  const loadClaims = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await reclamosService.obtenerTodos();
      setReclamos(response.data);
    } catch (error) {
      console.error('Error al cargar reclamos:', error);
      showNotification('error', 'Error al cargar reclamos');
      setReclamos([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClaims();
  }, [loadClaims]);

  // Filtrar reclamos
  const filteredClaims = reclamos.filter(reclamo => {
    const matchesSearch = reclamo.asunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reclamo.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reclamo.usuario?.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reclamo.usuario?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'TODOS' || reclamo.estado === statusFilter;
    
    return matchesSearch && matchesStatus;
  });


  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'ABIERTO':
        return <Clock className="w-4 h-4" />;
      case 'EN_PROCESO':
        return <MessageCircle className="w-4 h-4" />;
      case 'RESUELTO':
        return <CheckCircle className="w-4 h-4" />;
      case 'RECHAZADO':
        return <XCircle className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getPriorityIcon = (prioridad: string) => {
    switch (prioridad) {
      case 'CRITICA':
        return <AlertTriangle className="w-4 h-4" />;
      case 'ALTA':
        return <AlertIcon className="w-4 h-4" />;
      default:
        return null;
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
              <AlertIcon className="h-5 w-5 mr-2" />
            )}
            {notification.message}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#3A3A3A]">Gestión de Reclamos</h1>
          <p className="text-[#9A8C61] mt-1">
            Administra y resuelve reclamos de clientes
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#9A8C61]">Total Reclamos</p>
              <p className="text-2xl font-bold text-[#3A3A3A]">{reclamos.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#9A8C61]">Pendientes</p>
              <p className="text-2xl font-bold text-[#3A3A3A]">
                {reclamos.filter(r => r.estado === 'ABIERTO' || r.estado === 'EN_PROCESO').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#9A8C61]">Resueltos</p>
              <p className="text-2xl font-bold text-[#3A3A3A]">
                {reclamos.filter(r => r.estado === 'RESUELTO').length}
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
              <p className="text-sm font-medium text-[#9A8C61]">Críticos</p>
              <p className="text-2xl font-bold text-[#3A3A3A]">
                {reclamos.filter(r => r.prioridad === 'CRITICA').length}
              </p>
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
              placeholder="Buscar por asunto, descripción o cliente..."
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
            <option value="ABIERTO">Abierto</option>
            <option value="EN_PROCESO">En Proceso</option>
            <option value="RESUELTO">Resuelto</option>
            <option value="RECHAZADO">Rechazado</option>
          </select>
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#ecd8ab]/30 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CC9F53] mx-auto mb-4"></div>
            <p className="text-[#9A8C61]">Cargando reclamos...</p>
          </div>
        ) : filteredClaims.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#CC9F53] to-[#b08a3c] rounded-xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-[#3A3A3A] mb-2">
              {reclamos.length === 0 ? 'No hay reclamos' : 'Sin resultados'}
            </h3>
            <p className="text-[#9A8C61] mb-6">
              {reclamos.length === 0 
                ? 'Aún no hay reclamos en el sistema.'
                : 'No se encontraron reclamos que coincidan con tu búsqueda.'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#F5E6C6]/50 to-[#FAF3E7]/30 border-b border-[#ecd8ab]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">
                    Reclamo
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">
                    Cliente
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">
                    Tipo
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">
                    Prioridad
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
                {filteredClaims.map((reclamo) => (
                  <tr key={reclamo.id} className="hover:bg-[#F5E6C6]/20 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <div className="w-10 h-10 bg-[#F5E6C6]/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                          <MessageSquare className="w-5 h-5 text-[#CC9F53]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-[#3A3A3A] truncate">{reclamo.asunto}</p>
                          <p className="text-sm text-[#9A8C61] truncate max-w-xs">
                            {reclamo.descripcion}
                          </p>
                          {reclamo.pedidoId && (
                            <p className="text-xs text-[#CC9F53] mt-1">
                              Pedido #{reclamo.pedido?.numero || reclamo.pedidoId}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-[#CC9F53] mr-2" />
                        <div>
                          <p className="font-medium text-[#3A3A3A]">
                            {reclamo.usuario?.nombres} {reclamo.usuario?.apellidos}
                          </p>
                          <p className="text-sm text-[#9A8C61]">{reclamo.usuario?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#3A3A3A]">
                        {TipoReclamoLabels[reclamo.tipoReclamo as keyof typeof TipoReclamoLabels]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${PrioridadReclamoColors[reclamo.prioridad as keyof typeof PrioridadReclamoColors]}`}>
                        {getPriorityIcon(reclamo.prioridad)}
                        <span className={getPriorityIcon(reclamo.prioridad) ? "ml-1" : ""}>
                          {PrioridadReclamoLabels[reclamo.prioridad as keyof typeof PrioridadReclamoLabels]}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${EstadoReclamoColors[reclamo.estado as keyof typeof EstadoReclamoColors]}`}>
                        {getStatusIcon(reclamo.estado)}
                        <span className="ml-1">{EstadoReclamoLabels[reclamo.estado as keyof typeof EstadoReclamoLabels]}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#9A8C61]">
                      {new Date(reclamo.creadoEn).toLocaleDateString('es-PE', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // TODO: Implementar responder/gestionar
                            showNotification('success', 'Responder reclamo próximamente disponible');
                          }}
                          className="hover:bg-[#F5E6C6]/30"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
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

export default ReclamosAdminPage;
