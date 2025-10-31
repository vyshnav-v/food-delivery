import React from "react";
import { Plus, Edit, Trash2, Package, Grid as GridIcon } from "lucide-react";
import toast from "react-hot-toast";
import { categoryService } from "../services/categoryService";
import { productService } from "../services/productService";
import Modal from "../components/Modal";
import LoadingSkeleton from "../components/LoadingSkeleton";
import EmptyState from "../components/EmptyState";
import { useFetch, useCRUD, useModal } from "../hooks";
import { useRole } from "../hooks/useRole";
import type { Category } from "../types";

const Categories = () => {
  const modal = useModal<Category>();
  const { isAdmin } = useRole();

  const {
    data: categories,
    isLoading,
    refetch,
  } = useFetch<Category[]>({
    fetchFn: categoryService.getCategories,
    dependencies: [],
  });

  const crud = useCRUD<Category>({
    createFn: categoryService.createCategory as any,
    updateFn: categoryService.updateCategory as any,
    deleteFn: categoryService.deleteCategory,
    onSuccess: refetch,
    messages: {
      createSuccess: "Category created successfully!",
      updateSuccess: "Category updated successfully!",
      deleteSuccess: "Category deleted successfully!",
    },
  });

  const handleOpenCategoryModal = (category?: Category) => {
    modal.open(category);
  };

  const handleSubmit = async (e: React.FormEvent, formData: any) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error("Please enter a category name");
      return;
    }

    const categoryData = {
      name: formData.name,
      description: formData.description,
    };

    if (modal.editingItem) {
      await crud.update(modal.editingItem._id, categoryData);
    } else {
      await crud.create(categoryData);
    }
    modal.close();
  };

  const handleDelete = async (categoryId: string) => {
    // Check if category has products
    try {
      const productsResponse = await productService.getProducts({
        category: categoryId,
      });

      if (productsResponse.data && productsResponse.data.length > 0) {
        toast.error(
          `Cannot delete category with ${productsResponse.data.length} product(s). Please remove or reassign products first.`
        );
        return;
      }

      await crud.remove(categoryId);
    } catch (error) {
      console.error("Error checking category products:", error);
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-2">
            Manage food categories
            {categories && ` (${categories.length} categories)`}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => handleOpenCategoryModal()}
            className="btn-primary"
          >
            <Plus size={20} className="inline mr-2" />
            New Category
          </button>
        )}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          <LoadingSkeleton count={8} type="card" />
        ) : !categories || categories.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              icon={GridIcon}
              title="No categories found"
              description="Add your first category to get started"
              action={
                isAdmin
                  ? {
                      label: "Add Category",
                      onClick: () => handleOpenCategoryModal(),
                    }
                  : undefined
              }
            />
          </div>
        ) : (
          categories.map((category) => (
            <div key={category._id} className="card-hover relative group">
              {/* Category Icon */}
              <div className="flex items-center justify-center h-24 bg-linear-to-br from-primary-100 to-primary-200 rounded-lg mb-4">
                <Package size={48} className="text-primary-600" />
              </div>

              {/* Category Details */}
              <div className="space-y-2">
                <h3 className="font-bold text-lg text-gray-900">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {category.description}
                  </p>
                )}
              </div>

              {/* Action Buttons (shown on hover) - Admin only */}
              {isAdmin && (
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenCategoryModal(category)}
                    className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
                    title="Edit category"
                  >
                    <Edit size={16} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="p-2 bg-white rounded-lg shadow-lg hover:bg-red-50 transition-colors"
                    title="Delete category"
                    disabled={crud.isDeleting}
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Category Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        title={modal.isEditing ? "Edit Category" : "Add New Category"}
        size="md"
      >
        <CategoryFormWrapper
          category={modal.editingItem}
          onSubmit={handleSubmit}
          onCancel={modal.close}
          isSubmitting={crud.isLoading}
        />
      </Modal>
    </div>
  );
};

// Category Form Wrapper
const CategoryFormWrapper = ({
  category,
  onSubmit,
  onCancel,
  isSubmitting,
}: {
  category: Category | null;
  onSubmit: (e: React.FormEvent, formData: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}) => {
  const [formData, setFormData] = React.useState({
    name: category?.name || "",
    description: category?.description || "",
  });

  React.useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || "",
      });
    }
  }, [category]);

  const handleFormChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <form onSubmit={(e) => onSubmit(e, formData)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleFormChange("name", e.target.value)}
          className="input-field"
          placeholder="e.g., Pizza, Burgers, Salads"
          disabled={isSubmitting}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleFormChange("description", e.target.value)}
          className="input-field"
          rows={3}
          placeholder="Describe this category..."
          disabled={isSubmitting}
        />
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary flex-1"
        >
          {isSubmitting
            ? category
              ? "Updating..."
              : "Creating..."
            : category
              ? "Update Category"
              : "Create Category"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default Categories;
