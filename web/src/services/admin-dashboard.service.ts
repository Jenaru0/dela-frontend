import { authService } from './auth.service';

export interface DashboardStats {
  usuarios: {
    total: number;
    clientes: number;
    admins: number;
    nuevosHoy: number;
    nuevosEstaSemana: number;
  };
  productos: {
    total: number;
    activos: number;
    agotados: number;
    destacados: number;
    sinStock: number;
  };
  pedidos: {
    total: number;
    pendientes: number;
    completados: number;
    ventasHoy: number;
    ventasEstaSemana: number;
    ingresosTotales: number;
  };
  reclamos: {
    total: number;
    pendientes: number;
    resueltos: number;
    nuevosHoy: number;
  };
}

export interface QuickStatsResponse {
  mensaje: string;
  data: DashboardStats;
}

class AdminDashboardService {
  private readonly baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  private getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authService.getToken()}`,
    };
  }

  async getDashboardStats(): Promise<QuickStatsResponse> {
    const response = await fetch(`${this.baseUrl}/dashboard/stats`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener estadísticas del dashboard');
    }

    return response.json();
  }

  async getRecentActivity() {
    const response = await fetch(`${this.baseUrl}/dashboard/activity`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener actividad reciente');
    }

    return response.json();
  }

  // Obtener alertas críticas
  async getCriticalAlerts() {
    const response = await fetch(`${this.baseUrl}/dashboard/alerts`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener alertas críticas');
    }

    return response.json();
  }

  // Obtener resumen de ventas
  async getSalesOverview(period: 'day' | 'week' | 'month' = 'week') {
    const response = await fetch(`${this.baseUrl}/dashboard/sales?period=${period}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener resumen de ventas');
    }

    return response.json();
  }
}

export const adminDashboardService = new AdminDashboardService();
