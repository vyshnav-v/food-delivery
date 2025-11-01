import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/database";

// Import middleware
import { errorHandler, notFound } from "./middleware/errorHandler";

// Import routes - FOOD DELIVERY ADMIN PANEL
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import categoryRoutes from "./routes/categories";
import productRoutes from "./routes/products";
import orderRoutes from "./routes/orders";
import dashboardRoutes from "./routes/dashboard";

dotenv.config();

const app: Application = express();

// Connect to MongoDB
connectDB();

// Resolve API prefix and version from environment variables
const apiPrefix = (process.env.API_PREFIX || "/api").replace(/\/+$/, "");
const apiVersionValue = process.env.API_VERSION
  ? `/${process.env.API_VERSION.replace(/^\/+|\/+$/g, "")}`
  : "";
const apiBasePath = `${apiPrefix}${apiVersionValue}`;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Basic health check route
app.get(`${apiBasePath}/health`, (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    message: "Food Delivery Admin API is running",
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
app.use(`${apiBasePath}/auth`, authRoutes);
app.use(`${apiBasePath}/users`, userRoutes);
app.use(`${apiBasePath}/categories`, categoryRoutes);
app.use(`${apiBasePath}/products`, productRoutes);
app.use(`${apiBasePath}/orders`, orderRoutes);
app.use(`${apiBasePath}/dashboard`, dashboardRoutes);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
