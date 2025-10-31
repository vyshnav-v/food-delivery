import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types";
import { authService } from "../services/authService";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login({ email, password });
          const { token, user } = response.data;
          localStorage.setItem("token", token);
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (error) {
          const errorMessage =
            (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message || "Login failed";
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register({
            name,
            email,
            password,
          });
          const { token, user } = response.data;
          localStorage.setItem("token", token);
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (error) {
          const errorMessage =
            (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message || "Registration failed";
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem("token");
        set({ user: null, token: null, isAuthenticated: false });
      },

      checkAuth: async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          set({ isAuthenticated: false, user: null, token: null });
          return;
        }

        set({ isLoading: true });
        try {
          const response = await authService.getMe();
          set({
            user: response.data.user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error("Auth check failed:", error);
          localStorage.removeItem("token");
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // After hydration, check if we have a token
        if (state?.token) {
          console.log("✅ Auth state hydrated from localStorage");
        }
      },
    }
  )
);
