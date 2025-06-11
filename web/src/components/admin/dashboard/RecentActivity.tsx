'use client';

import React, { useState, useEffect } from 'react';
import { Clock, User, ShoppingBag, AlertTriangle } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'user' | 'order' | 'product' | 'complaint';
  title: string;
  description: string;
  timestamp: Date;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const RecentActivity: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulamos actividad reciente por ahora
    // TODO: Implementar cuando tengamos los servicios reales
    const mockActivities: ActivityItem[] = [
      {
        id: '1',
        type: 'user',
        title: 'Nuevo usuario registrado',
        description: 'Juan Pérez se registró en la plataforma',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
        icon: User,
        color: 'text-blue-600'
      },
      {
        id: '2',
        type: 'order',
        title: 'Nuevo pedido realizado',
        description: 'Pedido #1234 por S/ 150.00',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        icon: ShoppingBag,
        color: 'text-green-600'
      },
      {
        id: '3',
        type: 'complaint',
        title: 'Nuevo reclamo recibido',
        description: 'Reclamo sobre producto defectuoso',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        icon: AlertTriangle,
        color: 'text-red-600'
      },
      {
        id: '4',
        type: 'product',
        title: 'Producto actualizado',
        description: 'Aceite de oliva - Stock actualizado',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        icon: ShoppingBag,
        color: 'text-yellow-600'
      }
    ];

    setTimeout(() => {
      setActivities(mockActivities);
      setLoading(false);
    }, 1000);
  }, []);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `hace ${diffInMinutes} min`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `hace ${hours} hora${hours > 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `hace ${days} día${days > 1 ? 's' : ''}`;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
        <h3 className="text-lg font-semibold text-[#3A3A3A] mb-4">Actividad Reciente</h3>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#3A3A3A]">Actividad Reciente</h3>
        <Clock className="w-5 h-5 text-[#9A8C61]" />
      </div>
      
      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-[#9A8C61] text-center py-8">No hay actividad reciente</p>
        ) : (
          activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-[#F5E6C6]/20 transition-colors">
                <div className="w-10 h-10 bg-[#F5E6C6]/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon className={`w-5 h-5 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#3A3A3A] truncate">
                    {activity.title}
                  </p>
                  <p className="text-sm text-[#9A8C61] truncate">
                    {activity.description}
                  </p>
                </div>
                <div className="text-xs text-[#9A8C61] flex-shrink-0">
                  {formatTimeAgo(activity.timestamp)}
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {activities.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[#ecd8ab]/30">
          <button className="text-sm text-[#CC9F53] hover:text-[#b08a3c] font-medium transition-colors">
            Ver todas las actividades →
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
