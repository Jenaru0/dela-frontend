'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, MessageSquare, Clock, Package, ChevronRight } from 'lucide-react';
import { adminDashboardService } from '@/services/admin-dashboard.service';
import { useRouter } from 'next/navigation';

interface Alert {
  id: string;
  type: string;
  title: string;
  description: string;
  action?: string;
  icon: string;
  color: string;
}

const CriticalAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const response = await adminDashboardService.getCriticalAlerts();
      setAlerts(response.data);
    } catch (error) {
      console.error('Error al cargar alertas críticas:', error);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'AlertTriangle':
        return AlertTriangle;
      case 'MessageSquare':
        return MessageSquare;
      case 'Clock':
        return Clock;
      case 'Package':
        return Package;
      default:
        return AlertTriangle;
    }
  };

  const getAlertTypeStyles = (type: string) => {
    switch (type) {
      case 'critical':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconBg: 'bg-red-100',
          textColor: 'text-red-800',
        };
      case 'warning':
        return {
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          iconBg: 'bg-yellow-100',
          textColor: 'text-yellow-800',
        };
      default:
        return {
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          iconBg: 'bg-gray-100',
          textColor: 'text-gray-800',
        };
    }
  };

  const handleAlertClick = (alert: Alert) => {
    if (alert.action) {
      router.push(alert.action);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
        <h3 className="text-lg font-semibold text-[#3A3A3A] mb-4">Alertas Críticas</h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#3A3A3A]">Alertas Críticas</h3>
        <AlertTriangle className="w-5 h-5 text-[#9A8C61]" />
      </div>
      
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Package className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-[#9A8C61]">¡Todo está funcionando correctamente!</p>
            <p className="text-sm text-[#9A8C61] mt-1">No hay alertas críticas en este momento</p>
          </div>
        ) : (
          alerts.map((alert) => {
            const Icon = getIconComponent(alert.icon);
            const styles = getAlertTypeStyles(alert.type);
            
            return (
              <div 
                key={alert.id} 
                className={`flex items-start space-x-3 p-3 rounded-lg border ${styles.bgColor} ${styles.borderColor} hover:shadow-sm transition-all duration-200 ${alert.action ? 'cursor-pointer' : ''}`}
                onClick={() => handleAlertClick(alert)}
              >
                <div className={`w-10 h-10 ${styles.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${alert.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${styles.textColor} truncate`}>
                    {alert.title}
                  </p>
                  <p className="text-xs text-[#9A8C61] mt-1">
                    {alert.description}
                  </p>
                </div>
                {alert.action && (
                  <ChevronRight className="w-4 h-4 text-[#9A8C61] flex-shrink-0" />
                )}
              </div>
            );
          })
        )}
      </div>
      
      {alerts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[#ecd8ab]/30">
          <button 
            onClick={loadAlerts}
            className="w-full text-sm text-[#CC9F53] hover:text-[#b08a3c] font-medium transition-colors"
          >
            Actualizar alertas
          </button>
        </div>
      )}
    </div>
  );
};

export default CriticalAlerts;
