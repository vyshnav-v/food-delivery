import { Response } from "express";
import User from "../models/User";
import { AuthRequest } from "../types";
import {
  formatPaginationResponse,
  getPaginationParams,
  getPaginationSkip,
} from "../utils/pagination";

// @desc    Get all users
// @route   GET /api/users
// @access  Private
export const getAllUsers = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { page, limit, sort, order } = getPaginationParams(req);
    const skip = getPaginationSkip(page, limit);

    const search = (req.query.search as string) || "";
    const role = req.query.role as string | undefined;

    const filter: Record<string, unknown> = {};

    if (search) {
      const regex = new RegExp(
        search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );
      filter.$or = [{ name: regex }, { email: regex }, { mobile: regex }];
    }

    if (role) {
      filter.role = role;
    }

    let sortField = sort;
    let sortOrder: 1 | -1 = order === "asc" ? 1 : -1;

    if (sort.startsWith("-")) {
      sortField = sort.substring(1);
      sortOrder = -1;
    }

    const sortObj: Record<string, 1 | -1> = {
      [sortField]: sortOrder,
    };

    const total = await User.countDocuments(filter);

    const users = await User.find(filter)
      .select("-password")
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean();

    const [adminCount, customerCount] = await Promise.all([
      User.countDocuments({ ...filter, role: "admin" }),
      User.countDocuments({ ...filter, role: "customer" }),
    ]);

    const response = formatPaginationResponse(users, total, page, limit);

    res.status(200).json({
      success: true,
      ...response,
      stats: {
        total,
        admins: adminCount,
        customers: customerCount,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
export const getUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message,
    });
  }
};

// @desc    Create new user
// @route   POST /api/users
// @access  Private (Admin only)
export const createUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, email, mobile, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
      return;
    }

    // Set default password if not provided
    const userPassword = password || "Welcome@123";

    // Create user
    const user = await User.create({
      name,
      email,
      mobile,
      password: userPassword,
      role: role || "customer",
    });

    // Return user without password
    const userWithoutPassword = await User.findById(user._id).select(
      "-password"
    );

    res.status(201).json({
      success: true,
      message: password
        ? "User created successfully"
        : "User created successfully with default password (Welcome@123)",
      data: userWithoutPassword,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: error.message,
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin only)
export const updateUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, email, mobile, role } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: req.params.id },
      });

      if (existingUser) {
        res.status(400).json({
          success: false,
          message: "Email already taken",
        });
        return;
      }
    }

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (mobile !== undefined) user.mobile = mobile;
    if (role) user.role = role;

    await user.save();

    const updatedUser = await User.findById(user._id).select("-password");

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: error.message,
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
export const deleteUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
};
