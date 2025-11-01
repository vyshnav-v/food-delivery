import React from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Users as UsersIcon,
  Shield,
  User as UserIcon,
  SortAsc,
  Filter,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import type { ColumnDef } from "@tanstack/react-table";

import type { AxiosError } from "axios";

import { userService } from "../services/userService";
import Modal from "../components/Modal";
import CommonTable from "../components/CommonTable";
import { UserForm } from "../components/forms";
import { useFetch, useCRUD, useModal, usePagination } from "../hooks";
import type { User } from "../types";

const userColumns = ({
  handleOpenUserModal,
  handleDelete,
  isDeleting,
}: {
  handleOpenUserModal: (user: User) => void;
  handleDelete: (user: User) => void;
  isDeleting: boolean;
}): ColumnDef<User>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium text-gray-900">{row.original.name}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="text-gray-900">{row.original.email}</div>
    ),
  },
  {
    accessorKey: "mobile",
    header: "Mobile",
    cell: ({ row }) => (
      <div className="text-gray-500">{row.original.mobile || "-"}</div>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
          row.original.role === "admin"
            ? "bg-red-100 text-red-800"
            : "bg-green-100 text-green-800"
        }`}
      >
        {row.original.role === "admin" ? (
          <>
            <Shield size={12} className="mr-1" />
            Admin
          </>
        ) : (
          <>
            <UserIcon size={12} className="mr-1" />
            Customer
          </>
        )}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => (
      <div className="text-gray-500">
        {row.original.createdAt
          ? format(new Date(row.original.createdAt), "MMM dd, yyyy")
          : "-"}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 justify-end">
        <button
          onClick={() => handleOpenUserModal(row.original)}
          className="text-blue-600 hover:text-blue-800 transition-colors"
          title="Edit user"
        >
          <Edit size={18} />
        </button>
        <button
          onClick={() => handleDelete(row.original)}
          className="text-red-600 hover:text-red-800 transition-colors"
          title="Delete user"
          disabled={isDeleting}
        >
          <Trash2 size={18} />
        </button>
      </div>
    ),
  },
];

interface FiltersState {
  search: string;
  sort: string;
  role: string;
}

const areFiltersEqual = (a: FiltersState, b: FiltersState) =>
  a.search === b.search && a.sort === b.sort && a.role === b.role;

type ApiErrorResponse = {
  message?: string;
  error?: string;
  errors?: Record<string, string | string[]>;
};

const extractErrorMessage = (
  error: unknown,
  fallback = "Failed to save user"
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

const Users = () => {
  const modal = useModal<User>();
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
  const initialLimit = parseNumberParam(searchParams.get("limit"), 10, {
    min: 1,
    max: 100,
  });

  const pagination = usePagination({ initialPage, pageSize: initialLimit });
  const { setCurrentPage: setPaginationCurrentPage, setPageSize } = pagination;

  const [filters, setFilters] = React.useState<FiltersState>(() => ({
    search: searchParams.get("search") || "",
    sort: searchParams.get("sort") || "-createdAt",
    role: searchParams.get("role") || "",
  }));

  const [stats, setStats] = React.useState({
    total: 0,
    admins: 0,
    customers: 0,
  });

  const [deleteModal, setDeleteModal] = React.useState<{
    id: string;
    name: string;
  } | null>(null);

  const createDefaultFilters = React.useCallback<() => FiltersState>(
    () => ({
      search: "",
      sort: "-createdAt",
      role: "",
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
      role: searchParams.get("role") || "",
    };

    setFilters((prev) =>
      areFiltersEqual(prev, urlFilters) ? prev : urlFilters
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
    if (filters.role) params.set("role", filters.role);

    const newParams = params.toString();
    if (newParams !== searchParamsKey) {
      skipNextUrlSync.current = true;
      setSearchParams(params, { replace: true });
    }
  }, [
    filters.role,
    filters.search,
    filters.sort,
    pagination.currentPage,
    pagination.pageSize,
    searchParamsKey,
    setSearchParams,
  ]);

  const {
    data: users,
    isLoading,
    refetch,
  } = useFetch<User[]>({
    fetchFn: () => {
      const sortValue = filters.sort;
      const sortField = sortValue.startsWith("-")
        ? sortValue.substring(1)
        : sortValue;
      const order = sortValue.startsWith("-") ? "desc" : "asc";

      return userService.getUsers({
        page: pagination.currentPage,
        limit: pagination.pageSize,
        sort: sortField,
        order,
        search: filters.search || undefined,
        role: filters.role || undefined,
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
          total: response.stats.total ?? totalFromResponse,
          admins: response.stats.admins ?? 0,
          customers: response.stats.customers ?? 0,
        });
      } else {
        const adminCount = data.filter((u) => u.role === "admin").length;
        const customerCount = data.filter((u) => u.role === "customer").length;
        setStats({
          total: totalFromResponse,
          admins: adminCount,
          customers: customerCount,
        });
      }
    },
    dependencies: [
      pagination.currentPage,
      pagination.pageSize,
      filters.search,
      filters.sort,
      filters.role,
    ],
  });

  const crud = useCRUD<User>({
    createFn: userService.createUser as any,
    updateFn: userService.updateUser,
    deleteFn: userService.deleteUser,
    onSuccess: refetch,
    messages: {
      createSuccess: "User created successfully!",
      updateSuccess: "User updated successfully!",
      deleteSuccess: "User deleted successfully!",
      createError: (error) => extractErrorMessage(error),
      updateError: (error) => extractErrorMessage(error),
      deleteError: (error) =>
        extractErrorMessage(error, "Failed to delete user"),
    },
    confirmDelete: false,
  });

  const handleOpenUserModal = (user?: User) => {
    modal.open(user);
  };

  const handleRequestDelete = (user: User) => {
    setDeleteModal({ id: user._id, name: user.name });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal) return;
    try {
      await crud.remove(deleteModal.id);
    } catch (error) {
      console.error("Delete user error", error);
    } finally {
      setDeleteModal(null);
    }
  };

  const handleSubmit = async (formData: any) => {
    if (!formData.name || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    const userData: any = {
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile || "",
      role: formData.role || "customer",
    };

    if (modal.editingItem) {
      try {
        await crud.update(modal.editingItem._id, userData);
        modal.close();
      } catch (error) {
        console.error("User submission error", error);
      }
    } else {
      try {
        await crud.create(userData);
        modal.close();
      } catch (error) {
        console.error("User submission error", error);
      }
    }
  };

  const sortOptions = [
    { value: "-createdAt", label: "Newest First" },
    { value: "createdAt", label: "Oldest First" },
    { value: "name", label: "Name (A-Z)" },
    { value: "-name", label: "Name (Z-A)" },
    { value: "email", label: "Email (A-Z)" },
    { value: "-email", label: "Email (Z-A)" },
  ];

  const activeFilters =
    filters.search || filters.role || filters.sort !== "-createdAt";

  const totalUsers = pagination.totalCount || users?.length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-2">
            Manage system users
            {` (${totalUsers} user${totalUsers === 1 ? "" : "s"})`}
          </p>
        </div>
        <button onClick={() => handleOpenUserModal()} className="btn-primary">
          <Plus size={20} className="inline mr-2" />
          New User
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.total}
              </p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg">
              <UsersIcon className="text-blue-600" size={32} />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">
                Administrators
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.admins}
              </p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg">
              <Shield className="text-red-600" size={32} />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Customers</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.customers}
              </p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <UserIcon className="text-green-600" size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center justify-between gap-4 flex-wrap">
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

          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              placeholder="Search by name, email, or mobile..."
              className="input-field pl-10"
            />
          </div>

          <div className="flex items-center gap-2 min-w-[160px]">
            <Filter size={18} className="text-gray-400" />
            <select
              value={filters.role}
              onChange={(e) => updateFilter("role", e.target.value)}
              className="input-field"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
            </select>
          </div>

          {activeFilters && (
            <button
              onClick={() => {
                setFilters(createDefaultFilters());
                setPaginationCurrentPage(1);
              }}
              className="btn-secondary"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <CommonTable
        columns={userColumns({
          handleOpenUserModal,
          handleDelete: handleRequestDelete,
          isDeleting: crud.isDeleting,
        })}
        data={users || []}
        isLoading={isLoading}
        title="users"
        totalPages={pagination.totalPages}
        totalCount={pagination.totalCount}
        hidePageSizeControls={false}
        serverSide
        onPageChange={pagination.goToPage}
        onPageSizeChange={setPageSize}
        currentPage={pagination.currentPage}
        pageSize={pagination.pageSize}
      />

      {/* User Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        title={modal.isEditing ? "Edit User" : "Add New User"}
        size="md"
      >
        <UserForm
          user={modal.editingItem}
          onSubmit={handleSubmit}
          onCancel={modal.close}
          isSubmitting={crud.isLoading}
        />
      </Modal>

      <Modal
        isOpen={Boolean(deleteModal)}
        onClose={() => setDeleteModal(null)}
        title="Delete User"
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
export default Users;
