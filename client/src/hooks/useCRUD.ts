import React, { useState } from "react";
import toast from "react-hot-toast";

type MessageResolver =
  | string
  | ((error: unknown) => string | void)
  | null
  | undefined;

interface UseCRUDOptions<T> {
  createFn?: (data: Partial<T>) => Promise<any>;
  updateFn?: (id: string, data: Partial<T>) => Promise<any>;
  deleteFn?: (id: string) => Promise<any>;
  onSuccess?: () => void;
  messages?: {
    createSuccess?: string;
    updateSuccess?: string;
    deleteSuccess?: string;
    createError?: MessageResolver;
    updateError?: MessageResolver;
    deleteError?: MessageResolver;
  };
  confirmDelete?: boolean;
}

/**
 * Custom hook for handling CRUD operations with toast notifications
 * @template T - Type of entity being managed
 */
export function useCRUD<T>({
  createFn,
  updateFn,
  deleteFn,
  onSuccess,
  messages = {},
  confirmDelete = true,
}: UseCRUDOptions<T>) {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleErrorToast = (
    resolver: MessageResolver,
    fallback: string,
    error: unknown
  ) => {
    if (resolver === null) return;
    if (typeof resolver === "function") {
      const message = resolver(error);
      if (message) {
        toast.error(message);
      }
      return;
    }
    if (typeof resolver === "string" && resolver.trim().length > 0) {
      toast.error(resolver);
      return;
    }
    if (resolver === undefined) {
      toast.error(fallback);
    }
  };

  // Use ref to store latest onSuccess callback to prevent infinite loops
  const onSuccessRef = React.useRef(onSuccess);
  React.useEffect(() => {
    onSuccessRef.current = onSuccess;
  });

  const create = async (data: Partial<T>) => {
    if (!createFn) return;
    setIsCreating(true);
    try {
      const result = await createFn(data);
      toast.success(messages.createSuccess || "Created successfully!");
      onSuccessRef.current?.();
      return result;
    } catch (error) {
      console.error("Create error:", error);
      handleErrorToast(messages.createError, "Failed to create", error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const update = async (id: string, data: Partial<T>) => {
    if (!updateFn) return;
    setIsUpdating(true);
    try {
      const result = await updateFn(id, data);
      toast.success(messages.updateSuccess || "Updated successfully!");
      onSuccessRef.current?.();
      return result;
    } catch (error) {
      console.error("Update error:", error);
      handleErrorToast(messages.updateError, "Failed to update", error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const remove = async (id: string) => {
    if (!deleteFn) return;
    if (confirmDelete && !confirm("Are you sure you want to delete this item?"))
      return;

    setIsDeleting(true);
    try {
      await deleteFn(id);
      toast.success(messages.deleteSuccess || "Deleted successfully!");
      onSuccessRef.current?.();
    } catch (error) {
      console.error("Delete error:", error);
      handleErrorToast(messages.deleteError, "Failed to delete", error);
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    create,
    update,
    remove,
    isCreating,
    isUpdating,
    isDeleting,
    isLoading: isCreating || isUpdating || isDeleting,
  };
}
