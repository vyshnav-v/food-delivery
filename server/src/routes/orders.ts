import express from "express";
import { body } from "express-validator";
import {
  getAllOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController";
import { authenticate } from "../middleware/auth";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Validation rules
const orderValidation = [
  body("user").notEmpty().withMessage("User is required"),
  body("items")
    .isArray({ min: 1 })
    .withMessage("Items must be an array with at least one item"),
  body("items.*.product").notEmpty().withMessage("Product ID is required"),
  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
];

const updateOrderValidation = [
  body("status")
    .isIn(["pending", "confirmed", "delivered", "cancelled"])
    .withMessage("Invalid status"),
];

// Routes
router.route("/").get(getAllOrders).post(orderValidation, createOrder);

router
  .route("/:id")
  .get(getOrder)
  .put(updateOrderValidation, updateOrderStatus)
  .delete(deleteOrder);

export default router;
