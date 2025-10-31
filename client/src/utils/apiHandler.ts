import { AxiosError } from "axios";
import toast from "react-hot-toast";

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

/**
 * Handles API errors and extracts meaningful error information
 */
export function handleApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message || error.message;
    return {
      message,
      code: error.code,
      field: error.response?.data?.field,
    };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: "An unknown error occurred" };
}

/**
 * Wraps an async function with error handling and toast notifications
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  errorMessage?: string
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    const apiError = handleApiError(error);
    toast.error(errorMessage || apiError.message);
    console.error("API Error:", apiError);
    return null;
  }
}

/**
 * Validates if a response contains data
 */
export function hasData<T>(response: { data?: T }): response is { data: T } {
  return response.data !== undefined && response.data !== null;
}
