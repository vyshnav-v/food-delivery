import axios from "../utils/axios";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "../types";

export const authService = {
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await axios.post("/auth/register", credentials);
    return response.data;
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axios.post("/auth/login", credentials);
    return response.data;
  },

  async getMe(): Promise<{ success: boolean; data: { user: User } }> {
    const response = await axios.get("/auth/me");
    return response.data;
  },

  async updateProfile(data: {
    name?: string;
    email?: string;
    mobile?: string;
    password?: string;
  }): Promise<{ success: boolean; data: User }> {
    const response = await axios.put("/auth/profile", data);
    return response.data;
  },

  async logout(): Promise<void> {
    await axios.post("/auth/logout");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};
