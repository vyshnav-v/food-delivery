import React from "react";
import {
  Plus,
  Edit,
  Trash2,
  Package,
  Grid as GridIcon,
  SortAsc,
  Search,
  Filter,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

import { categoryService } from "../services/categoryService";
import { productService } from "../services/productService";
import Modal from "../components/Modal";
import LoadingSkeleton from "../components/LoadingSkeleton";
import EmptyState from "../components/EmptyState";
import Pagination from "../components/Pagination";
import { CategoryForm } from "../components/forms";
import { useFetch, useCRUD, useModal, usePagination } from "../hooks";
import { useRole } from "../hooks/useRole";
import type { Category } from "../types";

interface FiltersState {
  search: string;
  sort: string;
}

const areFiltersEqual = (a: FiltersState, b: FiltersState) =>
  a.search === b.search && a.sort === b.sort;

const Categories = () => {
  const modal = useModal<Category>();
  const { isAdmin } = useRole();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamsKey = React.useMemo(
    () => searchParams.toString(),
    [searchParams]
  );
  const skipNextUrlSync = React.useRef(false);

  const parseNumberParam = React.useCallback(
    (
      value: string | null,
      fallback: number,
      options: { min?: number; max?: number } = {}
    ) => {
      if (!value) return fallback;
      const parsed = parseInt(value, 10);
      if (Number.isNaN(parsed)) return fallback;
      const min = options.min ?? 1;
      const max = options.max;
      const clamped = Math.max(min, parsed);
      return typeof max === "number" ? Math.min(clamped, max) : clamped;
    },
    []
  );

  const initialPage = parseNumberParam(searchParams.get("page"), 1, { min: 1 });
  const initialLimit = parseNumberParam(searchParams.get("limit"), 8, {
    min: 1,
    max: 100,
  });

  const pagination = usePagination({ initialPage, pageSize: initialLimit });
  const { setCurrentPage: setPaginationCurrentPage } = pagination;

  const [filters, setFilters] = React.useState<FiltersState>(() => ({
    search: searchParams.get("search") || "",
    sort: searchParams.get("sort") || "-createdAt",
  }));
  const [deleteModal, setDeleteModal] = React.useState<{
    id: string;
    name: string;
  } | null>(null);

  const createDefaultFilters = React.useCallback<() => FiltersState>(
    () => ({
      search: "",
      sort: "-createdAt",
    }),
    []
  );

  const updateFilter = React.useCallback(
    (field: keyof FiltersState, value: string) => {
      let hasChanged = false;
      setFilters((prev) => {
        if (prev[field] === value) {
          return prev;
        }
        hasChanged = true;
        return { ...prev, [field]: value };
      });
      if (hasChanged) {
        setPaginationCurrentPage(1);
      }
    },
    [setPaginationCurrentPage]
  );

  React.useEffect(() => {
    if (skipNextUrlSync.current) {
      skipNextUrlSync.current = false;
      return;
    }

    const urlFilters: FiltersState = {
      search: searchParams.get("search") || "",
      sort: searchParams.get("sort") || "-createdAt",
    };

    setFilters((prev) =>
      areFiltersEqual(prev, urlFilters) ? prev : urlFilters
    );

    const pageFromUrl = parseNumberParam(searchParams.get("page"), 1, {
      min: 1,
    });
    setPaginationCurrentPage(pageFromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParamsKey]);

  React.useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", pagination.currentPage.toString());
    params.set("limit", pagination.pageSize.toString());
    if (filters.sort) params.set("sort", filters.sort);
    if (filters.search) params.set("search", filters.search);

    const newParams = params.toString();
    if (newParams !== searchParamsKey) {
      skipNextUrlSync.current = true;
      setSearchParams(params, { replace: true });
    }
  }, [
    filters.search,
    filters.sort,
    pagination.currentPage,
    pagination.pageSize,
    searchParamsKey,
    setSearchParams,
  ]);

  const {
    data: categories,
    isLoading,
    refetch,
  } = useFetch<Category[]>({
    fetchFn: () => {
      const sortValue = filters.sort;
      const sortField = sortValue.startsWith("-")
        ? sortValue.substring(1)
        : sortValue;
      const order = sortValue.startsWith("-") ? "desc" : "asc";

      return categoryService.getCategories({
        page: pagination.currentPage,
        limit: pagination.pageSize,
        sort: sortField,
        order,
        search: filters.search || undefined,
        includeProductCount: true,
      });
    },
    onSuccess: (data, count, response) => {
      if (!Array.isArray(data)) return;

      const totalFromResponse =
        response?.pagination?.total ??
        count ??
        (pagination.currentPage - 1) * pagination.pageSize + data.length;

      pagination.updateTotalCount(totalFromResponse);

      const totalPages = response?.pagination?.totalPages;
      if (totalPages) {
        pagination.setTotalPages(totalPages);
      } else {
        pagination.setTotalPages(
          Math.max(1, Math.ceil(totalFromResponse / pagination.pageSize))
        );
      }
    },
    dependencies: [
      pagination.currentPage,
      pagination.pageSize,
      filters.search,
      filters.sort,
    ],
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
    confirmDelete: false,
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

  const deleteCategory = async (categoryId: string) => {
    try {
      const productsResponse = await productService.getProducts({
        category: categoryId,
        limit: 1,
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

  const handleRequestDelete = (category: Category) => {
    if (!category._id) return;
    setDeleteModal({ id: category._id, name: category.name });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal) return;
    try {
      await deleteCategory(deleteModal.id);
      setDeleteModal(null);
    } catch (error) {
      console.error("Delete category error", error);
    }
  };

  const sortOptions = [
    { value: "-createdAt", label: "Newest First" },
    { value: "createdAt", label: "Oldest First" },
    { value: "name", label: "Name (A-Z)" },
    { value: "-name", label: "Name (Z-A)" },
  ];

  const activeFilters = filters.search || filters.sort !== "-createdAt";

  const clearAllFilters = () => {
    setFilters(createDefaultFilters());
    setPaginationCurrentPage(1);
  };

  const totalCategories = pagination.totalCount || categories?.length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-2">
            Manage food categories
            {` (${totalCategories} item${totalCategories === 1 ? "" : "s"})`}
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

      {/* Filters & Sort Bar */}
      <div className="card">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-sm">
            <SortAsc size={20} className="text-gray-400" />
            <select
              value={filters.sort}
              onChange={(e) => updateFilter("sort", e.target.value)}
              className="input-field flex-1"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              placeholder="Search categories..."
              className="input-field pl-10"
            />
          </div>

          {activeFilters && (
            <button
              onClick={clearAllFilters}
              className="btn-secondary flex items-center gap-2"
            >
              <Filter size={18} />
              Clear
            </button>
          )}
        </div>
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
              description={
                activeFilters
                  ? "Try adjusting your filters"
                  : "Add your first category to get started"
              }
              action={
                isAdmin && !activeFilters
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
              <div className="flex items-center justify-center h-24 bg-linear-to-br from-primary-100 to-primary-200 rounded-lg mb-4">
                <Package size={48} className="text-primary-600" />
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-lg text-gray-900">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {category.description}
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  Products: {category.productCount ?? 0}
                </p>
              </div>

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
                    onClick={() => handleRequestDelete(category)}
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

      {/* Pagination */}
      {!isLoading && pagination.totalPages > 1 && (
        <Pagination
          total={pagination.totalCount || 0}
          currentPage={pagination.currentPage}
          pageSize={pagination.pageSize}
          onChange={pagination.goToPage}
          displayTotal
        />
      )}

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

      <Modal
        isOpen={Boolean(deleteModal)}
        onClose={() => setDeleteModal(null)}
        title="Delete Category"
        size="sm"
      >
        {deleteModal && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete
              <span className="font-semibold"> {deleteModal.name}</span>? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteModal(null)}
                className="btn-secondary"
                disabled={crud.isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="btn-primary bg-red-600! hover:bg-red-700!"
                disabled={crud.isDeleting}
              >
                {crud.isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

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
    } else {
      setFormData({ name: "", description: "" });
    }
  }, [category]);

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <CategoryForm
      formData={formData}
      isEditing={!!category}
      isSubmitting={isSubmitting}
      onChange={handleFormChange}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
};

export default Categories;
