'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { 
  Search,
  MapPin,
  Building,
  User,
  Star,
  Calendar,
  Home,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { direccionesService } from '@/services/direcciones.service';
import { DireccionClienteConUsuario } from '@/types/direcciones';

const DireccionesAdminPage: React.FC = () => {
  const [direcciones, setDirecciones] = useState<DireccionClienteConUsuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    activas: 0,
    inactivas: 0,
    predeterminadas: 0,
    porDepartamento: {} as { [key: string]: number }
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

  // Cargar direcciones
  const loadDirecciones = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await direccionesService.obtenerTodasAdmin();
      setDirecciones(response.data);
    } catch (error) {
      console.error('Error al cargar direcciones:', error);
      showNotification('error', 'Error al cargar direcciones');
      setDirecciones([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar estadísticas
  const loadEstadisticas = useCallback(async () => {
    try {
      const response = await direccionesService.obtenerEstadisticas();
      setEstadisticas(response.data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      // Calcular estadísticas localmente como fallback
      const departamentos: { [key: string]: number } = {};
      direcciones.forEach(dir => {
        if (dir.provincia) {
          departamentos[dir.provincia] = (departamentos[dir.provincia] || 0) + 1;
        }
      });

      setEstadisticas({
        total: direcciones.length,
        activas: direcciones.filter(d => d.activa).length,
        inactivas: direcciones.filter(d => !d.activa).length,
        predeterminadas: direcciones.filter(d => d.predeterminada).length,
        porDepartamento: departamentos
      });
    }
  }, [direcciones]);

  useEffect(() => {
    loadDirecciones();
  }, [loadDirecciones]);

  useEffect(() => {
    if (direcciones.length > 0) {
      loadEstadisticas();
    }
  }, [direcciones, loadEstadisticas]);

  // Filtrar direcciones
  const filteredDirecciones = direcciones.filter(direccion => {
    const matchesSearch = direccion.direccion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         direccion.distrito?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         direccion.provincia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         direccion.alias?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         direccion.usuario?.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         direccion.usuario?.apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         direccion.usuario?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'TODOS' || 
                         (statusFilter === 'ACTIVA' && direccion.activa) ||
                         (statusFilter === 'INACTIVA' && !direccion.activa) ||
                         (statusFilter === 'PREDETERMINADA' && direccion.predeterminada);
    
    return matchesSearch && matchesStatus;
  });

  // Obtener provincias principales
  const topDepartamentos = Object.entries(estadisticas.porDepartamento)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

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
            Vista general de todas las direcciones de entrega de los clientes
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#9A8C61]">Total Direcciones</p>
              <p className="text-2xl font-bold text-[#3A3A3A]">{estadisticas.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Home className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#9A8C61]">Activas</p>
              <p className="text-2xl font-bold text-[#3A3A3A]">{estadisticas.activas}</p>
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
              <p className="text-2xl font-bold text-[#3A3A3A]">{estadisticas.predeterminadas}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#9A8C61]">Inactivas</p>
              <p className="text-2xl font-bold text-[#3A3A3A]">{estadisticas.inactivas}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Departamentos */}
      {topDepartamentos.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
          <h3 className="text-lg font-semibold text-[#3A3A3A] mb-4">Principales Departamentos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topDepartamentos.map(([departamento, cantidad]) => (
              <div key={departamento} className="bg-[#F5E6C6]/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#3A3A3A]">{departamento}</span>
                  <span className="text-sm text-[#9A8C61]">{cantidad} direcciones</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9A8C61] h-5 w-5" />
            <Input
              type="text"
              placeholder="Buscar por dirección, ubicación, alias, usuario o email..."
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
            <option value="TODOS">Todas</option>
            <option value="ACTIVA">Activas</option>
            <option value="INACTIVA">Inactivas</option>
            <option value="PREDETERMINADA">Predeterminadas</option>
          </select>
        </div>
      </div>

      {/* Addresses Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#ecd8ab]/30 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CC9F53] mx-auto mb-4"></div>
            <p className="text-[#9A8C61]">Cargando direcciones...</p>
          </div>
        ) : filteredDirecciones.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#CC9F53] to-[#b08a3c] rounded-xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-[#3A3A3A] mb-2">
              {direcciones.length === 0 ? 'No hay direcciones' : 'Sin resultados'}
            </h3>
            <p className="text-[#9A8C61] mb-6">
              {direcciones.length === 0 
                ? 'Aún no hay direcciones registradas en el sistema.'
                : 'No se encontraron direcciones que coincidan con tu búsqueda.'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#F5E6C6]/50 to-[#FAF3E7]/30 border-b border-[#ecd8ab]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">Dirección</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">Cliente</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">Ubicación</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">Estado</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">Fecha de Creación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ecd8ab]/30">
                {filteredDirecciones.map((direccion) => (
                  <tr key={direccion.id} className="hover:bg-[#F5E6C6]/20 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <div className="w-10 h-10 bg-[#F5E6C6]/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                          <MapPin className="w-5 h-5 text-[#CC9F53]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center mb-1">
                            {direccion.alias && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                                {direccion.alias}
                              </span>
                            )}
                            {direccion.predeterminada && (
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                          <p className="text-sm text-[#3A3A3A] font-medium">
                            {direccion.direccion}
                          </p>
                          {direccion.referencia && (
                            <p className="text-xs text-[#9A8C61] mt-1">
                              Ref: {direccion.referencia}
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
                            {direccion.usuario?.nombres && direccion.usuario?.apellidos 
                              ? `${direccion.usuario.nombres} ${direccion.usuario.apellidos}`
                              : direccion.usuario?.email || `Usuario ID: ${direccion.usuarioId}`
                            }
                          </p>
                          {direccion.usuario?.email && (direccion.usuario?.nombres || direccion.usuario?.apellidos) && (
                            <p className="text-xs text-[#9A8C61]">{direccion.usuario.email}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-medium text-[#3A3A3A]">{direccion.distrito}</p>
                        <p className="text-[#9A8C61]">{direccion.provincia}</p>
                        {direccion.codigoPostal && (
                          <p className="text-xs text-[#9A8C61]">CP: {direccion.codigoPostal}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          direccion.activa
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {direccion.activa ? 'Activa' : 'Inactiva'}
                        </span>
                        {direccion.predeterminada && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Star className="w-3 h-3 mr-1" />
                            Predeterminada
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#9A8C61]">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {direccion.creadoEn ? new Date(direccion.creadoEn).toLocaleDateString('es-PE') : 'N/A'}
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

export default DireccionesAdminPage;
