import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import type { ApiResponse } from "../types";

interface UseFetchOptions<T> {
  fetchFn: () => Promise<ApiResponse<T>>;
  dependencies?: any[];
  onSuccess?: (data: T, count?: number, response?: ApiResponse<T>) => void;
  onError?: (error: any) => void;
  showErrorToast?: boolean;
  enabled?: boolean;
}

/**
 * Custom hook for data fetching with loading/error states
 * @template T - Type of data being fetched
 */
export function useFetch<T>({
  fetchFn,
  dependencies = [],
  onSuccess,
  onError,
  showErrorToast = true,
  enabled = true,
}: UseFetchOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Use refs to store the latest functions without causing re-renders
  const fetchFnRef = React.useRef(fetchFn);
  const onSuccessRef = React.useRef(onSuccess);
  const onErrorRef = React.useRef(onError);

  React.useEffect(() => {
    fetchFnRef.current = fetchFn;
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  });

  const refetch = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchFnRef.current();
      if (response.data) {
        setData(response.data);
        onSuccessRef.current?.(response.data, response.count, response);
      }
    } catch (err) {
      const error = err as Error;
      setError(error);
      if (showErrorToast) {
        toast.error("Failed to load data");
      }
      onErrorRef.current?.(error);
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [enabled, showErrorToast]);

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies]);

  return { data, isLoading, error, refetch };
}
