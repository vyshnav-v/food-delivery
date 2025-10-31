import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useRole } from "../hooks/useRole";
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Grid,
  Users,
  LogOut,
  Menu,
  X,
  AlertTriangle,
  Utensils,
  ChevronDown,
  UserCircle,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import AdminBadge from "../components/AdminBadge";
import Modal from "../components/Modal";

const MainLayout = () => {
  const { user, logout } = useAuthStore();
  const { isAdmin } = useRole();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate("/login");
  };

  const navItems = [
    {
      path: "/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      roles: ["admin", "customer"],
    },
    {
      path: "/products",
      icon: ShoppingBag,
      label: "Products",
      roles: ["admin"],
    },
    {
      path: "/orders",
      icon: ShoppingCart,
      label: "Orders",
      roles: ["admin", "customer"],
    },
    {
      path: "/categories",
      icon: Grid,
      label: "Categories",
      roles: ["admin"],
    },
    {
      path: "/users",
      icon: Users,
      label: "Users",
      roles: ["admin"],
    },
  ];

  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(user?.role || "customer")
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm fixed w-full top-0 z-30 h-20">
        <div className="flex items-center justify-between px-4 py-4 h-full">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary-700 rounded-lg">
                <Utensils className="text-white" size={24} />
              </div>
              <h1 className="text-xl font-bold text-primary-700 hidden sm:block">
                Food Delivery Admin
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="font-semibold text-gray-900">
                    {user?.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{user?.email}</span>
                    {isAdmin && <AdminBadge />}
                  </div>
                </div>
                <ChevronDown
                  size={20}
                  className={`text-gray-400 transition-transform ${
                    showProfileDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-slideDown">
                  {/* User Info (visible on mobile) */}
                  <div className="sm:hidden px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                    {isAdmin && (
                      <div className="mt-2">
                        <AdminBadge />
                      </div>
                    )}
                  </div>

                  {/* Profile Option */}
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      // Navigate to profile page if you have one
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <UserCircle size={20} className="text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Profile
                      </p>
                      <p className="text-xs text-gray-500">View your profile</p>
                    </div>
                  </button>

                  {/* Logout Option */}
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      handleLogoutClick();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left border-t border-gray-100"
                  >
                    <LogOut size={20} className="text-red-600" />
                    <div>
                      <p className="text-sm font-medium text-red-600">Logout</p>
                      <p className="text-xs text-gray-500">
                        Sign out of your account
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-20 bottom-0 w-64 bg-white border-r border-gray-200 transition-transform duration-300 z-20 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <nav className="p-4 space-y-1">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-primary-700 text-white shadow-md"
                    : "text-gray-700 hover:bg-primary-50 hover:text-primary-700"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 mt-20 p-6">
        <Outlet />
      </main>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10 lg:hidden animate-fadeIn"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Confirm Logout"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="text-yellow-600" size={24} />
            <p className="text-gray-700">Are you sure you want to logout?</p>
          </div>

          <div className="flex gap-3">
            <button onClick={confirmLogout} className="btn-danger flex-1">
              <LogOut size={20} className="inline mr-2" />
              Yes, Logout
            </button>
            <button
              onClick={() => setShowLogoutModal(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MainLayout;
