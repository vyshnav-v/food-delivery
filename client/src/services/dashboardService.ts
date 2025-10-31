import axios from "../utils/axios";
import type { ApiResponse } from "../types";

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: {
    pending: number;
    confirmed: number;
    delivered: number;
    cancelled: number;
  };
  recentOrders: Array<{
    _id: string;
    user: {
      name: string;
      email: string;
    };
    totalAmount: number;
    status: string;
    orderDate: string;
    createdAt: string;
  }>;
}

export const dashboardService = {
  async getStats(): Promise<ApiResponse<DashboardStats>> {
    const response = await axios.get("/dashboard/stats");
    return response.data;
  },
};
