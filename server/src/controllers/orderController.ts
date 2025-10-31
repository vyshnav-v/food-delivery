import { Response } from "express";
import Order from "../models/Order";
import Product from "../models/Product";
import { AuthRequest } from "../types";

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
export const getAllOrders = async (
  _req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const orders = await Order.find()
      .populate("user", "name email mobile")
      .populate("items.product", "name price imageUrl")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
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
