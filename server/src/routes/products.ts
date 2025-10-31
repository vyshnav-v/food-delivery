import express from "express";
import {
  getProducts,
  getProduct,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import { authenticate } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/search", searchProducts);
router.get("/:id", getProduct);

// Protected routes (require authentication)
router.post("/", authenticate, upload.array("image", 5), createProduct);
router.put("/:id", authenticate, upload.array("image", 5), updateProduct);
router.delete("/:id", authenticate, deleteProduct);

// Image upload route (optional - if you want to upload image separately)
router.post(
  "/:id/upload-image",
  authenticate,
  upload.single("image"),
  async (req: express.Request, res: express.Response) => {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: "No file uploaded" });
        return;
      }

      const product =
        await require("../models/Product").default.findByIdAndUpdate(
          req.params.id,
          { imageUrl: `/uploads/${req.file.filename}` },
          { new: true }
        );

      if (!product) {
        res.status(404).json({ success: false, message: "Product not found" });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Image uploaded successfully",
        data: product,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error uploading image",
        error: error.message,
      });
    }
  }
);

export default router;
