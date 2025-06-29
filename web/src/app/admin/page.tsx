'use client';

import React from 'react';
import DashboardStats from '@/components/admin/dashboard/DashboardStats';
import RecentActivity from '@/components/admin/dashboard/RecentActivity';
import QuickActions from '@/components/admin/dashboard/QuickActions';

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#3A3A3A] mb-2">
          Panel de Administración
        </h1>
        <p className="text-[#9A8C61]">
          Bienvenido al centro de control de Dela Platform
        </p>
      </div>

      {/* Stats Grid */}
      <DashboardStats />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>

        {/* Quick Actions - Takes 1 column */}
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
