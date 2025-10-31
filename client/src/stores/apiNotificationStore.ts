import { create } from "zustand";
import axios from "../utils/axios";
import type { Notification } from "../types";

interface ApiNotificationState {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  addNotification: (notification: Notification) => void;
}

export const useApiNotificationStore = create<ApiNotificationState>((set) => ({
  notifications: [],
  isLoading: false,
  error: null,

  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get("/notifications");
      set({ notifications: response.data.data || [], isLoading: false });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      set({ error: "Failed to fetch notifications", isLoading: false });
    }
  },

  markAsRead: async (id) => {
    try {
      await axios.put(`/notifications/${id}/read`);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === id ? { ...n, read: true } : n
        ),
      }));
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  },

  deleteNotification: async (id) => {
    try {
      await axios.delete(`/notifications/${id}`);
      set((state) => ({
        notifications: state.notifications.filter((n) => n._id !== id),
      }));
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
    }));
  },
}));
