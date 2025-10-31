export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  mobile?: string;
  role: "customer" | "admin";
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  mobile?: string;
  password: string;
  role?: "customer" | "admin";
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  pagination?: PaginationMeta;
  message?: string;
  error?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: Category | string;
  imageUrl?: string;
  stock: number;
  status: "available" | "unavailable" | "out-of-stock";
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product:
    | {
        _id: string;
        name: string;
        price: number;
        imageUrl?: string;
      }
    | string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  user:
    | {
        _id: string;
        name: string;
        email: string;
        mobile?: string;
      }
    | string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "confirmed" | "delivered" | "cancelled";
  orderDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderInput {
  userId?: string;
  items: {
    product: string;
    quantity: number;
  }[];
}

export interface Notification {
  _id: string;
  user: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
  updatedAt: string;
}
