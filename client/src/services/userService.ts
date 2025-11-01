import axios from "../utils/axios";
import type { User, ApiResponse } from "../types";

type UserQuery = {
  search?: string;
  role?: string;
  sort?: string;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
};

const sanitizeParams = (params?: UserQuery) => {
  if (!params) return undefined;
  const query: Record<string, unknown> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query[key] = value;
    }
  });
  return query;
};

export const userService = {
  async getUsers(params?: UserQuery): Promise<ApiResponse<User[]>> {
    const response = await axios.get("/users", {
      params: sanitizeParams(params),
    });
    return response.data;
  },

  async getUser(id: string): Promise<ApiResponse<User>> {
    const response = await axios.get(`/users/${id}`);
    return response.data;
  },

  async createUser(user: {
    name: string;
    email: string;
    mobile?: string;
    password: string;
    role?: "admin" | "customer";
  }): Promise<ApiResponse<User>> {
    const response = await axios.post("/users", user);
    return response.data;
  },

  async updateUser(
    id: string,
    user: {
      name?: string;
      email?: string;
      mobile?: string;
      role?: "admin" | "customer";
    }
  ): Promise<ApiResponse<User>> {
    const response = await axios.put(`/users/${id}`, user);
    return response.data;
  },

  async deleteUser(id: string): Promise<ApiResponse<null>> {
    const response = await axios.delete(`/users/${id}`);
    return response.data;
  },
};
