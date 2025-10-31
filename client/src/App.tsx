import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./stores/authStore";
import { Loader2 } from "lucide-react";

// Layouts
import MainLayout from "./layouts/MainLayout.tsx";
import AuthLayout from "./layouts/AuthLayout.tsx";

// Auth Pages
import Login from "./pages/auth/Login.tsx";
import Register from "./pages/auth/Register.tsx";

// Main Pages
import Dashboard from "./pages/Dashboard.tsx";
import Products from "./pages/Products.tsx";
import Orders from "./pages/Orders.tsx";
import Categories from "./pages/Categories.tsx";
import Users from "./pages/Users.tsx";
import NotFound from "./pages/NotFound.tsx";

function App() {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      setIsInitializing(false);
    };

    initAuth();
  }, [checkAuth]);

  // Show loading while checking authentication
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2
            size={48}
            className="animate-spin text-primary-600 mx-auto mb-4"
          />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route
              path="/login"
              element={
                !isAuthenticated ? <Login /> : <Navigate to="/dashboard" />
              }
            />
            <Route
              path="/register"
              element={
                !isAuthenticated ? <Register /> : <Navigate to="/dashboard" />
              }
            />
          </Route>

          {/* Protected Routes */}
          <Route
            element={
              isAuthenticated ? <MainLayout /> : <Navigate to="/login" />
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/users" element={<Users />} />
          </Route>

          {/* Default Redirect */}
          <Route
            path="/"
            element={
              <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />
            }
          />

          {/* 404 Not Found - Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>

      <Toaster position="top-right" />
    </>
  );
}

export default App;
