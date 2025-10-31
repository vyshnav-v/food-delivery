import { useNavigate } from "react-router-dom";
import {
  Home,
  Search,
  ArrowLeft,
  AlertTriangle,
  LayoutDashboard,
  CheckSquare,
  BookOpen,
  ShoppingBag,
} from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-primary-200 select-none">
            404
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <AlertTriangle size={80} className="text-primary-400" />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary flex items-center gap-2 min-w-[200px]"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
          <button
            onClick={() => navigate("/")}
            className="btn-primary flex items-center gap-2 min-w-[200px]"
          >
            <Home size={20} />
            Go to Home
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 p-6 bg-white rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center gap-2">
            <Search size={20} />
            Looking for something?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-4 bg-gray-50 rounded-lg hover:bg-primary-50 hover:border-primary-200 border-2 border-transparent transition-all flex flex-col items-center gap-2"
            >
              <LayoutDashboard size={32} className="text-primary-600" />
              <span className="text-sm font-medium text-gray-700">
                Dashboard
              </span>
            </button>
            <button
              onClick={() => navigate("/tasks")}
              className="p-4 bg-gray-50 rounded-lg hover:bg-primary-50 hover:border-primary-200 border-2 border-transparent transition-all flex flex-col items-center gap-2"
            >
              <CheckSquare size={32} className="text-primary-600" />
              <span className="text-sm font-medium text-gray-700">Tasks</span>
            </button>
            <button
              onClick={() => navigate("/blog")}
              className="p-4 bg-gray-50 rounded-lg hover:bg-primary-50 hover:border-primary-200 border-2 border-transparent transition-all flex flex-col items-center gap-2"
            >
              <BookOpen size={32} className="text-primary-600" />
              <span className="text-sm font-medium text-gray-700">Blog</span>
            </button>
            <button
              onClick={() => navigate("/products")}
              className="p-4 bg-gray-50 rounded-lg hover:bg-primary-50 hover:border-primary-200 border-2 border-transparent transition-all flex flex-col items-center gap-2"
            >
              <ShoppingBag size={32} className="text-primary-600" />
              <span className="text-sm font-medium text-gray-700">
                Products
              </span>
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="mt-8 text-sm text-gray-500">
          Error ID: {Math.random().toString(36).substring(7)}
        </p>
      </div>
    </div>
  );
};

export default NotFound;
