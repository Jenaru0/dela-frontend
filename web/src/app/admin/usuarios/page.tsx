'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Plus, 
  Edit, 
  Shield, 
  Mail, 
  Phone, 
  Search,
  AlertCircle,
  CheckCircle,
  Eye,
  UserCheck,
  UserX,
  User,
  X
} from 'lucide-react';
import { usuariosService } from '@/services/usuarios.service';
import { Usuario, CreateUsuarioDto, UpdateUsuarioDto } from '@/types/usuarios';
import CreateUserModal from '@/components/admin/modals/CreateUserModal';
import EditUserModal from '@/components/admin/modals/EditUserModal';
import EnhancedUserDetailModal from '@/components/admin/EnhancedUserDetailModal';

// Interfaces para filtros (siguiendo patrón de productos)
interface FilterState {
  search: string;
  tipoUsuario: string; // 'CLIENTE', 'ADMIN', ''
  estado: string; // 'activo', 'inactivo', ''
  fechaCreacion: string; // 'este_mes', 'ultimos_3_meses', 'este_año', ''
}

const UsuariosAdminPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Estados de paginación (siguiendo patrón de productos)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [statsData, setStatsData] = useState({
    total: 0,
    activos: 0,
    inactivos: 0,
    clientes: 0,
    admins: 0
  });  const itemsPerPage = 10;  // Estados de filtros (siguiendo patrón de productos)
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    tipoUsuario: '', // 'CLIENTE', 'ADMIN', ''
    estado: '', // 'activo', 'inactivo', ''
    fechaCreacion: '' // 'este_mes', 'ultimos_3_meses', 'este_año', ''
  });

  // Estados para manejar usuarios filtrados en frontend (igual que productos)
  const [allFilteredUsers, setAllFilteredUsers] = useState<Usuario[]>([]);
  const [isUsingFrontendPagination, setIsUsingFrontendPagination] = useState(false);

  // Función para mostrar notificaciones
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };  // Cargar usuarios con paginación (siguiendo patrón de productos)
  const loadUsers = useCallback(async (page: number = 1, scrollToTop: boolean = true) => {
    try {
      setIsLoading(true);
      
      // Scroll hacia arriba suavemente cuando se cambia de página
      if (scrollToTop && page !== currentPage) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }

      // Detectar si necesitamos filtros especiales (frontend) como productos
      const needsFrontendFiltering = filters.tipoUsuario || filters.estado || filters.fechaCreacion;
        if (needsFrontendFiltering) {
        // Obtener TODOS los usuarios y filtrar en frontend
        const response = await usuariosService.obtenerTodos();
        let allUsers = response.data;
        
        // Ordenar por ID ascendente
        allUsers = allUsers.sort((a, b) => a.id - b.id);
        
        // Aplicar filtros especiales en frontend
        if (filters.tipoUsuario) {
          allUsers = allUsers.filter(usuario => usuario.tipoUsuario === filters.tipoUsuario);
        }
        
        if (filters.estado === 'activo') {
          allUsers = allUsers.filter(usuario => usuario.activo !== false);
        } else if (filters.estado === 'inactivo') {
          allUsers = allUsers.filter(usuario => usuario.activo === false);
        }
        
        if (filters.fechaCreacion) {
          const now = new Date();
          allUsers = allUsers.filter(usuario => {
            if (!usuario.creadoEn) return false;
            const createdDate = new Date(usuario.creadoEn);
            
            switch (filters.fechaCreacion) {
              case 'este_mes':
                return createdDate.getMonth() === now.getMonth() && 
                       createdDate.getFullYear() === now.getFullYear();
              case 'ultimos_3_meses':
                const threeMonthsAgo = new Date();
                threeMonthsAgo.setMonth(now.getMonth() - 3);
                return createdDate >= threeMonthsAgo;
              case 'este_año':
                return createdDate.getFullYear() === now.getFullYear();
              default:
                return true;
            }
          });
        }
        
        // Aplicar búsqueda en frontend también
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          allUsers = allUsers.filter(usuario =>
            usuario.email.toLowerCase().includes(searchLower) ||
            usuario.nombres?.toLowerCase().includes(searchLower) ||
            usuario.apellidos?.toLowerCase().includes(searchLower)
          );
        }
          // Guardar todos los usuarios filtrados
        setAllFilteredUsers(allUsers);
        setIsUsingFrontendPagination(true);
        
        // Calcular paginación en frontend
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedUsers = allUsers.slice(startIndex, endIndex);
        
        setUsuarios(paginatedUsers);
        setTotalUsers(allUsers.length);
        setTotalPages(Math.ceil(allUsers.length / itemsPerPage));
        setCurrentPage(page);
      } else {
        // Paginación normal del backend (sin filtros especiales)
        const backendFilters = {
          search: filters.search || undefined,
        };        const response = await usuariosService.obtenerConPaginacion(page, itemsPerPage, backendFilters);
        
        // Ordenar por ID ascendente (igual que productos)
        const sortedUsers = response.data.sort((a: Usuario, b: Usuario) => a.id - b.id);
          setUsuarios(sortedUsers);
        setTotalUsers(response.total);
        setTotalPages(Math.ceil(response.total / itemsPerPage));
        setCurrentPage(page);
        setAllFilteredUsers([]);
        setIsUsingFrontendPagination(false);
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      showNotification('error', 'Error al cargar usuarios');
      setUsuarios([]);
      setAllFilteredUsers([]);
      setIsUsingFrontendPagination(false);
    } finally {
      setIsLoading(false);
    }
  }, [filters, currentPage]);

  // Cargar estadísticas (igual que productos)
  const loadStats = useCallback(async () => {
    try {
      // Obtener todos los usuarios para calcular estadísticas (sin filtros)
      const response = await usuariosService.obtenerTodos();
      const todosLosUsuarios = response.data.sort((a, b) => a.id - b.id);
      
      console.log('📊 Calculando estadísticas:', {
        totalUsuarios: todosLosUsuarios.length,
        usuarios: todosLosUsuarios.map(u => ({ id: u.id, email: u.email, activo: u.activo, tipo: u.tipoUsuario }))
      });
      
      const stats = {
        total: todosLosUsuarios.length,
        activos: todosLosUsuarios.filter(u => u.activo !== false).length,
        inactivos: todosLosUsuarios.filter(u => u.activo === false).length,
        clientes: todosLosUsuarios.filter(u => u.tipoUsuario === 'CLIENTE').length,
        admins: todosLosUsuarios.filter(u => u.tipoUsuario === 'ADMIN').length
      };
      
      console.log('📊 Estadísticas calculadas:', stats);
      setStatsData(stats);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }  }, []);

  // Cargar usuarios y estadísticas al montar el componente
  useEffect(() => {
    loadUsers();
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recargar usuarios cuando cambien los filtros
  useEffect(() => {
    if (filters.search || filters.tipoUsuario || filters.estado || filters.fechaCreacion) {
      setCurrentPage(1); // Reset a página 1 cuando hay filtros
      loadUsers(1);
    } else {
      loadUsers(currentPage);
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
      tipoUsuario: '',
      estado: '',
      fechaCreacion: ''
    });
  };

  // Contar filtros activos
  const activeFiltersCount = Object.entries(filters).filter(([, value]) => {
    return value !== '';
  }).length;
  // Función para refrescar datos (siguiendo patrón de productos)
  const refreshData = () => {
    loadUsers(currentPage, false); // false para no hacer scroll al refrescar
    loadStats();
  };

  // Crear usuario
  const handleCreateUser = async (userData: CreateUsuarioDto) => {
    try {
      await usuariosService.crear(userData);
      showNotification('success', 'Usuario creado correctamente');
      refreshData();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error al crear usuario:', error);
      showNotification('error', 'Error al crear usuario');
    }
  };
  // Actualizar usuario
  const handleUpdateUser = async (userId: number, userData: UpdateUsuarioDto) => {
    try {
      await usuariosService.actualizar(userId, userData);
      showNotification('success', 'Usuario actualizado correctamente');
      refreshData();
      setIsEditModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      showNotification('error', 'Error al actualizar usuario');
    }
  };

  // Cambiar estado de usuario (activar/desactivar)
  const handleToggleUserStatus = async (userId: number, currentStatus: boolean) => {
    const action = currentStatus ? 'desactivar' : 'activar';
    if (!confirm(`¿Estás seguro de que quieres ${action} este usuario?`)) {
      return;
    }

    try {
      await usuariosService.cambiarEstado(userId, !currentStatus);
      showNotification('success', `Usuario ${action}ado correctamente`);
      refreshData();
    } catch (error) {
      console.error(`Error al ${action} usuario:`, error);
      showNotification('error', `Error al ${action} usuario`);
    }
  };
  // Manejar cambio de página (igual que productos)
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
      const paginatedUsers = allFilteredUsers.slice(startIndex, endIndex);
      
      setUsuarios(paginatedUsers);
      setCurrentPage(newPage);
    } else {
      // Si estamos usando paginación backend (sin filtros especiales)
      loadUsers(newPage, false); // false porque ya hicimos scroll arriba
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
          <h1 className="text-3xl font-bold text-[#3A3A3A]">Gestión de Usuarios</h1>
          <p className="text-[#9A8C61] mt-1">
            Administra usuarios, perfiles y permisos del sistema
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-gradient-to-r from-[#CC9F53] to-[#b08a3c] hover:from-[#b08a3c] hover:to-[#9a7635] text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Crear Usuario
        </Button>
      </div>      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#9A8C61]">Total Usuarios</p>
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
              <p className="text-sm font-medium text-[#9A8C61]">Usuarios Activos</p>
              <p className="text-2xl font-bold text-[#3A3A3A]">{statsData.activos}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#9A8C61]">Usuarios Inactivos</p>
              <p className="text-2xl font-bold text-[#3A3A3A]">{statsData.inactivos}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#9A8C61]">Clientes</p>
              <p className="text-2xl font-bold text-[#3A3A3A]">{statsData.clientes}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#9A8C61]">Administradores</p>
              <p className="text-2xl font-bold text-[#3A3A3A]">{statsData.admins}</p>
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
                placeholder="Buscar usuarios..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10 border-[#ecd8ab]/50 focus:border-[#CC9F53] focus:ring-[#CC9F53]/20 text-sm"
              />
            </div>
          </div>
          
          {/* Filtro Tipo Usuario */}
          <div>
            <label className="block text-xs font-medium text-[#9A8C61] mb-1">
              Tipo de Usuario
            </label>
            <select
              value={filters.tipoUsuario}
              onChange={(e) => handleFilterChange('tipoUsuario', e.target.value)}
              className="w-full px-3 py-2 border border-[#ecd8ab]/50 rounded-md focus:border-[#CC9F53] focus:ring-[#CC9F53]/20 bg-white text-sm"
            >
              <option value="">Todos los tipos</option>
              <option value="CLIENTE">Cliente</option>
              <option value="ADMIN">Administrador</option>
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
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          {/* Filtro Fecha Creación */}
          <div>
            <label className="block text-xs font-medium text-[#9A8C61] mb-1">
              Fecha de Registro
            </label>
            <select
              value={filters.fechaCreacion}
              onChange={(e) => handleFilterChange('fechaCreacion', e.target.value)}
              className="w-full px-3 py-2 border border-[#ecd8ab]/50 rounded-md focus:border-[#CC9F53] focus:ring-[#CC9F53]/20 bg-white text-sm"
            >
              <option value="">Todas las fechas</option>
              <option value="este_mes">Este mes</option>
              <option value="ultimos_3_meses">Últimos 3 meses</option>
              <option value="este_año">Este año</option>
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

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#ecd8ab]/30 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CC9F53] mx-auto"></div>
            <p className="mt-4 text-[#9A8C61]">Cargando usuarios...</p>
          </div>
        ) : usuarios.length === 0 ? (          <div className="p-8 text-center">
            <Users className="h-12 w-12 text-[#CC9F53]/60 mx-auto mb-4" />
            <p className="text-[#9A8C61]">No se encontraron usuarios</p>
          </div>
        ) : (          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#F5E6C6]/50 to-[#FAF3E7]/30 border-b border-[#ecd8ab]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">Usuario</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">Contacto</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">Tipo</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">Estado</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">Fecha Registro</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-[#3A3A3A]">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ecd8ab]/30">
                {usuarios.map((user) => (
                  <tr key={user.id} className="hover:bg-[#F5E6C6]/20 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#CC9F53] to-[#b08a3c] rounded-full text-white font-semibold mr-3">
                          {user.nombres?.charAt(0)?.toUpperCase() || 'U'}
                          {user.apellidos?.charAt(0)?.toUpperCase() || ''}
                        </div>
                        <div>
                          <p className="font-medium text-[#3A3A3A]">
                            {user.nombres} {user.apellidos}
                          </p>
                          <p className="text-sm text-[#9A8C61]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-[#9A8C61]">
                          <Mail className="h-4 w-4 mr-2 text-[#CC9F53]" />
                          {user.email}
                        </div>                        {user.celular && (
                          <div className="flex items-center text-sm text-[#9A8C61]">
                            <Phone className="h-4 w-4 mr-2 text-[#CC9F53]" />
                            {user.celular}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.tipoUsuario === 'ADMIN'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'bg-[#F5E6C6] text-[#CC9F53] border border-[#ecd8ab]'
                      }`}>
                        <Shield className="h-3 w-3 mr-1" />
                        {user.tipoUsuario === 'CLIENTE' ? 'Cliente' : 'Admin'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.activo !== false
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {user.activo !== false ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Activo
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Inactivo
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#9A8C61]">
                      {user.creadoEn 
                        ? new Date(user.creadoEn).toLocaleDateString('es-ES')
                        : 'No disponible'
                      }
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsViewModalOpen(true);
                          }}
                          className="hover:bg-[#F5E6C6]/30 hover:text-[#CC9F53] transition-colors duration-200"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsEditModalOpen(true);
                          }}
                          className="hover:bg-[#F5E6C6]/30 hover:text-[#CC9F53] transition-colors duration-200"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleUserStatus(user.id, user.activo !== false)}
                          className={`transition-colors duration-200 ${
                            user.activo !== false
                              ? 'text-red-600 hover:text-red-700 hover:bg-red-50'
                              : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                          }`}
                          title={user.activo !== false ? 'Desactivar usuario' : 'Activar usuario'}
                        >
                          {user.activo !== false ? (
                            <UserX className="h-4 w-4" />
                          ) : (
                            <UserCheck className="h-4 w-4" />
                          )}
                        </Button>                      </div>
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
              Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, totalUsers)} de {totalUsers} usuarios
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

      {/* Modals */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateUser}
      />      <EditUserModal
        usuario={selectedUser}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdateUser}
      />

      {/* User Detail Modal */}
      {selectedUser && (
        <EnhancedUserDetailModal
          usuario={selectedUser}
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>  );
};

export default UsuariosAdminPage;