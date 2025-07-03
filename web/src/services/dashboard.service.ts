import { authService } from './auth.service';

export interface ActivityItem {
  id: string;
  type: 'user' | 'order' | 'product' | 'complaint';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  color: string;
}

class DashboardService {
  private readonly baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  async getRecentActivity(): Promise<{ data: ActivityItem[] }> {
    const response = await fetch(`${this.baseUrl}/dashboard/activity`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authService.getToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener actividad reciente');
    }

    return response.json();
  }
}

export const dashboardService = new DashboardService();
