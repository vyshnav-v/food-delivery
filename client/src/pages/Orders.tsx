import React from "react";
import {
  ShoppingCart,
  Filter,
  Search,
  Eye,
  Trash2,
  Clock,
  Package,
  CheckCircle,
  XCircle,
  DollarSign,
  SortAsc,
  Plus,
} from "lucide-react";
import { format } from "date-fns";
import { useSearchParams } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import type { AxiosError } from "axios";

import { orderService } from "../services/orderService";
import Modal from "../components/Modal";
import CommonTable from "../components/CommonTable";
import { OrderForm } from "../components/forms";
import { useFetch, useCRUD, useModal, usePagination } from "../hooks";
import { useRole } from "../hooks/useRole";
import type { Order, Product, User } from "../types";

// Helper function for getting username
const getUserName = (user: any): string => {
  if (typeof user === "string") return user;
  return user?.name || "Unknown";
};

// Column definitions for the orders table
const orderColumns = ({
  handleViewOrder,
  handleStatusChange,
  handleDelete,
  isAdmin,
  isDeleting,
  isUpdating,
  getStatusBadgeClass,
  getStatusIcon,
}: {
  handleViewOrder: (order: Order) => void;
  handleStatusChange: (
    order: Order,
    status: Order["status"],
    target: HTMLSelectElement
  ) => void;
  handleDelete: (order: Order) => void;
  isAdmin: boolean;
  isDeleting: boolean;
  isUpdating: boolean;
  getStatusBadgeClass: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactElement | null;
}): ColumnDef<Order>[] => [
  {
    accessorKey: "_id",
    header: "Order ID",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-bold text-primary-700">
          #{row.original._id.slice(-8).toUpperCase()}
        </span>
        <span className="text-xs text-gray-500">
          {format(new Date(row.original.orderDate), "HH:mm")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "user",
    header: "Customer",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
          {getUserName(row.original.user).charAt(0).toUpperCase()}
        </div>
        <div className="font-medium text-gray-900">
          {getUserName(row.original.user)}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "items",
    header: "Items",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Package size={16} className="text-gray-400" />
        <span className="font-medium text-gray-700">
          {row.original.items.length}
        </span>
        <span className="text-xs text-gray-500">item(s)</span>
      </div>
    ),
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({ row }) => (
      <div className="font-bold text-lg text-green-600">
        ${row.original.totalAmount.toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) =>
      isAdmin ? (
        <select
          value={row.original.status}
          onChange={(e) =>
            handleStatusChange(
              row.original,
              e.target.value as Order["status"],
              e.target
            )
          }
          className={`text-xs font-semibold rounded-full px-2 py-1 ${getStatusBadgeClass(
            row.original.status
          )} cursor-pointer border-0`}
          disabled={isUpdating}
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      ) : (
        <span
          className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
            row.original.status
          )}`}
        >
          {getStatusIcon(row.original.status)}
          {row.original.status.charAt(0).toUpperCase() +
            row.original.status.slice(1)}
        </span>
      ),
  },
  {
    accessorKey: "orderDate",
    header: "Date",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-gray-900">
          {format(new Date(row.original.orderDate), "MMM dd, yyyy")}
        </span>
        <span className="text-xs text-gray-500">
          {format(new Date(row.original.orderDate), "EEE")}
        </span>
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 justify-end">
        <button
          onClick={() => handleViewOrder(row.original)}
          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all"
          title="View details"
        >
          <Eye size={18} />
        </button>
        {isAdmin && (
          <button
            onClick={() => handleDelete(row.original)}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
            title="Delete order"
            disabled={isDeleting}
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
    ),
  },
];

type FiltersState = {
  search: string;
  status: string;
  sort: string;
};

type ApiErrorResponse = {
  message?: string;
  error?: string;
  errors?: Record<string, string | string[]>;
};

const extractErrorMessage = (
  error: unknown,
  fallback = "Failed to process request"
) => {
  if (error && typeof error === "object") {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    if (axiosError?.response?.data) {
      const { error: err, message, errors } = axiosError.response.data;
      if (err && typeof err === "string" && err.trim().length > 0) {
        return err;
      }
      if (message && typeof message === "string" && message.trim().length > 0) {
        return message;
      }
      if (errors && typeof errors === "object") {
        const firstKey = Object.keys(errors)[0];
        if (firstKey) {
          const value = errors[firstKey];
          if (Array.isArray(value) && value.length > 0) {
            return value[0];
          }
          if (typeof value === "string" && value.trim().length > 0) {
            return value;
          }
        }
      }
    }
    if (axiosError?.message) {
      return axiosError.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

const Orders = () => {
  const modal = useModal<Order>();
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

  const initialPage = parseNumberParam(searchParams.get("page"), 1, {
    min: 1,
  });
  const initialLimit = parseNumberParam(searchParams.get("limit"), 10, {
    min: 1,
    max: 100,
  });

  const pagination = usePagination({ initialPage, pageSize: initialLimit });
  const { setCurrentPage: setPaginationCurrentPage, setPageSize } = pagination;

  const [filters, setFilters] = React.useState<FiltersState>(() => ({
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "",
    sort: searchParams.get("sort") || "-createdAt",
  }));

  const [stats, setStats] = React.useState({
    totalOrders: 0,
    totalRevenue: 0,
    byStatus: {
      pending: 0,
      confirmed: 0,
      delivered: 0,
      cancelled: 0,
    },
  });

  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [statusModal, setStatusModal] = React.useState<{
    order: Order;
    newStatus: Order["status"];
  } | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [users, setUsers] = React.useState<User[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [deleteModal, setDeleteModal] = React.useState<{
    id: string;
    reference: string;
  } | null>(null);

  const createDefaultFilters = React.useCallback<() => FiltersState>(
    () => ({
      search: "",
      status: "",
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
      status: searchParams.get("status") || "",
      sort: searchParams.get("sort") || "-createdAt",
    };

    setFilters((prev) =>
      prev.search === urlFilters.search &&
      prev.status === urlFilters.status &&
      prev.sort === urlFilters.sort
        ? prev
        : urlFilters
    );

    const pageFromUrl = parseNumberParam(searchParams.get("page"), 1, {
      min: 1,
    });
    const limitFromUrl = parseNumberParam(searchParams.get("limit"), 10, {
      min: 1,
      max: 100,
    });

    setPageSize(limitFromUrl);
    setPaginationCurrentPage(pageFromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParamsKey]);

  React.useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", pagination.currentPage.toString());
    params.set("limit", pagination.pageSize.toString());
    if (filters.sort) params.set("sort", filters.sort);
    if (filters.search) params.set("search", filters.search);
    if (filters.status) params.set("status", filters.status);

    const newParams = params.toString();
    if (newParams !== searchParamsKey) {
      skipNextUrlSync.current = true;
      setSearchParams(params, { replace: true });
    }
  }, [
    filters.search,
    filters.status,
    filters.sort,
    pagination.currentPage,
    pagination.pageSize,
    searchParamsKey,
    setSearchParams,
  ]);

  const {
    data: orders,
    isLoading,
    refetch,
  } = useFetch<Order[]>({
    fetchFn: () => {
      const sortValue = filters.sort;
      const sortField = sortValue.startsWith("-")
        ? sortValue.substring(1)
        : sortValue;
      const sortOrder = sortValue.startsWith("-") ? "desc" : "asc";

      return orderService.getOrders({
        page: pagination.currentPage,
        limit: pagination.pageSize,
        sort: sortField,
        order: sortOrder,
        status: filters.status || undefined,
        search: filters.search || undefined,
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

      if (response?.stats) {
        setStats({
          totalOrders: response.stats.totalOrders ?? totalFromResponse,
          totalRevenue: response.stats.totalRevenue ?? 0,
          byStatus: {
            pending: response.stats.byStatus?.pending ?? 0,
            confirmed: response.stats.byStatus?.confirmed ?? 0,
            delivered: response.stats.byStatus?.delivered ?? 0,
            cancelled: response.stats.byStatus?.cancelled ?? 0,
          },
        });
      } else {
        const fallbackByStatus = data.reduce(
          (acc: Record<Order["status"], number>, order) => {
            acc[order.status] += 1;
            return acc;
          },
          {
            pending: 0,
            confirmed: 0,
            delivered: 0,
            cancelled: 0,
          } as Record<Order["status"], number>
        );
        const revenue = data.reduce(
          (sum, order) =>
            order.status !== "cancelled" ? sum + order.totalAmount : sum,
          0
        );
        setStats({
          totalOrders: totalFromResponse,
          totalRevenue: revenue,
          byStatus: fallbackByStatus,
        });
      }
    },
    dependencies: [
      pagination.currentPage,
      pagination.pageSize,
      filters.search,
      filters.status,
      filters.sort,
    ],
  });

  const crud = useCRUD<Order>({
    createFn: orderService.createOrder as any,
    updateFn: (id, data: any) =>
      orderService.updateOrderStatus(id, data.status),
    deleteFn: orderService.deleteOrder,
    onSuccess: refetch,
    messages: {
      createSuccess: "Order created successfully!",
      updateSuccess: "Order status updated successfully!",
      deleteSuccess: "Order deleted successfully!",
      createError: (error) =>
        extractErrorMessage(error, "Failed to create order"),
      updateError: (error) =>
        extractErrorMessage(error, "Failed to update order"),
      deleteError: (error) =>
        extractErrorMessage(error, "Failed to delete order"),
    },
    confirmDelete: false,
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="inline mr-1" size={16} />;
      case "confirmed":
        return <Package className="inline mr-1" size={16} />;
      case "delivered":
        return <CheckCircle className="inline mr-1" size={16} />;
      case "cancelled":
        return <XCircle className="inline mr-1" size={16} />;
      default:
        return null;
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    modal.open(order);
  };

  const openCreateModal = async () => {
    try {
      const [usersResponse, productsResponse] = await Promise.all([
        orderService.fetchUsers(),
        orderService.fetchProducts(),
      ]);
      setUsers((usersResponse.data as User[]) || []);
      setProducts((productsResponse.data as Product[]) || []);
    } catch (error) {
      console.error("Failed to preload users/products for order", error);
    }
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleRequestDelete = (order: Order) => {
    if (!order._id) return;
    setDeleteModal({
      id: order._id,
      reference: order._id.slice(-8).toUpperCase(),
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal) return;
    try {
      await crud.remove(deleteModal.id);
    } catch (error) {
      console.error("Delete order error", error);
    } finally {
      setDeleteModal(null);
    }
  };

  const handleStatusChange = (
    order: Order,
    newStatus: Order["status"],
    target: HTMLSelectElement
  ) => {
    if (newStatus === order.status) return;
    target.value = order.status;
    setStatusModal({ order, newStatus });
  };

  React.useEffect(() => {
    if (!modal.isOpen || !selectedOrder || !orders) return;
    const updatedOrder = orders.find(
      (order) => order._id === selectedOrder._id
    );
    if (updatedOrder) {
      setSelectedOrder(updatedOrder);
    }
  }, [orders, modal.isOpen, selectedOrder]);

  const confirmStatusUpdate = async () => {
    if (!statusModal) return;
    try {
      await crud.update(statusModal.order._id, {
        status: statusModal.newStatus,
      });
      setStatusModal(null);
    } catch (error) {
      console.error("Order status update error", error);
    }
  };

  const cancelStatusUpdate = () => {
    setStatusModal(null);
  };

  const totalOrders = pagination.totalCount || stats.totalOrders;
  const activeFilters =
    filters.search || filters.status || filters.sort !== "-createdAt";

  const sortOptions = [
    { value: "-createdAt", label: "Newest First" },
    { value: "createdAt", label: "Oldest First" },
    { value: "-orderDate", label: "Recent Order Date" },
    { value: "orderDate", label: "Oldest Order Date" },
    { value: "-totalAmount", label: "Amount (High to Low)" },
    { value: "totalAmount", label: "Amount (Low to High)" },
    { value: "status", label: "Status (A-Z)" },
    { value: "-status", label: "Status (Z-A)" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-2">
            Manage customer orders
            {` (${totalOrders} order${totalOrders === 1 ? "" : "s"})`}
          </p>
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={openCreateModal}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            New Order
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalOrders}
              </p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg">
              <ShoppingCart className="text-blue-600" size={32} />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                ${stats.totalRevenue.toFixed(2)}
              </p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <DollarSign className="text-green-600" size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="card">
        <div className="flex flex-wrap items-center gap-4">
          {/* Sort */}
          <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-xs">
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
          <div className="relative flex-1 min-w-[260px] max-w-xl">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              placeholder="Search by order ID, customer name, email, or mobile"
              className="input-field pl-10"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-xs">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filters.status}
              onChange={(e) => updateFilter("status", e.target.value)}
              className="input-field flex-1"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {activeFilters && (
            <button
              onClick={() => {
                setFilters(createDefaultFilters());
                setPaginationCurrentPage(1);
              }}
              className="btn-secondary ml-auto"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <CommonTable
        columns={orderColumns({
          handleViewOrder,
          handleStatusChange,
          handleDelete: handleRequestDelete,
          isAdmin,
          isDeleting: crud.isDeleting,
          isUpdating: crud.isUpdating,
          getStatusBadgeClass,
          getStatusIcon,
        })}
        data={orders || []}
        isLoading={isLoading}
        title="orders"
        totalPages={pagination.totalPages}
        totalCount={pagination.totalCount}
        serverSide
        onPageChange={pagination.goToPage}
        onPageSizeChange={setPageSize}
        currentPage={pagination.currentPage}
        pageSize={pagination.pageSize}
      />

      {/* Order Details Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        title="Order Details"
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-4">
            {/* Order Info */}
            <div className="grid grid-cols-2 gap-4 pb-4 border-b">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-semibold">#{selectedOrder._id.slice(-8)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                    selectedOrder.status
                  )}`}
                >
                  {selectedOrder.status.charAt(0).toUpperCase() +
                    selectedOrder.status.slice(1)}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-semibold">
                  {getUserName(selectedOrder.user)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-semibold">
                  {format(
                    new Date(selectedOrder.orderDate),
                    "MMM dd, yyyy HH:mm"
                  )}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-semibold mb-2">Order Items</h3>
              <div className="space-y-2">
                {selectedOrder.items.map((item, index) => {
                  const productName =
                    typeof item.product === "string"
                      ? item.product
                      : item.product?.name || "Unknown Product";
                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{productName}</p>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-semibold">
                        ${(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total */}
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold">Total Amount</p>
                <p className="text-2xl font-bold text-green-600">
                  ${selectedOrder.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <button onClick={modal.close} className="btn-secondary flex-1">
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Status Confirmation Modal */}
      <Modal
        isOpen={Boolean(statusModal)}
        onClose={cancelStatusUpdate}
        title="Confirm Status Update"
        size="sm"
      >
        {statusModal && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Change status of order
              <span className="font-semibold ml-1">
                #{statusModal.order._id.slice(-8).toUpperCase()}
              </span>
              ?
            </p>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">From</span>
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                    statusModal.order.status
                  )}`}
                >
                  {statusModal.order.status}
                </span>
              </div>
              <span className="text-gray-400">→</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">To</span>
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                    statusModal.newStatus
                  )}`}
                >
                  {statusModal.newStatus}
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={cancelStatusUpdate}
                className="btn-secondary"
                disabled={crud.isUpdating}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmStatusUpdate}
                className="btn-primary"
                disabled={crud.isUpdating}
              >
                {crud.isUpdating ? "Updating..." : "Confirm"}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Order Modal */}
      {isAdmin && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={closeCreateModal}
          title="Create Order"
          size="xl"
        >
          <OrderForm
            order={null}
            users={users}
            products={products}
            isSubmitting={crud.isCreating}
            onSubmit={async (payload) => {
              try {
                await crud.create(payload as any);
                closeCreateModal();
              } catch (error) {
                console.error("Create order error", error);
              }
            }}
            onCancel={closeCreateModal}
          />
        </Modal>
      )}

      <Modal
        isOpen={Boolean(deleteModal)}
        onClose={() => setDeleteModal(null)}
        title="Delete Order"
        size="sm"
      >
        {deleteModal && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete order
              <span className="font-semibold"> #{deleteModal.reference}</span>?
              This action cannot be undone.
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

export default Orders;
