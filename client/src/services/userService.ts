import axios from "../utils/axios";
import type { User, ApiResponse } from "../types";

export const userService = {
  async getUsers(): Promise<ApiResponse<User[]>> {
    const response = await axios.get("/users");
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
