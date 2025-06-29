'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { 
  Mail, 
  Search,
  Download,
  Send,
  UserCheck,
  UserX,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Trash2,
  Users,
  Power
} from 'lucide-react';
import { newsletterService, Newsletter } from '@/services/newsletter.service';

const NewsletterAdminPage: React.FC = () => {
  const [suscriptores, setSuscriptores] = useState<Newsletter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    activos: 0,
    inactivos: 0,
    nuevosEsteMes: 0
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

  // Cargar suscriptores
  const loadSuscriptores = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await newsletterService.obtenerTodos();
      setSuscriptores(response.data);
    } catch (error) {
      console.error('Error al cargar suscriptores:', error);
      showNotification('error', 'Error al cargar suscriptores');
      setSuscriptores([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar estadísticas
  const loadEstadisticas = useCallback(async () => {
    try {
      const response = await newsletterService.obtenerEstadisticas();
      setEstadisticas(response.data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      // Calcular estadísticas localmente como fallback
      const ahora = new Date();
      const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
      
      setEstadisticas({
        total: suscriptores.length,
        activos: suscriptores.filter(s => s.activo).length,
        inactivos: suscriptores.filter(s => !s.activo).length,
        nuevosEsteMes: suscriptores.filter(s => new Date(s.creadoEn) >= inicioMes).length
      });
    }
  }, [suscriptores]);

  useEffect(() => {
    loadSuscriptores();
  }, [loadSuscriptores]);

  useEffect(() => {
    if (suscriptores.length > 0) {
      loadEstadisticas();
    }
  }, [suscriptores, loadEstadisticas]);

  // Filtrar suscriptores
  const filteredSuscriptores = suscriptores.filter(suscriptor => {
    const matchesSearch = suscriptor.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'TODOS' || 
                         (statusFilter === 'ACTIVO' && suscriptor.activo) ||
                         (statusFilter === 'INACTIVO' && !suscriptor.activo);
    
    return matchesSearch && matchesStatus;
  });

  // Cambiar estado de suscriptor
  const handleToggleEstado = async (id: number, activo: boolean) => {
    try {
      await newsletterService.cambiarEstado(id, !activo);
      await loadSuscriptores();
      showNotification('success', `Suscriptor ${!activo ? 'activado' : 'desactivado'} correctamente`);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      showNotification('error', 'Error al cambiar estado del suscriptor');
    }
  };

  // Eliminar suscriptor
  const handleDeleteSuscriptor = async (id: number) => {
    const confirmed = window.confirm('¿Estás seguro de que quieres eliminar este suscriptor?');
    if (!confirmed) return;    try {
      await newsletterService.eliminar(id);
      await loadSuscriptores();
      showNotification('success', 'Suscriptor eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar suscriptor:', error);
      showNotification('error', 'Error al eliminar suscriptor');
    }
  };

  // Exportar suscriptores
  const handleExportSuscriptores = () => {
    const csvContent = [
      ['Email', 'Estado', 'Fecha de Suscripción'],
      ...filteredSuscriptores.map(s => [
        s.email,
        s.activo ? 'Activo' : 'Inactivo',
        new Date(s.creadoEn).toLocaleDateString('es-PE')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `suscriptores-newsletter-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showNotification('success', 'Archivo CSV descargado correctamente');
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
          <h1 className="text-3xl font-bold text-[#3A3A3A]">Gestión de Newsletter</h1>
          <p className="text-[#9A8C61] mt-1">
            Administra los suscriptores y campañas del newsletter de Dela
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleExportSuscriptores}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </Button>
          <Button
            onClick={() => {
              // TODO: Implementar envío de campaña
              showNotification('success', 'Envío de campañas próximamente disponible');
            }}
            className="bg-gradient-to-r from-[#CC9F53] to-[#b08a3c] hover:from-[#b08a3c] hover:to-[#9a7635] text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg"
          >
            <Send className="w-4 h-4" />
            Nueva Campaña
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#9A8C61]">Total Suscriptores</p>
              <p className="text-2xl font-bold text-[#3A3A3A]">{estadisticas.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#9A8C61]">Activos</p>
              <p className="text-2xl font-bold text-[#3A3A3A]">{estadisticas.activos}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <UserX className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#9A8C61]">Inactivos</p>
              <p className="text-2xl font-bold text-[#3A3A3A]">{estadisticas.inactivos}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#9A8C61]">Nuevos este mes</p>
              <p className="text-2xl font-bold text-[#3A3A3A]">{estadisticas.nuevosEsteMes}</p>
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
              placeholder="Buscar por email..."
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
            <option value="TODOS">Todos</option>
            <option value="ACTIVO">Activos</option>
            <option value="INACTIVO">Inactivos</option>
          </select>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#ecd8ab]/30 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CC9F53] mx-auto mb-4"></div>
            <p className="text-[#9A8C61]">Cargando suscriptores...</p>
          </div>
        ) : filteredSuscriptores.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#CC9F53] to-[#b08a3c] rounded-xl flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-[#3A3A3A] mb-2">
              {suscriptores.length === 0 ? 'No hay suscriptores' : 'Sin resultados'}
            </h3>
            <p className="text-[#9A8C61] mb-6">
              {suscriptores.length === 0 
                ? 'Aún no hay suscriptores al newsletter.'
                : 'No se encontraron suscriptores que coincidan con tu búsqueda.'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#F5E6C6]/50 to-[#FAF3E7]/30 border-b border-[#ecd8ab]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">
                    Fecha de Suscripción
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-[#3A3A3A]">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ecd8ab]/30">
                {filteredSuscriptores.map((suscriptor) => (
                  <tr key={suscriptor.id} className="hover:bg-[#F5E6C6]/20 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-[#F5E6C6]/30 rounded-lg flex items-center justify-center mr-3">
                          <Mail className="w-5 h-5 text-[#CC9F53]" />
                        </div>
                        <div>
                          <p className="font-medium text-[#3A3A3A]">{suscriptor.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        suscriptor.activo
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {suscriptor.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#9A8C61]">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(suscriptor.creadoEn).toLocaleDateString('es-PE')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleEstado(suscriptor.id, suscriptor.activo)}
                          className={`${
                            suscriptor.activo 
                              ? 'text-orange-600 hover:bg-orange-50' 
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                        >
                          <Power className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSuscriptor(suscriptor.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
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

export default NewsletterAdminPage;
