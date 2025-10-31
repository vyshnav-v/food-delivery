import React from "react";
import {
  Plus,
  Filter,
  SortAsc,
  Edit,
  Trash2,
  X,
  Package,
  Star,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";
import { productService } from "../services/productService";
import { categoryService } from "../services/categoryService";
import PaginationAdvanced from "../components/PaginationAdvanced";
import Modal from "../components/Modal";
import { ProductForm } from "../components/forms";
import LoadingSkeleton from "../components/LoadingSkeleton";
import EmptyState from "../components/EmptyState";
import { useModal, useFetch, useCRUD, usePagination } from "../hooks";
import { useRole } from "../hooks/useRole";
import { useSearchParams } from "react-router-dom";
import type { Product, Category } from "../types";
import type { FileType } from "../types/form";

type FiltersState = {
  category: string;
  minPrice: string;
  maxPrice: string;
  status: string;
  sort: string;
  search: string;
};

const areFiltersEqual = (a: FiltersState, b: FiltersState) =>
  a.category === b.category &&
  a.minPrice === b.minPrice &&
  a.maxPrice === b.maxPrice &&
  a.status === b.status &&
  a.sort === b.sort &&
  a.search === b.search;

const Products = () => {
  const modal = useModal<Product>();
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
  const initialLimit = parseNumberParam(searchParams.get("limit"), 12, {
    min: 1,
    max: 100,
  });

  const pagination = usePagination({ initialPage, pageSize: initialLimit });

  const [filters, setFilters] = React.useState<FiltersState>(() => ({
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    status: searchParams.get("status") || "",
    sort: searchParams.get("sort") || "name",
    search: searchParams.get("search") || "",
  }));
  const [showFilters, setShowFilters] = React.useState(false);

  const createDefaultFilters = React.useCallback<() => FiltersState>(
    () => ({
      category: "",
      minPrice: "",
      maxPrice: "",
      status: "",
      sort: "name",
      search: "",
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
        pagination.setCurrentPage(1);
      }
    },
    [pagination.setCurrentPage]
  );

  React.useEffect(() => {
    if (skipNextUrlSync.current) {
      skipNextUrlSync.current = false;
      return;
    }

    const urlFilters: FiltersState = {
      category: searchParams.get("category") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      status: searchParams.get("status") || "",
      sort: searchParams.get("sort") || "name",
      search: searchParams.get("search") || "",
    };

    setFilters((prev) =>
      areFiltersEqual(prev, urlFilters) ? prev : urlFilters
    );

    const pageFromUrl = parseNumberParam(searchParams.get("page"), 1, {
      min: 1,
    });
    pagination.setCurrentPage(pageFromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParamsKey]);

  React.useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", pagination.currentPage.toString());
    params.set("limit", pagination.pageSize.toString());
    if (filters.sort) params.set("sort", filters.sort);
    if (filters.category) params.set("category", filters.category);
    if (filters.status) params.set("status", filters.status);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.search) params.set("search", filters.search);

    const newParams = params.toString();
    if (newParams !== searchParamsKey) {
      skipNextUrlSync.current = true;
      setSearchParams(params, { replace: true });
    }
  }, [
    filters.category,
    filters.maxPrice,
    filters.minPrice,
    filters.search,
    filters.sort,
    filters.status,
    pagination.currentPage,
    pagination.pageSize,
    searchParamsKey,
    setSearchParams,
  ]);

  // Fetch categories for filter dropdown
  const { data: categoriesData } = useFetch<Category[]>({
    fetchFn: categoryService.getCategories,
    dependencies: [],
  });

  const {
    data: products,
    isLoading,
    refetch,
  } = useFetch<Product[]>({
    fetchFn: () =>
      productService.getProducts({
        page: pagination.currentPage,
        limit: pagination.pageSize,
        sort: filters.sort,
        category: filters.category || undefined,
        minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
        status: filters.status || undefined,
        search: filters.search || undefined,
      }),
    onSuccess: (data, count, response) => {
      if (!Array.isArray(data)) return;

      const totalFromResponse =
        response?.pagination?.total ??
        count ??
        (pagination.currentPage - 1) * pagination.pageSize + data.length;

      pagination.updateTotalCount(totalFromResponse);

      if (response?.pagination?.totalPages) {
        pagination.setTotalPages(response.pagination.totalPages);
      }
    },
    dependencies: [
      pagination.currentPage,
      pagination.pageSize,
      filters.sort,
      filters.category,
      filters.status,
      filters.minPrice,
      filters.maxPrice,
      filters.search,
    ],
  });

  const crud = useCRUD<Product>({
    createFn: productService.createProduct,
    updateFn: productService.updateProduct,
    deleteFn: productService.deleteProduct,
    onSuccess: refetch,
    messages: {
      createSuccess: "Product created successfully!",
      updateSuccess: "Product updated successfully!",
      deleteSuccess: "Product deleted successfully!",
    },
  });

  const handleSortChange = (value: string) => {
    updateFilter("sort", value);
  };

  const handleSearchChange = (value: string) => {
    updateFilter("search", value);
  };

  const applyFilters = () => {
    pagination.setCurrentPage(1);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters(createDefaultFilters());
    pagination.setCurrentPage(1);
    setShowFilters(false);
  };

  const handleOpenProductModal = (product?: Product) => {
    modal.open(product);
  };

  const handleSubmit = async (e: React.FormEvent, formData: any) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.price ||
      !formData.category ||
      !formData.stock
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const imageFiles = Array.isArray(formData.image) ? formData.image : [];
    const firstImageEntry = imageFiles[0];
    const imageFile: File | undefined = firstImageEntry
      ? (firstImageEntry.file as File) || firstImageEntry
      : undefined;

    const buildFormData = () => {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("description", formData.description || "");
      payload.append("price", String(formData.price));
      payload.append("category", formData.category);
      payload.append("stock", String(formData.stock));
      payload.append("status", formData.status || "available");
      payload.append(
        "featured",
        String(formData.featured === "true" || formData.featured === true)
      );

      if (imageFile) {
        payload.append("image", imageFile);
      } else if (formData.imageUrl) {
        payload.append("imageUrl", formData.imageUrl);
      }

      return payload;
    };

    const shouldUseMultipart = Boolean(imageFile);

    const productData = shouldUseMultipart
      ? buildFormData()
      : {
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          category: formData.category,
          stock: Number(formData.stock),
          status: formData.status || "available",
          featured: formData.featured === "true" || formData.featured === true,
          imageUrl: formData.imageUrl || undefined,
        };

    try {
      if (modal.editingItem) {
        await crud.update(modal.editingItem._id, productData as any);
      } else {
        await crud.create(productData as any);
      }

      await refetch();
      modal.close();
    } catch (error) {
      console.error("Product submission error", error);
    }
  };

  // Sort options
  const sortOptions = [
    { value: "name", label: "Name (A-Z)" },
    { value: "-name", label: "Name (Z-A)" },
    { value: "price", label: "Price (Low to High)" },
    { value: "-price", label: "Price (High to Low)" },
    { value: "-createdAt", label: "Newest First" },
    { value: "createdAt", label: "Oldest First" },
    { value: "-stock", label: "Stock (High to Low)" },
    { value: "stock", label: "Stock (Low to High)" },
  ];

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "unavailable":
        return "bg-red-100 text-red-800";
      case "out-of-stock":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryName = (category: any): string => {
    if (typeof category === "string") {
      return category;
    }
    return category?.name || "Unknown";
  };

  // Filtered products based on status
  const filteredProducts = React.useMemo(() => {
    if (!products) return [];
    let result = products;
    if (filters.status) {
      result = result.filter((p) => p.status === filters.status);
    }
    if (filters.search) {
      const term = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term)
      );
    }
    return result;
  }, [products, filters.search, filters.status]);

  const totalProducts = pagination.totalCount || filteredProducts.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-2">
            Manage food products
            {` (${totalProducts} item${totalProducts === 1 ? "" : "s"})`}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => handleOpenProductModal()}
            className="btn-primary"
          >
            <Plus size={20} className="inline mr-2" />
            New Product
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
              onChange={(e) => handleSortChange(e.target.value)}
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
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search products..."
              className="input-field pl-10"
            />
          </div>

          {/* Filter Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-secondary ${showFilters ? "bg-primary-100" : ""}`}
            >
              <Filter size={20} className="inline mr-2" />
              Filters
            </button>
            {(filters.category ||
              filters.minPrice ||
              filters.maxPrice ||
              filters.status ||
              filters.search ||
              filters.sort !== "name") && (
              <button
                onClick={clearFilters}
                className="btn-secondary !bg-white !text-primary-600 hover:!bg-primary-50"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t space-y-4 animate-slideDown">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => updateFilter("category", e.target.value)}
                  className="input-field"
                >
                  <option value="">All Categories</option>
                  {categoriesData?.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => updateFilter("status", e.target.value)}
                  className="input-field"
                >
                  <option value="">All Status</option>
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Price
                </label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => updateFilter("minPrice", e.target.value)}
                  placeholder="0"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price
                </label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilter("maxPrice", e.target.value)}
                  placeholder="1000"
                  className="input-field"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={applyFilters} className="btn-primary">
                Apply Filters
              </button>
              <button onClick={clearFilters} className="btn-secondary">
                <X size={16} className="inline mr-1" />
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          <LoadingSkeleton count={8} type="card" />
        ) : !filteredProducts || filteredProducts.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              icon={Package}
              title="No products found"
              description={
                filters.category ||
                filters.minPrice ||
                filters.maxPrice ||
                filters.status ||
                filters.search ||
                filters.sort !== "name"
                  ? "Try adjusting your filters"
                  : "Add your first product to get started"
              }
              action={
                isAdmin &&
                !(
                  filters.category ||
                  filters.minPrice ||
                  filters.maxPrice ||
                  filters.status ||
                  filters.search ||
                  filters.sort !== "name"
                )
                  ? {
                      label: "Add Product",
                      onClick: () => handleOpenProductModal(),
                    }
                  : undefined
              }
            />
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              className="card-hover relative group overflow-hidden"
            >
              {/* Featured Badge */}
              {product.featured && (
                <div className="absolute top-2 left-2 z-10">
                  <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                    <Star size={12} fill="currentColor" />
                    Featured
                  </span>
                </div>
              )}

              {/* Product Image */}
              <div className="relative h-48 bg-linear-to-br from-primary-100 to-primary-200 rounded-lg mb-4 overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={
                      product.imageUrl.startsWith("http")
                        ? product.imageUrl
                        : `${import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000"}${product.imageUrl}`
                    }
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={48} className="text-primary-400" />
                  </div>
                )}

                {/* Action Buttons (shown on hover) - Admin only */}
                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenProductModal(product)}
                      className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
                      title="Edit product"
                    >
                      <Edit size={16} className="text-gray-600" />
                    </button>
                    <button
                      onClick={() => crud.remove(product._id)}
                      className="p-2 bg-white rounded-lg shadow-lg hover:bg-red-50 transition-colors"
                      title="Delete product"
                      disabled={crud.isDeleting}
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                )}

                {/* Stock Badge */}
                {product.stock < 10 && product.status !== "out-of-stock" && (
                  <div className="absolute bottom-2 left-2">
                    <span className="px-2 py-1 bg-primary-500 text-white text-xs rounded-full">
                      {product.stock === 0
                        ? "Out of Stock"
                        : `Only ${product.stock} left`}
                    </span>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-2">
                <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-primary-600">
                      ${product.price.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getCategoryName(product.category)}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(
                        product.status
                      )}`}
                    >
                      {product.status === "out-of-stock"
                        ? "Out of Stock"
                        : product.status.charAt(0).toUpperCase() +
                          product.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {!isLoading && pagination.totalPages > 1 && (
        <PaginationAdvanced
          total={pagination.totalCount || 0}
          currentPage={pagination.currentPage}
          pageSize={pagination.pageSize}
          onChange={pagination.goToPage}
          displayTotal={true}
        />
      )}

      {/* Product Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        title={modal.isEditing ? "Edit Product" : "Add New Product"}
        size="xl"
      >
        <ProductFormWrapper
          product={modal.editingItem}
          categories={categoriesData || []}
          onSubmit={handleSubmit}
          onCancel={modal.close}
          isSubmitting={crud.isLoading}
        />
      </Modal>
    </div>
  );
};

// Product Form Wrapper
const ProductFormWrapper = ({
  product,
  categories,
  onSubmit,
  onCancel,
  isSubmitting,
}: {
  product: Product | null;
  categories: Category[];
  onSubmit: (e: React.FormEvent, formData: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}) => {
  const getCategoryId = (category: any): string => {
    if (typeof category === "string") return category;
    return category?._id || "";
  };

  const resolveImageUrl = (url?: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return (
      import.meta.env.VITE_API_URL?.replace("/api", "") ||
      "http://localhost:5000"
    ).concat(url);
  };

  const createExistingImage = (url?: string): FileType[] => {
    if (!url) return [];
    return [
      {
        file: undefined,
        fileId: "existing-image",
        name: url.split("/").pop() || "product-image.webp",
        size: 0,
        url: resolveImageUrl(url),
        type: "image/existing",
      },
    ];
  };

  const [formData, setFormData] = React.useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price.toString() || "",
    category: getCategoryId(product?.category) || "",
    stock: product?.stock.toString() || "",
    status: product?.status || "available",
    featured: product?.featured?.toString() || "false",
    imageUrl: product?.imageUrl || "",
    image: createExistingImage(product?.imageUrl),
  });

  React.useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: getCategoryId(product.category),
        stock: product.stock.toString(),
        status: product.status || "available",
        featured: product.featured?.toString() || "false",
        imageUrl: product.imageUrl || "",
        image: createExistingImage(product.imageUrl),
      });
    }
  }, [product]);

  const handleFormChange = (field: string, value: any) => {
    if (field === "image") {
      const hasNewFile =
        Array.isArray(value) &&
        value.some((item) => item?.file instanceof File);
      setFormData((prev) => ({
        ...prev,
        image: value,
        imageUrl: hasNewFile ? "" : prev.imageUrl,
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <ProductForm
      formData={formData}
      categories={categories}
      isEditing={!!product}
      isSubmitting={isSubmitting}
      onChange={handleFormChange}
      onSubmit={(e) => onSubmit(e, formData)}
      onCancel={onCancel}
    />
  );
};

export default Products;
