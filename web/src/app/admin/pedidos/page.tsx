'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  DollarSign,
  User
} from 'lucide-react';
import { pedidosService, Pedido } from '@/services/pedidos.service';
import { EstadoPedidoLabels, EstadoPedidoColors, MetodoPagoLabels, MetodoEnvioLabels } from '@/types/enums';

const PedidosAdminPage: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
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

  // Cargar pedidos (ADMIN)
  const loadOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await pedidosService.obtenerTodos();
      setPedidos(response.data);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      showNotification('error', 'Error al cargar pedidos');
      setPedidos([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Filtrar pedidos
  const filteredOrders = pedidos.filter(pedido => {
    const matchesSearch = pedido.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pedido.usuario?.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pedido.usuario?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'TODOS' || pedido.estado === statusFilter;
    
    return matchesSearch && matchesStatus;
  });


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
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#9A8C61]">Total</p>
              <p className="text-2xl font-bold text-[#3A3A3A]">{pedidos.length}</p>
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
                {pedidos.filter(p => p.estado === 'PENDIENTE').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#9A8C61]">Procesando</p>
              <p className="text-2xl font-bold text-[#3A3A3A]">
                {pedidos.filter(p => p.estado === 'PREPARANDO').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#9A8C61]">Enviados</p>
              <p className="text-2xl font-bold text-[#3A3A3A]">
                {pedidos.filter(p => p.estado === 'EN_CAMINO').length}
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
              <p className="text-sm font-medium text-[#9A8C61]">Entregados</p>
              <p className="text-2xl font-bold text-[#3A3A3A]">
                {pedidos.filter(p => p.estado === 'ENTREGADO').length}
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
              placeholder="Buscar por número de pedido, cliente o email..."
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
            <option value="CONFIRMADO">Confirmado</option>
            <option value="PROCESANDO">Procesando</option>
            <option value="ENVIADO">Enviado</option>
            <option value="ENTREGADO">Entregado</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
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
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#F5E6C6]/50 to-[#FAF3E7]/30 border-b border-[#ecd8ab]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">
                    Pedido
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">
                    Cliente
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#3A3A3A]">
                    Método
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
                {filteredOrders.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-[#F5E6C6]/20 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-[#F5E6C6]/30 rounded-lg flex items-center justify-center mr-3">
                          <Package className="w-5 h-5 text-[#CC9F53]" />
                        </div>
                        <div>
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
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-[#CC9F53] mr-1" />
                        <span className="font-medium text-[#3A3A3A]">
                          S/ {pedido.total.toFixed(2)}
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
                        <span className="text-sm text-[#3A3A3A]">
                          {MetodoPagoLabels[pedido.metodoPago as keyof typeof MetodoPagoLabels]}
                        </span>
                        <br />
                        <span className="text-xs text-[#9A8C61]">
                          {MetodoEnvioLabels[pedido.metodoEnvio as keyof typeof MetodoEnvioLabels]}
                        </span>
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
                            // TODO: Implementar editar estado
                            showNotification('success', 'Cambiar estado próximamente disponible');
                          }}
                          className="hover:bg-[#F5E6C6]/30"
                        >
                          <Edit className="h-4 w-4" />
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

export default PedidosAdminPage;
