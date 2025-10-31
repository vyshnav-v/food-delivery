import React from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Users as UsersIcon,
  Shield,
  User as UserIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { userService } from "../services/userService";
import Modal from "../components/Modal";
import CommonTable from "../components/CommonTable";
import { useFetch, useCRUD, useModal } from "../hooks";
import type { User } from "../types";
import { format } from "date-fns";
import type { ColumnDef } from "@tanstack/react-table";

// Column definitions for the users table
const userColumns = ({
  handleOpenUserModal,
  handleDelete,
  isDeleting,
}: {
  handleOpenUserModal: (user: User) => void;
  handleDelete: (id: string) => void;
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
          onClick={() => handleDelete(row.original._id || row.original.id)}
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

const Users = () => {
  const modal = useModal<User>();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("");

  const {
    data: users,
    isLoading,
    refetch,
  } = useFetch<User[]>({
    fetchFn: userService.getUsers,
    dependencies: [],
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
    },
  });

  const handleOpenUserModal = (user?: User) => {
    modal.open(user);
  };

  const handleSubmit = async (e: React.FormEvent, formData: any) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!modal.editingItem && !formData.password) {
      toast.error("Password is required for new users");
      return;
    }

    const userData: any = {
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      role: formData.role || "customer",
    };

    // Only include password when creating or if provided during update
    if (formData.password) {
      userData.password = formData.password;
    }

    if (modal.editingItem) {
      await crud.update(
        modal.editingItem._id || modal.editingItem.id,
        userData
      );
    } else {
      await crud.create(userData);
    }
    modal.close();
  };

  const filteredUsers = React.useMemo(() => {
    if (!users) return [];

    let filtered = users;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          user.mobile?.toLowerCase().includes(term)
      );
    }

    // Apply role filter
    if (roleFilter) {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    return filtered;
  }, [users, searchTerm, roleFilter]);

  const stats = React.useMemo(() => {
    if (!users) return { total: 0, admins: 0, customers: 0 };
    return {
      total: users.length,
      admins: users.filter((u) => u.role === "admin").length,
      customers: users.filter((u) => u.role === "customer").length,
    };
  }, [users]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-2">
            Manage system users
            {filteredUsers && ` (${filteredUsers.length} users)`}
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
              placeholder="Search by name, email, or mobile..."
              className="input-field pl-10"
            />
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="input-field"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <CommonTable
        columns={userColumns({
          handleOpenUserModal,
          handleDelete: crud.remove,
          isDeleting: crud.isDeleting,
        })}
        data={filteredUsers}
        isLoading={isLoading}
        title="users"
      />

      {/* User Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        title={modal.isEditing ? "Edit User" : "Add New User"}
        size="md"
      >
        <UserFormWrapper
          user={modal.editingItem}
          onSubmit={handleSubmit}
          onCancel={modal.close}
          isSubmitting={crud.isLoading}
        />
      </Modal>
    </div>
  );
};

// User Form Wrapper
const UserFormWrapper = ({
  user,
  onSubmit,
  onCancel,
  isSubmitting,
}: {
  user: User | null;
  onSubmit: (e: React.FormEvent, formData: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}) => {
  const [formData, setFormData] = React.useState({
    name: user?.name || "",
    email: user?.email || "",
    mobile: user?.mobile || "",
    password: "",
    role: user?.role || "customer",
  });

  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        mobile: user.mobile || "",
        password: "",
        role: user.role,
      });
    }
  }, [user]);

  const handleFormChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <form onSubmit={(e) => onSubmit(e, formData)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleFormChange("name", e.target.value)}
          className="input-field"
          placeholder="Enter full name"
          disabled={isSubmitting}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email *
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleFormChange("email", e.target.value)}
          className="input-field"
          placeholder="Enter email"
          disabled={isSubmitting}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mobile
        </label>
        <input
          type="tel"
          value={formData.mobile}
          onChange={(e) => handleFormChange("mobile", e.target.value)}
          className="input-field"
          placeholder="Enter mobile number"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password {!user && "*"}
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => handleFormChange("password", e.target.value)}
          className="input-field"
          placeholder={user ? "Leave empty to keep current" : "Enter password"}
          disabled={isSubmitting}
          required={!user}
        />
        {user && (
          <p className="text-xs text-gray-500 mt-1">
            Leave empty to keep current password
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Role *
        </label>
        <select
          value={formData.role}
          onChange={(e) => handleFormChange("role", e.target.value)}
          className="input-field"
          disabled={isSubmitting}
          required
        >
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary flex-1"
        >
          {isSubmitting
            ? user
              ? "Updating..."
              : "Creating..."
            : user
              ? "Update User"
              : "Create User"}
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

export default Users;
