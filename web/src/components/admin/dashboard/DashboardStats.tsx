'use client';

import React, { useState, useEffect } from 'react';
import { Users, ShoppingBag, Package, MessageSquare, AlertTriangle, TrendingUp } from 'lucide-react';
import { adminDashboardService, DashboardStats as StatsData } from '@/services/admin-dashboard.service';

const DashboardStats: React.FC = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await adminDashboardService.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      // Fallback a datos vacíos en caso de error
      setStats({
        usuarios: { total: 0, clientes: 0, admins: 0, nuevosHoy: 0, nuevosEstaSemana: 0 },
        productos: { total: 0, activos: 0, agotados: 0, destacados: 0, sinStock: 0 },
        pedidos: { total: 0, pendientes: 0, completados: 0, ventasHoy: 0, ventasEstaSemana: 0, ingresosTotales: 0 },
        reclamos: { total: 0, pendientes: 0, resueltos: 0, nuevosHoy: 0 },
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30 animate-pulse"
          >
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

  if (!stats) return null;

  const statsCards = [
    {
      title: 'Total Usuarios',
      value: stats.usuarios.total,
      subtitle: `${stats.usuarios.nuevosHoy} nuevos hoy`,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Clientes',
      value: stats.usuarios.clientes,
      subtitle: `${stats.usuarios.nuevosEstaSemana} esta semana`,
      icon: Users,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Productos Activos',
      value: stats.productos.activos,
      subtitle: `${stats.productos.sinStock} sin stock`,
      icon: ShoppingBag,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
    },
    {
      title: 'Productos Total',
      value: stats.productos.total,
      subtitle: `${stats.productos.destacados} destacados`,
      icon: Package,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'Pedidos Total',
      value: stats.pedidos.total,
      subtitle: `${stats.pedidos.ventasHoy} hoy`,
      icon: Package,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
    },
    {
      title: 'Pedidos Pendientes',
      value: stats.pedidos.pendientes,
      subtitle: 'Requieren atención',
      icon: AlertTriangle,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
    {
      title: 'Ingresos Totales',
      value: `S/ ${stats.pedidos.ingresosTotales.toLocaleString()}`,
      subtitle: `${stats.pedidos.completados} completados`,
      icon: TrendingUp,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      title: 'Reclamos',
      value: stats.reclamos.total,
      subtitle: `${stats.reclamos.pendientes} pendientes`,
      icon: MessageSquare,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center">
              <div
                className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}
              >
                <Icon className={`w-6 h-6 ${card.textColor}`} />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-[#9A8C61]">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-[#3A3A3A]">
                  {typeof card.value === 'string' ? card.value : card.value.toLocaleString()}
                </p>
                {card.subtitle && (
                  <p className="text-xs text-[#9A8C61] mt-1">
                    {card.subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
