'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Shield, 
  MapPin, 
  Package, 
  MessageSquare, 
  Star,
  Heart,
  Calendar,
  Clock,
  Truck,
  CheckCircle,
  AlertCircle,
  XCircle,
  Home,
  Building
} from 'lucide-react';
import { Usuario } from '@/types/usuarios';
import { adminService, UserActivity } from '@/services/admin.service';

interface EnhancedUserDetailModalProps {
  usuario: Usuario;
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'info' | 'direcciones' | 'pedidos' | 'reclamos' | 'reviews' | 'favoritos';

const EnhancedUserDetailModal: React.FC<EnhancedUserDetailModalProps> = ({ usuario, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [isLoading, setIsLoading] = useState(false);
  const [userActivity, setUserActivity] = useState<UserActivity | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadUserActivity = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Try to get complete activity, fallback to individual calls if endpoint doesn't exist
      try {
        const response = await adminService.obtenerActividadUsuario(usuario.id);
        setUserActivity(response.data);
      } catch {
        // Fallback: load each section individually
        console.log('Loading activity sections individually...');
        const [direcciones, pedidos, reclamos, reviews, favoritos] = await Promise.allSettled([
          adminService.obtenerDireccionesUsuario(usuario.id),
          adminService.obtenerPedidosUsuario(usuario.id),
          adminService.obtenerReclamosUsuario(usuario.id),
          adminService.obtenerReviewsUsuario(usuario.id),
          adminService.obtenerFavoritosUsuario(usuario.id),
        ]);

        setUserActivity({
          direcciones: direcciones.status === 'fulfilled' ? direcciones.value.data : [],
          pedidos: pedidos.status === 'fulfilled' ? pedidos.value.data : [],
          reclamos: reclamos.status === 'fulfilled' ? reclamos.value.data : [],
          reviews: reviews.status === 'fulfilled' ? reviews.value.data : [],
          favoritos: favoritos.status === 'fulfilled' ? favoritos.value.data : [],
        });
      }
    } catch (error) {
      console.error('Error al cargar actividad del usuario:', error);
      setError('Error al cargar la actividad del usuario');
      // Set empty activity to prevent render errors
      setUserActivity({
        direcciones: [],
        pedidos: [],
        reclamos: [],
        reviews: [],
        favoritos: [],
      });
    } finally {
      setIsLoading(false);
    }
  }, [usuario.id]);

  useEffect(() => {
    if (isOpen && usuario) {
      loadUserActivity();
    }
  }, [isOpen, usuario, loadUserActivity]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ENTREGADO':
      case 'APROBADO':
      case 'RESUELTO':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'ENVIADO':
      case 'EN_PROCESO':
        return <Truck className="h-4 w-4 text-blue-600" />;
      case 'PENDIENTE':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'CANCELADO':
      case 'RECHAZADO':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ENTREGADO':
      case 'APROBADO':
      case 'RESUELTO':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'ENVIADO':
      case 'EN_PROCESO':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PENDIENTE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CANCELADO':
      case 'RECHAZADO':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICA':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'ALTA':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIA':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'BAJA':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const tabs = [
    { id: 'info', label: 'Información', icon: User, count: null },
    { id: 'direcciones', label: 'Direcciones', icon: MapPin, count: userActivity?.direcciones?.length || 0 },
    { id: 'pedidos', label: 'Pedidos', icon: Package, count: userActivity?.pedidos?.length || 0 },
    { id: 'reclamos', label: 'Reclamos', icon: MessageSquare, count: userActivity?.reclamos?.length || 0 },
    { id: 'reviews', label: 'Reseñas', icon: Star, count: userActivity?.reviews?.length || 0 },
    { id: 'favoritos', label: 'Favoritos', icon: Heart, count: userActivity?.favoritos?.length || 0 },
  ] as const;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        
        <div className="relative bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#CC9F53] to-[#b08a3c] rounded-full text-white font-bold text-lg">
                {usuario.nombres?.charAt(0)?.toUpperCase() || 'U'}
                {usuario.apellidos?.charAt(0)?.toUpperCase() || ''}
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#3A3A3A]">
                  {usuario.nombres} {usuario.apellidos}
                </h2>
                <p className="text-[#9A8C61] text-sm">{usuario.email}</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                  usuario.tipoUsuario === 'ADMIN'
                    ? 'bg-purple-100 text-purple-800 border border-purple-200'
                    : 'bg-[#F5E6C6] text-[#CC9F53] border border-[#ecd8ab]'
                }`}>
                  <Shield className="h-3 w-3 mr-1" />
                  {usuario.tipoUsuario === 'CLIENTE' ? 'Cliente' : 'Admin'}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-0 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-[#CC9F53] text-[#CC9F53]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                    {tab.count !== null && (
                      <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded-full ${
                        activeTab === tab.id ? 'bg-[#CC9F53] text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CC9F53]"></div>
                <span className="ml-3 text-[#9A8C61]">Cargando actividad del usuario...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 mb-2">Error al cargar datos</p>
                <p className="text-gray-500 text-sm">{error}</p>
                <Button
                  onClick={loadUserActivity}
                  className="mt-4"
                  variant="outline"
                >
                  Reintentar
                </Button>
              </div>
            ) : (
              <>
                {/* Info Tab */}
                {activeTab === 'info' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-[#3A3A3A] mb-4">Información Personal</h3>
                        
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-[#CC9F53]" />
                          <div>
                            <p className="text-sm text-[#9A8C61]">Email</p>
                            <p className="font-medium text-[#3A3A3A]">{usuario.email}</p>
                          </div>
                        </div>

                        {usuario.celular && (
                          <div className="flex items-center space-x-3">
                            <Phone className="h-5 w-5 text-[#CC9F53]" />
                            <div>
                              <p className="text-sm text-[#9A8C61]">Teléfono</p>
                              <p className="font-medium text-[#3A3A3A]">{usuario.celular}</p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center space-x-3">
                          <Shield className="h-5 w-5 text-[#CC9F53]" />
                          <div>
                            <p className="text-sm text-[#9A8C61]">Tipo de Usuario</p>
                            <p className="font-medium text-[#3A3A3A]">{usuario.tipoUsuario}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-[#3A3A3A] mb-4">Actividad</h3>
                        
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-[#CC9F53]" />
                          <div>
                            <p className="text-sm text-[#9A8C61]">Fecha de Registro</p>
                            <p className="font-medium text-[#3A3A3A]">
                              {usuario.creadoEn ? formatDate(usuario.creadoEn) : 'No disponible'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Clock className="h-5 w-5 text-[#CC9F53]" />
                          <div>
                            <p className="text-sm text-[#9A8C61]">Última Actualización</p>
                            <p className="font-medium text-[#3A3A3A]">
                              {usuario.actualizadoEn ? formatDate(usuario.actualizadoEn) : 'No disponible'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Activity Summary */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-[#3A3A3A] mb-4">Resumen de Actividad</h3>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="text-center p-4 bg-[#F5E6C6]/30 rounded-lg">
                          <MapPin className="h-6 w-6 text-[#CC9F53] mx-auto mb-2" />
                          <p className="text-2xl font-bold text-[#3A3A3A]">{userActivity?.direcciones?.length || 0}</p>
                          <p className="text-sm text-[#9A8C61]">Direcciones</p>
                        </div>
                        <div className="text-center p-4 bg-[#F5E6C6]/30 rounded-lg">
                          <Package className="h-6 w-6 text-[#CC9F53] mx-auto mb-2" />
                          <p className="text-2xl font-bold text-[#3A3A3A]">{userActivity?.pedidos?.length || 0}</p>
                          <p className="text-sm text-[#9A8C61]">Pedidos</p>
                        </div>
                        <div className="text-center p-4 bg-[#F5E6C6]/30 rounded-lg">
                          <MessageSquare className="h-6 w-6 text-[#CC9F53] mx-auto mb-2" />
                          <p className="text-2xl font-bold text-[#3A3A3A]">{userActivity?.reclamos?.length || 0}</p>
                          <p className="text-sm text-[#9A8C61]">Reclamos</p>
                        </div>
                        <div className="text-center p-4 bg-[#F5E6C6]/30 rounded-lg">
                          <Star className="h-6 w-6 text-[#CC9F53] mx-auto mb-2" />
                          <p className="text-2xl font-bold text-[#3A3A3A]">{userActivity?.reviews?.length || 0}</p>
                          <p className="text-sm text-[#9A8C61]">Reseñas</p>
                        </div>
                        <div className="text-center p-4 bg-[#F5E6C6]/30 rounded-lg">
                          <Heart className="h-6 w-6 text-[#CC9F53] mx-auto mb-2" />
                          <p className="text-2xl font-bold text-[#3A3A3A]">{userActivity?.favoritos?.length || 0}</p>
                          <p className="text-sm text-[#9A8C61]">Favoritos</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Direcciones Tab */}
                {activeTab === 'direcciones' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#3A3A3A]">Direcciones del Usuario</h3>
                    {userActivity?.direcciones && userActivity.direcciones.length > 0 ? (
                      <div className="space-y-3">
                        {userActivity.direcciones.map((direccion) => (
                          <div key={direccion.id} className="border border-[#ecd8ab]/30 rounded-lg p-4 hover:bg-[#F5E6C6]/10 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                  {direccion.alias?.toLowerCase().includes('casa') || direccion.alias?.toLowerCase().includes('domicilio') ? 
                                    <Home className="h-5 w-5 text-[#CC9F53] mt-1" /> : 
                                    <Building className="h-5 w-5 text-[#CC9F53] mt-1" />
                                  }
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    {direccion.alias && (
                                      <span className="font-medium text-[#3A3A3A]">{direccion.alias}</span>
                                    )}
                                    {direccion.predeterminada && (
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#F5E6C6] text-[#CC9F53] border border-[#ecd8ab]">
                                        Predeterminada
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[#3A3A3A] mb-1">{direccion.direccion}</p>
                                  <p className="text-sm text-[#9A8C61]">
                                    {direccion.distrito}, {direccion.provincia}
                                    {direccion.codigoPostal && ` - ${direccion.codigoPostal}`}
                                  </p>
                                  {direccion.referencia && (
                                    <p className="text-sm text-[#9A8C61] mt-1">
                                      <strong>Referencia:</strong> {direccion.referencia}
                                    </p>
                                  )}
                                  <p className="text-xs text-[#9A8C61] mt-2">
                                    Creada: {formatDate(direccion.creadoEn)}
                                  </p>
                                </div>
                              </div>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                direccion.activa ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {direccion.activa ? 'Activa' : 'Inactiva'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No hay direcciones registradas</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Pedidos Tab */}
                {activeTab === 'pedidos' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#3A3A3A]">Historial de Pedidos</h3>
                    {userActivity?.pedidos && userActivity.pedidos.length > 0 ? (
                      <div className="space-y-4">
                        {userActivity.pedidos.map((pedido) => (
                          <div key={pedido.id} className="border border-[#ecd8ab]/30 rounded-lg p-4 hover:bg-[#F5E6C6]/10 transition-colors">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-semibold text-[#3A3A3A]">#{pedido.numero}</span>
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(pedido.estado)}`}>
                                    {getStatusIcon(pedido.estado)}
                                    <span className="ml-1">{pedido.estado}</span>
                                  </span>
                                </div>
                                <p className="text-sm text-[#9A8C61]">
                                  Pedido: {formatDate(pedido.fechaPedido)}
                                  {pedido.fechaEntrega && ` • Entrega: ${formatDate(pedido.fechaEntrega)}`}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-[#3A3A3A]">{formatCurrency(pedido.total)}</p>
                                <p className="text-sm text-[#9A8C61]">{pedido.metodoPago}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-[#9A8C61]">Subtotal</p>
                                <p className="font-medium">{formatCurrency(pedido.subtotal)}</p>
                              </div>
                              <div>
                                <p className="text-[#9A8C61]">Envío</p>
                                <p className="font-medium">{formatCurrency(pedido.envioMonto)}</p>
                              </div>
                              <div>
                                <p className="text-[#9A8C61]">Descuento</p>
                                <p className="font-medium text-green-600">-{formatCurrency(pedido.descuentoMonto)}</p>
                              </div>
                              <div>
                                <p className="text-[#9A8C61]">Método Envío</p>
                                <p className="font-medium">{pedido.metodoEnvio}</p>
                              </div>
                            </div>

                            {pedido.promocionCodigo && (
                              <div className="mt-2">
                                <span className="inline-flex items-center px-2 py-1 rounded bg-green-100 text-green-800 text-xs font-medium">
                                  Promoción: {pedido.promocionCodigo}
                                </span>
                              </div>
                            )}

                            {pedido.notasCliente && (
                              <div className="mt-2">
                                <p className="text-sm text-[#9A8C61]">
                                  <strong>Notas del cliente:</strong> {pedido.notasCliente}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No hay pedidos realizados</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Reclamos Tab */}
                {activeTab === 'reclamos' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#3A3A3A]">Historial de Reclamos</h3>
                    {userActivity?.reclamos && userActivity.reclamos.length > 0 ? (
                      <div className="space-y-4">
                        {userActivity.reclamos.map((reclamo) => (
                          <div key={reclamo.id} className="border border-[#ecd8ab]/30 rounded-lg p-4 hover:bg-[#F5E6C6]/10 transition-colors">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-semibold text-[#3A3A3A]">{reclamo.asunto}</span>
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(reclamo.estado)}`}>
                                    {getStatusIcon(reclamo.estado)}
                                    <span className="ml-1">{reclamo.estado}</span>
                                  </span>
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(reclamo.prioridad)}`}>
                                    {reclamo.prioridad}
                                  </span>
                                </div>
                                <p className="text-sm text-[#9A8C61] mb-2">
                                  Tipo: {reclamo.tipoReclamo} • Creado: {formatDate(reclamo.creadoEn)}
                                  {reclamo.pedido?.numero && ` • Pedido: #${reclamo.pedido.numero}`}
                                </p>
                                <p className="text-[#3A3A3A]">{reclamo.descripcion}</p>
                                {reclamo.fechaCierre && (
                                  <p className="text-sm text-[#9A8C61] mt-2">
                                    Cerrado: {formatDate(reclamo.fechaCierre)}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No hay reclamos registrados</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#3A3A3A]">Reseñas del Usuario</h3>
                    {userActivity?.reviews && userActivity.reviews.length > 0 ? (
                      <div className="space-y-4">
                        {userActivity.reviews.map((review) => (
                          <div key={review.id} className="border border-[#ecd8ab]/30 rounded-lg p-4 hover:bg-[#F5E6C6]/10 transition-colors">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-semibold text-[#3A3A3A]">{review.producto.nombre}</span>
                                  <div className="flex items-center space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${
                                          i < review.calificacion ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(review.estado)}`}>
                                    {review.estado}
                                  </span>
                                </div>
                                <p className="text-sm text-[#9A8C61] mb-2">
                                  Calificación: {review.calificacion}/5 • {formatDate(review.creadoEn)}
                                </p>
                                {review.comentario && (
                                  <p className="text-[#3A3A3A]">{review.comentario}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No hay reseñas escritas</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Favoritos Tab */}
                {activeTab === 'favoritos' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#3A3A3A]">Productos Favoritos</h3>
                    {userActivity?.favoritos && userActivity.favoritos.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userActivity.favoritos.map((favorito) => (
                          <div key={favorito.productoId} className="border border-[#ecd8ab]/30 rounded-lg p-4 hover:bg-[#F5E6C6]/10 transition-colors">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0">                                {favorito.producto.imagenes?.[0]?.url ? (
                                  <Image
                                    src={favorito.producto.imagenes[0].url}
                                    alt={favorito.producto.imagenes[0].altText || favorito.producto.nombre}
                                    width={64}
                                    height={64}
                                    className="w-16 h-16 object-cover rounded-lg"
                                  />
                                ) : (
                                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <Package className="h-8 w-8 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-[#3A3A3A] mb-1">{favorito.producto.nombre}</h4>
                                <p className="text-lg font-bold text-[#CC9F53] mb-1">
                                  {formatCurrency(favorito.producto.precioUnitario)}
                                </p>
                                <p className="text-sm text-[#9A8C61]">
                                  Agregado: {formatDate(favorito.creadoEn)}
                                </p>
                              </div>
                              <div className="flex-shrink-0">
                                <Heart className="h-5 w-5 text-red-500 fill-current" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No hay productos favoritos</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <div className="flex justify-end">
              <Button
                onClick={onClose}
                variant="outline"
                className="text-[#9A8C61] border-[#E5E0C8] hover:bg-[#F5E6C6]/30"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedUserDetailModal;
