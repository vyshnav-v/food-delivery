import axios from "../utils/axios";
import type { Product, ApiResponse } from "../types";

export const productService = {
  async getProducts(filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<ApiResponse<Product[]>> {
    const response = await axios.get("/products", { params: filters });
    return response.data;
  },

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    const response = await axios.get(`/products/${id}`);
    return response.data;
  },

  async createProduct(
    product: FormData | Partial<Product>
  ): Promise<ApiResponse<Product>> {
    const isFormData =
      typeof FormData !== "undefined" && product instanceof FormData;
    const response = await axios.post("/products", product, {
      headers: isFormData
        ? { "Content-Type": "multipart/form-data" }
        : undefined,
    });
    return response.data;
  },

  async updateProduct(
    id: string,
    product: FormData | Partial<Product>
  ): Promise<ApiResponse<Product>> {
    const isFormData =
      typeof FormData !== "undefined" && product instanceof FormData;
    const response = await axios.put(`/products/${id}`, product, {
      headers: isFormData
        ? { "Content-Type": "multipart/form-data" }
        : undefined,
    });
    return response.data;
  },

  async uploadProductImage(
    id: string,
    file: File
  ): Promise<ApiResponse<Product>> {
    const formData = new FormData();
    formData.append("image", file);

    const response = await axios.post(
      `/products/${id}/upload-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  async deleteProduct(id: string): Promise<ApiResponse<null>> {
    const response = await axios.delete(`/products/${id}`);
    return response.data;
  },
};
