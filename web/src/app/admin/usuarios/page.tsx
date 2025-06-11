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
  User
} from 'lucide-react';
import { usuariosService } from '@/services/usuarios.service';
import { Usuario, CreateUsuarioDto, UpdateUsuarioDto } from '@/types/usuarios';
import CreateUserModal from '@/components/admin/modals/CreateUserModal';
import EditUserModal from '@/components/admin/modals/EditUserModal';
import EnhancedUserDetailModal from '@/components/admin/EnhancedUserDetailModal';

const UsuariosAdminPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Función para mostrar notificaciones
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Cargar usuarios
  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await usuariosService.obtenerTodos();
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      showNotification('error', 'Error al cargar usuarios');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Crear usuario
  const handleCreateUser = async (userData: CreateUsuarioDto) => {
    try {
      await usuariosService.crear(userData);
      showNotification('success', 'Usuario creado correctamente');
      loadUsers();
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
      loadUsers();
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
      loadUsers();
    } catch (error) {
      console.error(`Error al ${action} usuario:`, error);
      showNotification('error', `Error al ${action} usuario`);
    }
  };

  // Filtrar usuarios
  const filteredUsers = usuarios.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.apellidos?.toLowerCase().includes(searchTerm.toLowerCase())
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
              <p className="text-2xl font-bold text-[#3A3A3A]">{usuarios.length}</p>
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
              <p className="text-2xl font-bold text-[#3A3A3A]">
                {usuarios.filter(u => u.activo !== false).length}
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
              <p className="text-sm font-medium text-[#9A8C61]">Usuarios Inactivos</p>
              <p className="text-2xl font-bold text-[#3A3A3A]">
                {usuarios.filter(u => u.activo === false).length}
              </p>
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
              <p className="text-2xl font-bold text-[#3A3A3A]">
                {usuarios.filter(u => u.tipoUsuario === 'CLIENTE').length}
              </p>
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
              <p className="text-2xl font-bold text-[#3A3A3A]">
                {usuarios.filter(u => u.tipoUsuario === 'ADMIN').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9A8C61] h-5 w-5" />
          <Input
            type="text"
            placeholder="Buscar usuarios por email, nombres o apellidos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-[#ecd8ab]/50 focus:border-[#CC9F53] focus:ring-[#CC9F53]/20"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#ecd8ab]/30 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CC9F53] mx-auto"></div>
            <p className="mt-4 text-[#9A8C61]">Cargando usuarios...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="h-12 w-12 text-[#CC9F53]/60 mx-auto mb-4" />
            <p className="text-[#9A8C61]">No se encontraron usuarios</p>
          </div>        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#F5E6C6]/50 to-[#FAF3E7]/30 border-b border-[#ecd8ab]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">
                    Usuario
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">
                    Contacto
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">
                    Tipo
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">
                    Fecha Registro
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-[#3A3A3A]">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ecd8ab]/30">
                {filteredUsers.map((user) => (
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
                        </div>
                        {user.celular && (
                          <div className="flex items-center text-sm text-[#9A8C61]">
                            <Phone className="h-4 w-4 mr-2 text-[#CC9F53]" />
                            {user.celular}
                          </div>
                        )}
                      </div>                    </td>
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
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsViewModalOpen(true);
                          }}
                          className="hover:bg-[#F5E6C6]/30 hover:text-[#CC9F53] transition-colors duration-200"
                        >
                          <Eye className="h-4 w-4" />                        </Button>
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