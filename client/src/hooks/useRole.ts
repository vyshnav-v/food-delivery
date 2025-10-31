import { useAuthStore } from "../stores/authStore";

export const useRole = () => {
  const { user } = useAuthStore();

  const isAdmin = user?.role === "admin";
  const isCustomer = user?.role === "customer";

  const hasRole = (...roles: string[]) => {
    return user?.role && roles.includes(user.role);
  };

  return {
    isAdmin,
    isCustomer,
    hasRole,
    currentRole: user?.role,
  };
};
