import {
  Users,
  ShoppingBag,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Package,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import { dashboardService } from "../services/dashboardService";
import LoadingSkeleton from "../components/LoadingSkeleton";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import { useFetch } from "../hooks";
import { format } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: {
    pending: number;
    confirmed: number;
    delivered: number;
    cancelled: number;
  };
  recentOrders: Array<{
    _id: string;
    user: {
      name: string;
      email: string;
    };
    totalAmount: number;
    status: string;
    orderDate: string;
    createdAt: string;
  }>;
}

const Dashboard = () => {
  const { user } = useAuthStore();

  const { data: stats, isLoading } = useFetch<DashboardStats>({
    fetchFn: dashboardService.getStats,
    dependencies: [],
  });

  const statCards = [
    {
      icon: Users,
      label: "Total Customers",
      value: stats?.totalUsers || 0,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: ShoppingBag,
      label: "Products",
      value: stats?.totalProducts || 0,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      icon: ShoppingCart,
      label: "Total Orders",
      value: stats?.totalOrders || 0,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: `$${(stats?.totalRevenue || 0).toFixed(2)}`,
      color: "text-primary-700",
      bgColor: "bg-primary-50",
      gradient: "from-primary-600 to-primary-700",
    },
  ];

  // Order Status Chart Data
  const orderStatusChartData = {
    labels: ["Pending", "Confirmed", "Delivered", "Cancelled"],
    datasets: [
      {
        label: "Orders by Status",
        data: [
          stats?.ordersByStatus?.pending || 0,
          stats?.ordersByStatus?.confirmed || 0,
          stats?.ordersByStatus?.delivered || 0,
          stats?.ordersByStatus?.cancelled || 0,
        ],
        backgroundColor: [
          "rgba(251, 191, 36, 0.8)", // Yellow for pending
          "rgba(59, 130, 246, 0.8)", // Blue for confirmed
          "rgba(34, 197, 94, 0.8)", // Green for delivered
          "rgba(239, 68, 68, 0.8)", // Red for cancelled
        ],
        borderColor: [
          "rgba(251, 191, 36, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(34, 197, 94, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  // Order Status Bar Chart
  const orderStatusBarData = {
    labels: ["Pending", "Confirmed", "Delivered", "Cancelled"],
    datasets: [
      {
        label: "Number of Orders",
        data: [
          stats?.ordersByStatus?.pending || 0,
          stats?.ordersByStatus?.confirmed || 0,
          stats?.ordersByStatus?.delivered || 0,
          stats?.ordersByStatus?.cancelled || 0,
        ],
        backgroundColor: [
          "rgba(251, 191, 36, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderColor: [
          "rgba(251, 191, 36, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(34, 197, 94, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Here's what's happening with your food delivery business today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <LoadingSkeleton count={4} type="card" />
        ) : (
          statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="card-hover relative overflow-hidden">
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">
                      {stat.label}
                    </p>
                    <p className="text-4xl font-bold text-gray-900 mt-3">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-4 rounded-xl shadow-sm`}>
                    <Icon className={stat.color} size={36} />
                  </div>
                </div>
                <div
                  className={`absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-full -mr-8 -mb-8`}
                ></div>
              </div>
            );
          })
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Doughnut Chart */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Orders by Status
          </h2>
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500">Loading chart...</p>
            </div>
          ) : stats && stats.totalOrders > 0 ? (
            <div className="h-64">
              <Doughnut
                data={orderStatusChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                  },
                }}
              />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <Package className="mx-auto text-gray-400 mb-2" size={48} />
                <p className="text-gray-500">No orders yet</p>
              </div>
            </div>
          )}
        </div>

        {/* Order Status Bar Chart */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Order Statistics
          </h2>
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500">Loading chart...</p>
            </div>
          ) : (
            <div className="h-64">
              <Bar
                data={orderStatusBarData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0,
                      },
                    },
                  },
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
          <TrendingUp className="text-gray-400" size={24} />
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-4 text-gray-500">Loading...</div>
          ) : stats && stats.recentOrders && stats.recentOrders.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order._id.slice(-6)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.user.name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(
                        new Date(order.createdAt || order.orderDate),
                        "MMM dd, yyyy"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Clock className="mx-auto mb-2" size={48} />
              <p>No recent orders</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.ordersByStatus?.pending || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Confirmed Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.ordersByStatus?.confirmed || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Delivered Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.ordersByStatus?.delivered || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg. Order Value</p>
              <p className="text-2xl font-bold text-gray-900">
                $
                {stats && stats.totalOrders > 0
                  ? (stats.totalRevenue / stats.totalOrders).toFixed(2)
                  : "0.00"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
