import express from "express";
import { body } from "express-validator";
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import { authenticate } from "../middleware/auth";
import { isAdmin } from "../middleware/roleCheck";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Validation rules
const userValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3 and 50 characters"),
  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("mobile")
    .optional()
    .trim()
    .matches(/^[0-9]{10,15}$/)
    .withMessage("Please provide a valid mobile number"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .optional()
    .isIn(["admin", "customer"])
    .withMessage("Role must be either admin or customer"),
];

const updateUserValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3 and 50 characters"),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("mobile")
    .optional()
    .trim()
    .matches(/^[0-9]{10,15}$/)
    .withMessage("Please provide a valid mobile number"),
  body("role")
    .optional()
    .isIn(["admin", "customer"])
    .withMessage("Role must be either admin or customer"),
];

// Routes - Admin only operations
router
  .route("/")
  .get(isAdmin, getAllUsers)
  .post(isAdmin, userValidation, createUser);

router
  .route("/:id")
  .get(isAdmin, getUser)
  .put(isAdmin, updateUserValidation, updateUser)
  .delete(isAdmin, deleteUser);

export default router;
