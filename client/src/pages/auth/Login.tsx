import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import toast from "react-hot-toast";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Utensils,
  ShoppingBag,
  TrendingUp,
  Users,
  ChefHat,
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Clear previous errors
    setErrors({ email: "", password: "" });

    // Validate form
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      await login(formData.email, formData.password);
      toast.success("Login successful! Redirecting...");
      setIsRedirecting(true);

      // Small delay to show the success message
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (error: unknown) {
      console.error("Login error:", error);

      const errorMessage =
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Invalid email or password. Please try again.";

      toast.error(errorMessage, {
        duration: 4000,
        position: "top-center",
      });

      setErrors({
        email: errorMessage.toLowerCase().includes("email") ? errorMessage : "",
        password:
          errorMessage.toLowerCase().includes("password") ||
          errorMessage.toLowerCase().includes("credential")
            ? errorMessage
            : "Invalid credentials",
      });
    } finally {
      setIsRedirecting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for this field when user starts typing
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Brand & Info (Hidden on mobile, visible on lg+) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 flex-col justify-between p-12 text-white relative overflow-hidden bg-[#03524e]">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3 mb-16">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Utensils size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold">Food Delivery Admin</h1>
          </div>

          {/* Main Description */}
          <div className="space-y-6 max-w-md">
            <h2 className="text-4xl font-bold leading-tight">
              Manage Your Food Delivery Business with Ease
            </h2>
            <p className="text-lg text-white/80 leading-relaxed">
              A comprehensive admin panel to streamline your food delivery
              operations. Track orders, manage products, monitor customers, and
              grow your business.
            </p>

            {/* Features */}
            <div className="space-y-4 mt-12">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <h3 className="font-semibold">Product Management</h3>
                  <p className="text-sm text-white/70">
                    Easily manage your menu and inventory
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h3 className="font-semibold">Real-time Analytics</h3>
                  <p className="text-sm text-white/70">
                    Track sales and performance metrics
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="font-semibold">Customer Insights</h3>
                  <p className="text-sm text-white/70">
                    Understand your customer base better
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-white/60 text-sm">
          <p>&copy; 2024 Food Delivery Admin. All rights reserved.</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: "rgb(3, 82, 78)" }}
            >
              <Utensils size={24} className="text-white" />
            </div>
            <h1
              className="text-2xl font-bold"
              style={{ color: "rgb(3, 82, 78)" }}
            >
              Food Delivery Admin
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                style={{ backgroundColor: "rgba(3, 82, 78, 0.1)" }}
              >
                <ChefHat size={32} style={{ color: "rgb(3, 82, 78)" }} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-gray-600 mt-2">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`input-field pl-10 ${
                      errors.email ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                    placeholder="you@example.com"
                    disabled={isLoading || isRedirecting}
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                    <AlertCircle size={14} />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`input-field pl-10 pr-10 ${
                      errors.password ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                    placeholder="••••••••"
                    disabled={isLoading || isRedirecting}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isLoading || isRedirecting}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                    <AlertCircle size={14} />
                    <span>{errors.password}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || isRedirecting}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white font-medium transition-all duration-200 hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: "rgb(3, 82, 78)" }}
              >
                {isLoading || isRedirecting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>
                      {isRedirecting ? "Redirecting..." : "Signing in..."}
                    </span>
                  </>
                ) : (
                  <>
                    <ChefHat size={20} />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium hover:underline"
                  style={{ color: "rgb(3, 82, 78)" }}
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
