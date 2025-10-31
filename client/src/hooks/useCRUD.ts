import React, { useState } from "react";
import toast from "react-hot-toast";

interface UseCRUDOptions<T> {
  createFn?: (data: Partial<T>) => Promise<any>;
  updateFn?: (id: string, data: Partial<T>) => Promise<any>;
  deleteFn?: (id: string) => Promise<any>;
  onSuccess?: () => void;
  messages?: {
    createSuccess?: string;
    updateSuccess?: string;
    deleteSuccess?: string;
    createError?: string;
    updateError?: string;
    deleteError?: string;
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
      toast.error(messages.createError || "Failed to create");
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
      toast.error(messages.updateError || "Failed to update");
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
      toast.error(messages.deleteError || "Failed to delete");
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
