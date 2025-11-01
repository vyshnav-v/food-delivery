import axios from "../utils/axios";
import type {
  Order,
  CreateOrderInput,
  ApiResponse,
  User,
  Product,
} from "../types";

export const orderService = {
  async getOrders(filters?: {
    status?: string;
    userId?: string;
    page?: number;
    limit?: number;
    sort?: string;
    order?: "asc" | "desc";
    search?: string;
  }): Promise<ApiResponse<Order[]>> {
    const params = Object.fromEntries(
      Object.entries(filters || {}).filter(
        ([, value]) => value !== undefined && value !== ""
      )
    );

    const response = await axios.get("/orders", { params });
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
    const response = await axios.put(`/orders/${id}`, { status });
    return response.data;
  },

  async deleteOrder(id: string): Promise<ApiResponse<null>> {
    const response = await axios.delete(`/orders/${id}`);
    return response.data;
  },

  async fetchUsers(): Promise<ApiResponse<User[]>> {
    const response = await axios.get("/users", { params: { limit: 1000 } });
    return response.data;
  },

  async fetchProducts(): Promise<ApiResponse<Product[]>> {
    const response = await axios.get("/products", { params: { limit: 1000 } });
    return response.data;
  },
};
