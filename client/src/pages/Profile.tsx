import { useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { authService } from "../services/authService";
import { UserCircle, Mail, Phone, Shield, Edit2, Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import AdminBadge from "../components/AdminBadge";

interface ProfileFormData {
  name: string;
  email: string;
  mobile: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const Profile = () => {
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      mobile: user?.mobile || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      // Prepare update payload
      const updatePayload: any = {
        name: data.name,
        email: data.email,
        mobile: data.mobile,
      };

      // If changing password
      if (data.newPassword && data.newPassword.trim()) {
        if (!data.currentPassword) {
          toast.error("Current password is required to change password");
          setIsLoading(false);
          return;
        }
        updatePayload.password = data.newPassword;
      }

      // Update user profile
      const response = await authService.updateProfile(updatePayload);

      if (response.success && response.data) {
        // Update local user state
        setUser(response.data);
        toast.success("Profile updated successfully!");
        setIsEditing(false);

        // Reset password fields
        reset({
          name: response.data.name,
          email: response.data.email,
          mobile: response.data.mobile || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset({
      name: user?.name || "",
      email: user?.email || "",
      mobile: user?.mobile || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">
            Manage your account information and settings
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Edit2 size={18} />
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile Card */}
      <div className="card">
        {/* Profile Header */}
        <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
          <div className="w-24 h-24 bg-linear-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center text-white font-bold text-4xl shadow-lg">
            {user.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-600 mt-1">{user.email}</p>
            <div className="mt-2">
              {user.role === "admin" ? (
                <AdminBadge />
              ) : (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                  Customer
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <UserCircle size={20} className="text-primary-600" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 3,
                      message: "Name must be at least 3 characters",
                    },
                  })}
                  disabled={!isEditing || isLoading}
                  className={`input-field ${!isEditing ? "bg-gray-50" : ""}`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Mail size={16} />
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  disabled={!isEditing || isLoading}
                  className={`input-field ${!isEditing ? "bg-gray-50" : ""}`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Phone size={16} />
                  Mobile Number
                </label>
                <input
                  type="tel"
                  {...register("mobile", {
                    pattern: {
                      value: /^[0-9]{10,15}$/,
                      message: "Please enter a valid mobile number",
                    },
                  })}
                  disabled={!isEditing || isLoading}
                  className={`input-field ${!isEditing ? "bg-gray-50" : ""}`}
                  placeholder="Enter your mobile number"
                />
                {errors.mobile && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.mobile.message}
                  </p>
                )}
              </div>

              {/* Role (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Shield size={16} />
                  Account Role
                </label>
                <input
                  type="text"
                  value={user.role === "admin" ? "Administrator" : "Customer"}
                  disabled
                  className="input-field bg-gray-50 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Change Password Section (only when editing) */}
          {isEditing && (
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Change Password (Optional)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current Password */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    {...register("currentPassword")}
                    disabled={isLoading}
                    className="input-field"
                    placeholder="Enter current password"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Required only if changing password
                  </p>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    {...register("newPassword", {
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    disabled={isLoading}
                    className="input-field"
                    placeholder="Enter new password"
                  />
                  {errors.newPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    {...register("confirmPassword", {
                      validate: (value) =>
                        !newPassword ||
                        value === newPassword ||
                        "Passwords do not match",
                    })}
                    disabled={isLoading}
                    className="input-field"
                    placeholder="Confirm new password"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                className="btn-secondary flex items-center gap-2"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          )}
        </form>

        {/* Account Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Account ID:</span>
              <p className="font-mono text-gray-900 mt-1">{user._id}</p>
            </div>
            <div>
              <span className="text-gray-500">Member Since:</span>
              <p className="text-gray-900 mt-1">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
