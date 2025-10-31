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
} from "lucide-react";
import { orderService } from "../services/orderService";
import Modal from "../components/Modal";
import CommonTable from "../components/CommonTable";
import { useFetch, useCRUD, useModal, usePagination } from "../hooks";
import { useRole } from "../hooks/useRole";
import type { Order } from "../types";
import { format } from "date-fns";
import type { ColumnDef } from "@tanstack/react-table";

// Helper function for getting username
const getUserName = (user: any): string => {
  if (typeof user === "string") return user;
  return user?.name || "Unknown";
};

// Column definitions for the orders table
const orderColumns = ({
  handleViewOrder,
  handleStatusUpdate,
  handleDelete,
  isAdmin,
  isDeleting,
  isUpdating,
  getStatusBadgeClass,
  getStatusIcon,
}: {
  handleViewOrder: (order: Order) => void;
  handleStatusUpdate: (orderId: string, status: string) => void;
  handleDelete: (id: string) => void;
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
          onChange={(e) => handleStatusUpdate(row.original._id, e.target.value)}
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
            onClick={() => handleDelete(row.original._id)}
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

const Orders = () => {
  const modal = useModal<Order>();
  const pagination = usePagination({ initialPage: 1, pageSize: 10 });
  const { isAdmin } = useRole();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);

  const {
    data: orders,
    isLoading,
    refetch,
  } = useFetch<Order[]>({
    fetchFn: () =>
      orderService.getOrders({
        page: pagination.currentPage,
        limit: pagination.pageSize,
        status: statusFilter || undefined,
      }),
    dependencies: [pagination.currentPage, statusFilter],
  });

  React.useEffect(() => {
    if (orders) {
      if (orders.length === pagination.pageSize) {
        pagination.setTotalPages(pagination.currentPage + 1);
      } else {
        const actualTotal =
          (pagination.currentPage - 1) * pagination.pageSize + orders.length;
        pagination.updateTotalCount(actualTotal);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders]);

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
    },
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

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    await crud.update(orderId, { status: newStatus as Order["status"] });
  };

  const filteredOrders = React.useMemo(() => {
    if (!orders) return [];
    if (!searchTerm) return orders;

    const term = searchTerm.toLowerCase();
    return orders.filter(
      (order) =>
        order._id.toLowerCase().includes(term) ||
        getUserName(order.user).toLowerCase().includes(term)
    );
  }, [orders, searchTerm]);

  const stats = React.useMemo(() => {
    if (!orders) return { total: 0, revenue: 0 };
    return {
      total: orders.length,
      revenue: orders.reduce(
        (sum, order) =>
          order.status !== "cancelled" ? sum + order.totalAmount : sum,
        0
      ),
    };
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-2">
            Manage customer orders
            {filteredOrders && ` (${filteredOrders.length} orders)`}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.total}
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
                ${stats.revenue.toFixed(2)}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by order ID or customer..."
              className="input-field pl-10"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                pagination.setCurrentPage(1);
              }}
              className="input-field flex-1"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <CommonTable
        columns={orderColumns({
          handleViewOrder,
          handleStatusUpdate,
          handleDelete: crud.remove,
          isAdmin,
          isDeleting: crud.isDeleting,
          isUpdating: crud.isLoading,
          getStatusBadgeClass,
          getStatusIcon,
        })}
        data={filteredOrders}
        isLoading={isLoading}
        title="orders"
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
    </div>
  );
};

export default Orders;
