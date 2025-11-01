import axios from "../utils/axios";
import type { Category, CreateCategoryInput, ApiResponse } from "../types";

type CategoryQuery = {
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  includeProductCount?: boolean;
};

const sanitizeParams = (params?: CategoryQuery) => {
  if (!params) return undefined;
  const query: Record<string, unknown> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query[key] = value;
    }
  });
  return query;
};

export const categoryService = {
  async getCategories(
    params?: CategoryQuery
  ): Promise<ApiResponse<Category[]>> {
    const response = await axios.get("/categories", {
      params: sanitizeParams(params),
    });
    return response.data;
  },

  async getCategory(id: string): Promise<ApiResponse<Category>> {
    const response = await axios.get(`/categories/${id}`);
    return response.data;
  },

  async createCategory(
    category: CreateCategoryInput
  ): Promise<ApiResponse<Category>> {
    const response = await axios.post("/categories", category);
    return response.data;
  },

  async updateCategory(
    id: string,
    category: CreateCategoryInput
  ): Promise<ApiResponse<Category>> {
    const response = await axios.put(`/categories/${id}`, category);
    return response.data;
  },

  async deleteCategory(id: string): Promise<ApiResponse<null>> {
    const response = await axios.delete(`/categories/${id}`);
    return response.data;
  },
};
