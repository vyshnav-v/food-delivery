import { Response } from "express";
import { Types } from "mongoose";

import Order from "../models/Order";
import Product from "../models/Product";
import User from "../models/User";
import { AuthRequest } from "../types";
import {
  getPaginationParams,
  getPaginationSkip,
  formatPaginationResponse,
} from "../utils/pagination";

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
export const getAllOrders = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { page, limit, sort, order } = getPaginationParams(req);
    const skip = getPaginationSkip(page, limit);

    const search = (req.query.search as string) || "";
    const status = (req.query.status as string) || "";
    const userId = (req.query.userId as string) || "";

    const filter: Record<string, any> = {};

    if (status) {
      filter.status = status;
    }

    if (userId && Types.ObjectId.isValid(userId)) {
      filter.user = new Types.ObjectId(userId);
    }

    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "i");

      const matchingUsers = await User.find({
        $or: [{ name: regex }, { email: regex }, { mobile: regex }],
      })
        .select("_id")
        .lean();

      const orConditions: any[] = [
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$_id" },
              regex,
            },
          },
        },
      ];

      if (matchingUsers.length > 0) {
        orConditions.push({
          user: {
            $in: matchingUsers.map((user) => user._id),
          },
        });
      }

      filter.$or = orConditions;
    }

    let sortField = sort;
    let sortOrder: 1 | -1 = order === "asc" ? 1 : -1;

    if (!sort && order === "desc") {
      sortField = "createdAt";
      sortOrder = -1;
    }

    const allowedSortFields = new Set([
      "createdAt",
      "orderDate",
      "totalAmount",
      "status",
    ]);

    if (!allowedSortFields.has(sortField)) {
      sortField = "createdAt";
    }

    const sortObj: Record<string, 1 | -1> = {
      [sortField]: sortOrder,
    };

    const [orders, total, statsAggregation] = await Promise.all([
      Order.find(filter)
        .populate("user", "name email mobile")
        .populate("items.product", "name price imageUrl")
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter),
      Order.aggregate([
        Object.keys(filter).length ? { $match: filter } : { $match: {} },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            revenue: {
              $sum: {
                $cond: [{ $eq: ["$status", "cancelled"] }, 0, "$totalAmount"],
              },
            },
          },
        },
      ]),
    ]);

    const stats = statsAggregation.reduce(
      (
        acc: {
          totalOrders: number;
          totalRevenue: number;
          byStatus: Record<string, number>;
        },
        curr
      ) => {
        acc.totalOrders += curr.count || 0;
        acc.totalRevenue += curr.revenue || 0;
        acc.byStatus[curr._id as string] = curr.count || 0;
        return acc;
      },
      {
        totalOrders: 0,
        totalRevenue: 0,
        byStatus: {
          pending: 0,
          confirmed: 0,
          delivered: 0,
          cancelled: 0,
        },
      }
    );

    const response = formatPaginationResponse(orders, total, page, limit);

    res.status(200).json({
      success: true,
      ...response,
      stats,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email mobile")
      .populate("items.product", "name price imageUrl");

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching order",
      error: error.message,
    });
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { user: userId, items } = req.body;

    // Validate input
    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({
        success: false,
        message: "User and items are required",
      });
      return;
    }

    // Validate and calculate total amount
    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`,
        });
        return;
      }

      // Check stock availability
      if (product.stock < item.quantity) {
        res.status(400).json({
          success: false,
          message: `Insufficient stock for product: ${product.name}`,
        });
        return;
      }

      // Use the current product price
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      validatedItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Create order
    const order = await Order.create({
      user: userId,
      items: validatedItems,
      totalAmount,
      orderDate: new Date(),
    });

    // Populate order details
    const populatedOrder = await Order.findById(order._id)
      .populate("user", "name email mobile")
      .populate("items.product", "name price imageUrl");

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: populatedOrder,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error.message,
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private
export const updateOrderStatus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "delivered", "cancelled"];
    if (!status || !validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message:
          "Invalid status. Valid values: pending, confirmed, delivered, cancelled",
      });
      return;
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }

    order.status = status;
    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate("user", "name email mobile")
      .populate("items.product", "name price imageUrl");

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: updatedOrder,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error updating order status",
      error: error.message,
    });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private (Admin only)
export const deleteOrder = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }

    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error deleting order",
      error: error.message,
    });
  }
};
