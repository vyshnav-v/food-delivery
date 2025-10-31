import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";

/**
 * Middleware to check if user has specific role(s)
 * @param roles - Array of allowed roles
 */
export const checkRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action",
      });
      return;
    }

    next();
  };
};

/**
 * Middleware to check if user is admin
 */
export const isAdmin = checkRole("admin");

/**
 * Middleware to check if user is customer
 */
export const isCustomer = checkRole("customer");

/**
 * Middleware to check if user is admin or customer
 */
export const isAdminOrCustomer = checkRole("admin", "customer");
