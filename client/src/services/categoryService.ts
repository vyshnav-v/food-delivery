import axios from "../utils/axios";
import type { Category, CreateCategoryInput, ApiResponse } from "../types";

export const categoryService = {
  async getCategories(): Promise<ApiResponse<Category[]>> {
    const response = await axios.get("/categories");
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
