'use client';

import React, { useState, useEffect } from 'react';
import { Users, ShoppingBag, Package, MessageSquare } from 'lucide-react';
import { usuariosService } from '@/services/usuarios.service';

interface StatsData {
  totalUsuarios: number;
  usuariosClientes: number;
  usuariosAdmin: number;
  // Agregar más cuando tengamos los servicios
}

const DashboardStats: React.FC = () => {
  const [stats, setStats] = useState<StatsData>({
    totalUsuarios: 0,
    usuariosClientes: 0,
    usuariosAdmin: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const usuariosResponse = await usuariosService.obtenerTodos();
      const usuarios = usuariosResponse.data;
      
      setStats({
        totalUsuarios: usuarios.length,
        usuariosClientes: usuarios.filter(u => u.tipoUsuario === 'CLIENTE').length,
        usuariosAdmin: usuarios.filter(u => u.tipoUsuario === 'ADMIN').length,
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Usuarios',
      value: stats.totalUsuarios,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Clientes',
      value: stats.usuariosClientes,
      icon: Users,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Administradores',
      value: stats.usuariosAdmin,
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Productos',
      value: 0, // TODO: Implementar cuando tengamos el servicio
      icon: ShoppingBag,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Pedidos',
      value: 0, // TODO: Implementar cuando tengamos el servicio
      icon: Package,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Reclamos',
      value: 0, // TODO: Implementar cuando tengamos el servicio
      icon: MessageSquare,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30 animate-pulse">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="ml-4 flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statsCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center">
              <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${card.textColor}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[#9A8C61]">{card.title}</p>
                <p className="text-2xl font-bold text-[#3A3A3A]">{card.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
