import { useState } from "react";

/**
 * Custom hook for managing modal state and editing entity
 * @template T - Type of the entity being edited
 */
export function useModal<T = any>() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);

  const open = (item?: T) => {
    if (item) {
      setEditingItem(item);
    }
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setEditingItem(null);
  };

  return {
    isOpen,
    editingItem,
    open,
    close,
    isEditing: !!editingItem,
  };
}
