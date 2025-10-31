import axios from "../utils/axios";
import type { Order, CreateOrderInput, ApiResponse } from "../types";

export const orderService = {
  async getOrders(filters?: {
    status?: string;
    userId?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Order[]>> {
    const response = await axios.get("/orders", { params: filters });
    return response.data;
  },

  async getOrder(id: string): Promise<ApiResponse<Order>> {
    const response = await axios.get(`/orders/${id}`);
    return response.data;
  },

  async createOrder(order: CreateOrderInput): Promise<ApiResponse<Order>> {
    const response = await axios.post("/orders", order);
    return response.data;
  },

  async updateOrderStatus(
    id: string,
    status: "pending" | "confirmed" | "delivered" | "cancelled"
  ): Promise<ApiResponse<Order>> {
    const response = await axios.put(`/orders/${id}/status`, { status });
    return response.data;
  },

  async deleteOrder(id: string): Promise<ApiResponse<null>> {
    const response = await axios.delete(`/orders/${id}`);
    return response.data;
  },
};
