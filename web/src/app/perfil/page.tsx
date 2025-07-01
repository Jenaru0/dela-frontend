'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { User, Shield, Mail, Phone, AlertCircle, CheckCircle, MapPin, Plus, Package, MessageSquare, Star, UserX, Eye, Info } from 'lucide-react';
import EditProfileModal from '@/components/auth/EditProfileModal';
import ChangePasswordModal from '@/components/auth/ChangePasswordModal';
import AddressModal from '@/components/direcciones/AddressModal';
import AddressList from '@/components/direcciones/AddressList';
import PedidoDetailModal from '@/components/perfil/PedidoDetailModal';
import CreateReviewModal from '@/components/perfil/CreateReviewModal';
import CreateClaimModal from '@/components/perfil/CreateClaimModal';
import ClaimDetailModal from '@/components/perfil/ClaimDetailModal';
import { usuariosService } from '@/services/usuarios.service';
import { authService } from '@/services/auth.service';
import { direccionesService } from '@/services/direcciones.service';
import { newsletterService } from '@/services/newsletter.service';
import { pedidosService, Pedido } from '@/services/pedidos.service';
import { reclamosService, Reclamo } from '@/services/reclamos.service';
import { resenasService, Resena } from '@/services/resenas.service';
import { UpdateUsuarioDto } from '@/types/usuarios';
import { DireccionCliente, CreateDireccionDto, UpdateDireccionDto } from '@/types/direcciones';
import { useReclamos } from '@/hooks/useReclamos';
import { EstadoPedidoLabels, EstadoPedidoColors, EstadoReclamoLabels, PrioridadReclamoLabels, EstadoResenaLabels, MetodoPagoLabels, MetodoEnvioLabels } from '@/types/enums';
import Layout from '@/components/layout/Layout';

const ProfilePage: React.FC = () => {
  const { usuario, isAuthenticated, actualizarUsuario, isLoading, cerrarSesion } = useAuth();
  const { crearReclamo} = useReclamos();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<DireccionCliente | null>(null);
  const [direcciones, setDirecciones] = useState<DireccionCliente[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  
  // Estados para modales de pedidos y reseñas
  const [isPedidoDetailModalOpen, setIsPedidoDetailModalOpen] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [isCreateReviewModalOpen, setIsCreateReviewModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState<{ productoId: number; productoNombre: string } | null>(null);
  const [isCreateClaimModalOpen, setIsCreateClaimModalOpen] = useState(false);
  const [isClaimDetailModalOpen, setIsClaimDetailModalOpen] = useState(false);
  const [selectedReclamo, setSelectedReclamo] = useState<Reclamo | null>(null);
  const [claimData, setClaimData] = useState<{ pedidoId: number; pedidoNumero: string } | null>(null);  const [activeTab, setActiveTab] = useState<'personal' | 'addresses' | 'orders' | 'claims' | 'reviews'>('personal');
  const [isNewsletterSubscribed, setIsNewsletterSubscribed] = useState(false);
  const [isLoadingNewsletter, setIsLoadingNewsletter] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  
  // Estados para pedidos, reclamos y reseñas
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [reclamos, setReclamos] = useState<Reclamo[]>([]);
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [isLoadingPedidos, setIsLoadingPedidos] = useState(false);
  const [isLoadingReclamos, setIsLoadingReclamos] = useState(false);
  const [isLoadingResenas, setIsLoadingResenas] = useState(false);
    const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);
  
  // Estados para controlar si ya se cargaron los datos
  const [pedidosLoaded, setPedidosLoaded] = useState(false);
  const [reclamosLoaded, setReclamosLoaded] = useState(false);
  const [resenasLoaded, setResenasLoaded] = useState(false);
  
  // Función para mostrar notificaciones
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });    setTimeout(() => setNotification(null), 5000);
  };

  // Verificar suscripción al newsletter
  const checkNewsletterSubscription = useCallback(async () => {
    if (!usuario?.email) return;
    
    try {
      const response = await newsletterService.verificarSuscripcion(usuario.email);
      setIsNewsletterSubscribed(response.data.suscrito);
    } catch (error) {
      console.error('Error al verificar suscripción:', error);
    }
  }, [usuario?.email]);

  // Manejar suscripción/desuscripción al newsletter
  const handleNewsletterToggle = async () => {
    if (!usuario?.email) return;
    
    try {
      setIsLoadingNewsletter(true);
      
      if (isNewsletterSubscribed) {
        await newsletterService.desuscribirse(usuario.email);
        setIsNewsletterSubscribed(false);
        showNotification('success', 'Te has desuscrito del newsletter');
      } else {
        await newsletterService.suscribirse(usuario.email);
        setIsNewsletterSubscribed(true);
        showNotification('success', 'Te has suscrito al newsletter');
      }
    } catch (error) {
      console.error('Error al manejar newsletter:', error);
      showNotification('error', 'Error al procesar la suscripción');
    } finally {
      setIsLoadingNewsletter(false);
    }
  };
  // Manejar desactivación de cuenta
  const handleDeactivateAccount = async () => {
    const confirmed = window.confirm(
      '¿Estás seguro de que quieres desactivar tu cuenta? Esta acción no se puede deshacer y perderás acceso a tu perfil, pedidos y datos guardados.'
    );
    
    if (!confirmed) return;
    
    try {
      setIsDeactivating(true);
      await usuariosService.desactivarCuenta();
      showNotification('success', 'Cuenta desactivada correctamente. Serás redirigido al inicio...');
      
      // Cerrar sesión inmediatamente después de desactivar
      setTimeout(async () => {
        try {
          await cerrarSesion();
          window.location.href = '/';
        } catch (logoutError) {
          console.error('Error al cerrar sesión:', logoutError);
          // Si falla el logout, al menos limpiar localStorage y redirigir
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
          window.location.href = '/';
        }
      }, 1500);    } catch (error: unknown) {
      console.error('Error al desactivar cuenta:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al desactivar la cuenta. Por favor, inténtalo de nuevo.';
      showNotification('error', errorMessage);
    } finally {
      setIsDeactivating(false);
    }
  };
  // Cargar direcciones cuando el usuario esté autenticado
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        setIsLoadingAddresses(true);
        const response = await direccionesService.obtenerDirecciones();
        setDirecciones(response?.data || []);
      } catch (error) {
        console.error('Error al cargar direcciones:', error);
        showNotification('error', 'Error al cargar direcciones');
        setDirecciones([]); // Set empty array on error
      } finally {
        setIsLoadingAddresses(false);
      }
    };    if (isAuthenticated && usuario) {
      loadAddresses();
      checkNewsletterSubscription(); // Verificar suscripción al cargar perfil
    }
  }, [isAuthenticated, usuario, checkNewsletterSubscription]);
  // Verificar suscripción al newsletter cuando cargue el usuario
  useEffect(() => {
    if (usuario?.email) {
      checkNewsletterSubscription();
    }
  }, [usuario?.email, checkNewsletterSubscription]);  // Cargar datos cuando cambie el tab activo
  useEffect(() => {
    if (!isAuthenticated || !usuario) return;

    const loadData = async () => {
      switch (activeTab) {
        case 'orders':
          if (!isLoadingPedidos && !pedidosLoaded) {
            try {
              setIsLoadingPedidos(true);
              const response = await pedidosService.obtenerMisPedidos();
              setPedidos(response?.data || []);
              setPedidosLoaded(true);
            } catch (error) {
              console.error('Error al cargar pedidos:', error);
              showNotification('error', 'Error al cargar pedidos');
              setPedidos([]);
            } finally {
              setIsLoadingPedidos(false);
            }
          }
          break;
        case 'claims':
          if (!isLoadingReclamos && !reclamosLoaded) {
            try {
              setIsLoadingReclamos(true);
              const response = await reclamosService.obtenerMisReclamos();
              setReclamos(response?.data || []);
              setReclamosLoaded(true);
            } catch (error) {
              console.error('Error al cargar reclamos:', error);
              showNotification('error', 'Error al cargar reclamos');
              setReclamos([]);
            } finally {
              setIsLoadingReclamos(false);
            }
          }
          break;
        case 'reviews':
          if (!isLoadingResenas && !resenasLoaded) {
            try {
              setIsLoadingResenas(true);
              const response = await resenasService.obtenerMisResenas();
              setResenas(response?.data || []);
              setResenasLoaded(true);
            } catch (error) {
              console.error('Error al cargar reseñas:', error);
              showNotification('error', 'Error al cargar reseñas');
              setResenas([]);
            } finally {
              setIsLoadingResenas(false);
            }
          }
          break;
        default:
          break;
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, isAuthenticated, usuario]);
  const loadAddresses = async () => {
    try {
      setIsLoadingAddresses(true);
      const response = await direccionesService.obtenerDirecciones();
      setDirecciones(response?.data || []);
    } catch (error) {
      console.error('Error al cargar direcciones:', error);
      showNotification('error', 'Error al cargar direcciones');
      setDirecciones([]); // Set empty array on error
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  // Manejar actualización de perfil
  const handleUpdateProfile = async (datos: UpdateUsuarioDto) => {
    try {
      if (!usuario?.id) return;
      
      const response = await usuariosService.actualizarPerfil(datos);
      
      // Actualizar el usuario en el contexto
      actualizarUsuario(response.data);
      
      showNotification('success', 'Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      showNotification('error', 'Error al actualizar el perfil');
      throw error;
    }
  };
  // Manejar cambio de contraseña
  const handleChangePassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    try {
      await authService.cambiarContrasena(currentPassword, newPassword, confirmPassword);
      showNotification('success', 'Contraseña cambiada correctamente');
    } catch (error: unknown) {
      console.error('Error al cambiar contraseña:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al cambiar la contraseña';
      showNotification('error', errorMessage);
      throw error; // Re-throw para que el modal pueda manejar el error específico
    }
  };

  // Manejar creación/edición de direcciones
  const handleSaveAddress = async (datos: CreateDireccionDto | UpdateDireccionDto) => {
    try {
      if (selectedAddress) {
        // Editar dirección existente
        await direccionesService.actualizarDireccion(selectedAddress.id, datos as UpdateDireccionDto);
        showNotification('success', 'Dirección actualizada correctamente');
      } else {
        // Crear nueva dirección
        await direccionesService.crearDireccion(datos as CreateDireccionDto);
        showNotification('success', 'Dirección creada correctamente');
      }
      await loadAddresses();
      setIsAddressModalOpen(false);
      setSelectedAddress(null);
    } catch (error) {
      console.error('Error al guardar dirección:', error);
      showNotification('error', 'Error al guardar la dirección');
    }
  };

  // Manejar eliminación de dirección
  const handleDeleteAddress = async (id: number) => {
    try {
      await direccionesService.eliminarDireccion(id);
      showNotification('success', 'Dirección eliminada correctamente');
      await loadAddresses();
    } catch (error) {
      console.error('Error al eliminar dirección:', error);
      showNotification('error', 'Error al eliminar la dirección');
    }
  };

  // Establecer dirección como predeterminada
  const handleSetDefaultAddress = async (id: number) => {
    try {
      await direccionesService.establecerPredeterminada(id);
      showNotification('success', 'Dirección predeterminada actualizada');
      await loadAddresses();
    } catch (error) {
      console.error('Error al establecer dirección predeterminada:', error);
      showNotification('error', 'Error al establecer dirección predeterminada');
    }
  };

  // Abrir modal para nueva dirección
  const handleNewAddress = () => {
    setSelectedAddress(null);
    setIsAddressModalOpen(true);
  };

  // Abrir modal para editar dirección
  const handleEditAddress = (direccion: DireccionCliente) => {
    setSelectedAddress(direccion);
    setIsAddressModalOpen(true);
  };

  // Manejar visualización de detalles del pedido
  const handleViewPedidoDetails = (pedido: Pedido) => {
    setSelectedPedido(pedido);
    setIsPedidoDetailModalOpen(true);
  };

  // Manejar creación de reseña
  const handleCreateReview = (productoId: number, productoNombre: string) => {
    setReviewData({ productoId, productoNombre });
    setIsCreateReviewModalOpen(true);
    setIsPedidoDetailModalOpen(false); // Cerrar modal de pedido si está abierto
  };

  // Manejar creación de reclamo
  const handleCreateClaim = (pedidoId: number, pedidoNumero: string) => {
    setClaimData({ pedidoId, pedidoNumero });
    setIsCreateClaimModalOpen(true);
    setIsPedidoDetailModalOpen(false); // Cerrar modal de pedido si está abierto
  };

  // Manejar envío de reseña
  const handleSubmitReview = async (reviewData: { productoId: number; calificacion: number; comentario: string }) => {
    try {
      // TODO: Implementar servicio de reseñas
      console.log('Crear reseña:', reviewData);
      showNotification('success', 'Reseña enviada correctamente. Será revisada antes de publicarse.');
      
      // Opcional: Recargar reseñas si estamos en esa pestaña
      if (activeTab === 'reviews') {
        setResenasLoaded(false);
      }
    } catch (error) {
      console.error('Error al crear reseña:', error);
      throw error; // El modal manejará el error
    }
  };

  // Función para recargar reclamos
  const reloadReclamos = useCallback(async () => {
    if (activeTab === 'claims') {
      try {
        setIsLoadingReclamos(true);
        const response = await reclamosService.obtenerMisReclamos();
        setReclamos(response?.data || []);
      } catch (error) {
        console.error('Error al recargar reclamos:', error);
      } finally {
        setIsLoadingReclamos(false);
      }
    }
  }, [activeTab]);

  // Manejar envío de reclamo
  const handleSubmitClaim = async (claimData: { pedidoId?: number; asunto: string; descripcion: string; tipoReclamo: string }) => {
    try {
      const reclamoCreado = await crearReclamo({
        ...(claimData.pedidoId && { pedidoId: claimData.pedidoId }),
        asunto: claimData.asunto,
        descripcion: claimData.descripcion,
        tipoReclamo: claimData.tipoReclamo,
      });
      
      console.log('Reclamo creado:', reclamoCreado);
      showNotification('success', 'Reclamo enviado correctamente. Te contactaremos pronto.');
      
      // Recargar reclamos
      await reloadReclamos();
      
      // Abrir automáticamente el detalle del reclamo recién creado
      setTimeout(() => {
        setSelectedReclamo(reclamoCreado);
        setIsClaimDetailModalOpen(true);
      }, 1000);
    } catch (error) {
      console.error('Error al crear reclamo:', error);
      throw error; // El modal manejará el error
    }
  };

  // Manejar apertura del detalle de reclamo
  const handleOpenClaimDetails = (reclamo: Reclamo) => {
    console.log('🚀 Abriendo modal de reclamo:', reclamo);
    setSelectedReclamo(reclamo);
    setIsClaimDetailModalOpen(true);
  };// Mostrar loading durante la verificación inicial
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-[#F5EFD7]/30">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#CC9F53] mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-[#3A3A3A] mb-2">
              Verificando sesión...
            </h2>
            <p className="text-gray-600">
              Por favor espera mientras verificamos tu autenticación
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated || !usuario) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-[#F5EFD7]/30">
          <div className="text-center">
            <User className="h-16 w-16 text-[#CC9F53] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#3A3A3A] mb-2">
              Acceso Restringido
            </h2>
            <p className="text-gray-600 mb-6">
              Debes iniciar sesión para acceder a tu perfil
            </p>
            <Button onClick={() => window.history.back()}>
              Volver
            </Button>
          </div>
        </div>
      </Layout>    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-neutral-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Notification */}
          {notification && (
            <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
              notification.type === 'success' 
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                : notification.type === 'info'
                ? 'bg-blue-50 border border-blue-200 text-blue-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              <div className="flex items-center">
                {notification.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 mr-2" />
                ) : notification.type === 'info' ? (
                  <Info className="h-5 w-5 mr-2" />
                ) : (
                  <AlertCircle className="h-5 w-5 mr-2" />
                )}
                {notification.message}
              </div>
            </div>
          )}          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-100">
            <div className="bg-gradient-to-br from-[#CC9F53] to-[#B8903D] p-8 text-white relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-white transform -translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 rounded-full bg-white transform translate-x-12 translate-y-12"></div>
              </div>              <div className="relative flex items-center space-x-6">
                <div className="flex items-center justify-center w-24 h-24 bg-[#CC9F53] rounded-full text-2xl font-bold text-white backdrop-blur-sm border-2 border-white/30 shadow-lg">
                  {usuario.nombres?.charAt(0)?.toUpperCase() || 'U'}
                  {usuario.apellidos?.charAt(0)?.toUpperCase() || ''}
                </div><div className="flex-1">
                  <h1 className="text-3xl font-bold !text-white mb-1">
                    {usuario.nombres} {usuario.apellidos}
                  </h1>
                  <div className="flex items-center mb-3">
                    <Mail className="h-4 w-4 mr-2 text-white/80" />
                    <p className="text-white/90 text-lg">{usuario.email}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center bg-white/20 rounded-full px-3 py-1">
                      <Shield className="h-4 w-4 mr-2 text-white" />
                      <span className="text-sm text-white font-medium">
                        {usuario.tipoUsuario === 'CLIENTE' ? 'Cliente' : 'Administrador'}
                      </span>
                    </div>
                    {usuario.celular && (
                      <div className="flex items-center bg-white/20 rounded-full px-3 py-1">
                        <Phone className="h-4 w-4 mr-2 text-white" />
                        <span className="text-sm text-white font-medium">{usuario.celular}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>            {/* Navigation Tabs */}
            <div className="border-b border-gray-100 bg-gray-50/50">
              <nav className="flex space-x-8 px-8">
                <button
                  onClick={() => setActiveTab('personal')}
                  className={`py-4 px-2 border-b-3 font-medium text-sm transition-all duration-200 flex items-center ${
                    activeTab === 'personal'
                      ? 'border-[#CC9F53] text-[#CC9F53] bg-white/50 rounded-t-lg'
                      : 'border-transparent text-gray-600 hover:text-[#CC9F53] hover:border-[#CC9F53]/30 hover:bg-white/30 rounded-t-lg'
                  }`}
                >
                  <User className="h-4 w-4 mr-2" />
                  Información Personal
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`py-4 px-2 border-b-3 font-medium text-sm transition-all duration-200 flex items-center ${
                    activeTab === 'addresses'
                      ? 'border-[#CC9F53] text-[#CC9F53] bg-white/50 rounded-t-lg'
                      : 'border-transparent text-gray-600 hover:text-[#CC9F53] hover:border-[#CC9F53]/30 hover:bg-white/30 rounded-t-lg'
                  }`}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Mis Direcciones
                </button>                <button
                  onClick={() => setActiveTab('orders')}
                  className={`py-4 px-2 border-b-3 font-medium text-sm transition-all duration-200 flex items-center ${
                    activeTab === 'orders'
                      ? 'border-[#CC9F53] text-[#CC9F53] bg-white/50 rounded-t-lg'
                      : 'border-transparent text-gray-600 hover:text-[#CC9F53] hover:border-[#CC9F53]/30 hover:bg-white/30 rounded-t-lg'
                  }`}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Mis Pedidos
                </button>                <button
                  onClick={() => setActiveTab('claims')}
                  className={`py-4 px-2 border-b-3 font-medium text-sm transition-all duration-200 flex items-center ${
                    activeTab === 'claims'
                      ? 'border-[#CC9F53] text-[#CC9F53] bg-white/50 rounded-t-lg'
                      : 'border-transparent text-gray-600 hover:text-[#CC9F53] hover:border-[#CC9F53]/30 hover:bg-white/30 rounded-t-lg'
                  }`}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Mis Reclamos
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`py-4 px-2 border-b-3 font-medium text-sm transition-all duration-200 flex items-center ${
                    activeTab === 'reviews'
                      ? 'border-[#CC9F53] text-[#CC9F53] bg-white/50 rounded-t-lg'
                      : 'border-transparent text-gray-600 hover:text-[#CC9F53] hover:border-[#CC9F53]/30 hover:bg-white/30 rounded-t-lg'
                  }`}
                >
                  <Star className="h-4 w-4 mr-2" />
                  Mis Reseñas
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-8">
            {/* Personal Information Tab */}
            {activeTab === 'personal' && (
              <div className="grid md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center">
                    <User className="h-5 w-5 mr-2 text-primary-600" />
                    Información Personal
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center p-3 bg-primary-50 rounded-lg">
                      <Mail className="h-5 w-5 text-primary-600 mr-3" />
                      <div>
                        <p className="text-sm text-neutral-600">Correo Electrónico</p>
                        <p className="font-medium text-neutral-900">{usuario.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-primary-50 rounded-lg">
                      <User className="h-5 w-5 text-primary-600 mr-3" />
                      <div>
                        <p className="text-sm text-neutral-600">Nombres</p>
                        <p className="font-medium text-neutral-900">{usuario.nombres || 'No especificado'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-primary-50 rounded-lg">
                      <User className="h-5 w-5 text-primary-600 mr-3" />
                      <div>
                        <p className="text-sm text-neutral-600">Apellidos</p>
                        <p className="font-medium text-neutral-900">{usuario.apellidos || 'No especificado'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-primary-50 rounded-lg">
                      <Phone className="h-5 w-5 text-primary-600 mr-3" />
                      <div>
                        <p className="text-sm text-neutral-600">Celular</p>
                        <p className="font-medium text-neutral-900">{usuario.celular || 'No especificado'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-primary-50 rounded-lg">
                      <Shield className="h-5 w-5 text-primary-600 mr-3" />
                      <div>
                        <p className="text-sm text-neutral-600">Tipo de Usuario</p>
                        <p className="font-medium text-neutral-900">
                          {usuario.tipoUsuario === 'CLIENTE' ? 'Cliente' : 'Administrador'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>                {/* Account Actions */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-primary-600" />
                    Acciones de Cuenta
                  </h2>                  <div className="space-y-4">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setIsEditModalOpen(true)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Editar Perfil
                    </Button>
                      <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setIsPasswordModalOpen(true)}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Cambiar Contraseña
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={handleNewsletterToggle}
                      disabled={isLoadingNewsletter}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      {isNewsletterSubscribed ? 'Cancelar Suscripción' : 'Suscribirse a Newsletter'}
                    </Button>
                    
                    <div className="pt-4 border-t border-neutral-200">
                      <Button
                        variant="outline"
                        className="w-full justify-start text-orange-600 border-orange-200 hover:bg-orange-50"
                        onClick={handleDeactivateAccount}
                        disabled={isDeactivating}
                      >
                        <UserX className="h-4 w-4 mr-2" />
                        {isDeactivating ? 'Desactivando...' : 'Desactivar Cuenta'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-neutral-900 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-primary-600" />
                    Mis Direcciones
                  </h2>
                  <Button
                    onClick={handleNewAddress}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Nueva Dirección
                  </Button>
                </div>

                <AddressList
                  direcciones={direcciones}
                  onEdit={handleEditAddress}
                  onDelete={handleDeleteAddress}
                  onSetDefault={handleSetDefaultAddress}
                  isLoading={isLoadingAddresses}
                />
              </div>
            )}            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center">
                  <Package className="h-5 w-5 mr-2 text-primary-600" />
                  Historial de Pedidos
                </h2>
                
                {isLoadingPedidos ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CC9F53] mx-auto mb-4"></div>
                    <p className="text-gray-500">Cargando pedidos...</p>
                  </div>
                ) : !pedidos || pedidos.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No tienes pedidos aún
                    </h3>
                    <p className="text-gray-500">
                      Cuando realices tu primer pedido, aparecerá aquí
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pedidos.map((pedido) => (
                      <div key={pedido.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Package className="h-5 w-5 text-primary-600" />
                            <div>
                              <h3 className="font-medium text-gray-900">Pedido #{pedido.numero}</h3>
                              <p className="text-sm text-gray-500">
                                {new Date(pedido.creadoEn).toLocaleDateString('es-PE', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">S/ {(Number(pedido.total) || 0).toFixed(2)}</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${EstadoPedidoColors[pedido.estado as keyof typeof EstadoPedidoColors]}`}>
                              {EstadoPedidoLabels[pedido.estado as keyof typeof EstadoPedidoLabels]}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>Pago: {MetodoPagoLabels[pedido.metodoPago as keyof typeof MetodoPagoLabels]}</span>
                            <span>Envío: {MetodoEnvioLabels[pedido.metodoEnvio as keyof typeof MetodoEnvioLabels]}</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewPedidoDetails(pedido)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver detalles
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Claims Tab */}
            {activeTab === 'claims' && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#CC9F53]/10 rounded-full flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-[#CC9F53]" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Mis Reclamos</h2>
                        <p className="text-gray-600 text-sm">
                          Gestiona tus consultas y reclamos
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        setClaimData(null);
                        setIsCreateClaimModalOpen(true);
                      }}
                      className="bg-[#CC9F53] hover:bg-[#B8903D] text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Reclamo
                    </Button>
                  </div>
                </div>

                <div className="p-6">
                  {isLoadingReclamos ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CC9F53] mx-auto mb-4"></div>
                      <p className="text-gray-500">Cargando reclamos...</p>
                    </div>
                  ) : !reclamos || reclamos.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-[#CC9F53]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="h-10 w-10 text-[#CC9F53]" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No tienes reclamos aún
                      </h3>
                      <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        ¿Tienes alguna pregunta o problema? Puedes crear un nuevo reclamo y te ayudaremos a resolverlo.
                      </p>
                      <Button
                        onClick={() => {
                          setClaimData(null);
                          setIsCreateClaimModalOpen(true);
                        }}
                        className="bg-[#CC9F53] hover:bg-[#B8903D] text-white"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Crear Reclamo
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reclamos.map((reclamo) => (
                        <div 
                          key={reclamo.id} 
                          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200 hover:border-[#CC9F53]/30"
                        >
                          {/* Header con título y badges */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {reclamo.asunto}
                              </h3>
                              <div className="flex items-center gap-2 mb-3">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                  reclamo.estado === 'ABIERTO' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                  reclamo.estado === 'EN_PROCESO' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                                  reclamo.estado === 'RESUELTO' ? 'bg-green-50 text-green-700 border border-green-200' :
                                  'bg-red-50 text-red-700 border border-red-200'
                                }`}>
                                  {EstadoReclamoLabels[reclamo.estado as keyof typeof EstadoReclamoLabels]}
                                </span>
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                  reclamo.prioridad === 'ALTA' ? 'bg-red-50 text-red-700 border border-red-200' :
                                  reclamo.prioridad === 'MEDIA' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                                  'bg-gray-50 text-gray-700 border border-gray-200'
                                }`}>
                                  {PrioridadReclamoLabels[reclamo.prioridad as keyof typeof PrioridadReclamoLabels]}
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenClaimDetails(reclamo)}
                              className="border-[#CC9F53] text-[#CC9F53] hover:bg-[#CC9F53] hover:text-white ml-4"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver Detalles
                            </Button>
                          </div>

                          {/* Descripción */}
                          <div className="mb-4">
                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                              {reclamo.descripcion}
                            </p>
                          </div>

                          {/* Metadatos */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-6 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                <span>Reclamo #{reclamo.id}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span>📅</span>
                                <span>
                                  {new Date(reclamo.creadoEn).toLocaleDateString('es-PE', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                  })} a las {new Date(reclamo.creadoEn).toLocaleTimeString('es-PE', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                              {reclamo.pedidoId && (
                                <div className="flex items-center gap-1">
                                  <Package className="h-4 w-4" />
                                  <span>Pedido #{reclamo.pedidoId}</span>
                                </div>
                              )}
                              {reclamo.comentarios && reclamo.comentarios.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="h-4 w-4" />
                                  <span>{reclamo.comentarios.length} comentario{reclamo.comentarios.length > 1 ? 's' : ''}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="text-xs text-gray-400">
                              {reclamo.actualizadoEn && reclamo.actualizadoEn !== reclamo.creadoEn && (
                                <span>
                                  Actualizado: {new Date(reclamo.actualizadoEn).toLocaleDateString('es-PE')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center">
                  <Star className="h-5 w-5 mr-2 text-primary-600" />
                  Mis Reseñas
                </h2>
                
                {isLoadingResenas ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CC9F53] mx-auto mb-4"></div>
                    <p className="text-gray-500">Cargando reseñas...</p>
                  </div>                ) : !resenas || resenas.length === 0 ? (
                  <div className="text-center py-8">
                    <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No tienes reseñas aún
                    </h3>
                    <p className="text-gray-500">
                      Cuando hagas una reseña de un producto, aparecerá aquí
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {resenas.map((resena) => (
                      <div key={resena.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start space-x-3">
                            <Star className="h-5 w-5 text-primary-600 mt-0.5" />
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {resena.producto?.nombre || `Producto ID: ${resena.productoId}`}
                              </h3>
                              <div className="flex items-center mt-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-4 w-4 ${
                                      star <= resena.calificacion
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                                <span className="ml-2 text-sm text-gray-600">
                                  {resena.calificacion}/5
                                </span>
                              </div>
                              {resena.comentario && (
                                <p className="text-sm text-gray-600 mt-2">{resena.comentario}</p>
                              )}                              <p className="text-sm text-gray-500 mt-1">
                                {new Date(resena.creadoEn).toLocaleDateString('es-PE', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              resena.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' :
                              resena.estado === 'APROBADO' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {EstadoResenaLabels[resena.estado as keyof typeof EstadoResenaLabels]}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // TODO: Implementar editar reseña
                                console.log('Editar reseña:', resena.id);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>          {/* Modals */}
          <EditProfileModal
            usuario={usuario}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleUpdateProfile}
          />

          <ChangePasswordModal
            isOpen={isPasswordModalOpen}
            onClose={() => setIsPasswordModalOpen(false)}
            onSave={handleChangePassword}
          />

          <AddressModal
            direccion={selectedAddress}
            isOpen={isAddressModalOpen}
            onClose={() => {
              setIsAddressModalOpen(false);
              setSelectedAddress(null);
            }}
            onSave={handleSaveAddress}
            isEdit={!!selectedAddress}
          />

          {/* Modal de detalles del pedido */}
          <PedidoDetailModal
            isOpen={isPedidoDetailModalOpen}
            onClose={() => {
              setIsPedidoDetailModalOpen(false);
              setSelectedPedido(null);
            }}
            pedido={selectedPedido}
            onCreateReview={handleCreateReview}
            onCreateClaim={handleCreateClaim}
          />

          {/* Modal de crear reseña */}
          {reviewData && (
            <CreateReviewModal
              isOpen={isCreateReviewModalOpen}
              onClose={() => {
                setIsCreateReviewModalOpen(false);
                setReviewData(null);
              }}
              onSubmit={handleSubmitReview}
              productoId={reviewData.productoId}
              productoNombre={reviewData.productoNombre}
            />
          )}

          {/* Modal de crear reclamo */}
          {claimData && (
            <CreateClaimModal
              isOpen={isCreateClaimModalOpen}
              onClose={() => {
                setIsCreateClaimModalOpen(false);
                setClaimData(null);
              }}
              onSubmit={handleSubmitClaim}
              pedidoId={claimData?.pedidoId}
              pedidoNumero={claimData?.pedidoNumero}
            />
          )}

          {/* Modal de detalle de reclamo */}
          <ClaimDetailModal
            isOpen={isClaimDetailModalOpen}
            onClose={() => {
              setIsClaimDetailModalOpen(false);
              setSelectedReclamo(null);
            }}
            reclamo={selectedReclamo}
            onReclamoUpdate={() => {
              // Recargar la lista de reclamos cuando se agregue un comentario
              if (activeTab === 'claims') {
                reloadReclamos();
              }
            }}
          />
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
