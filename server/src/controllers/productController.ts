import { Request, Response } from "express";
import Product from "../models/Product";
import {
  getPaginationParams,
  getPaginationSkip,
  formatPaginationResponse,
} from "../utils/pagination";
import { AuthRequest } from "../types";

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { page, limit } = getPaginationParams(req);
    const skip = getPaginationSkip(page, limit);

    // Handle sort parameter (can be "name", "-name", "price", "-price", etc.)
    let sortField = "createdAt";
    let sortOrder = -1; // Default: newest first

    if (req.query.sort) {
      const sortParam = req.query.sort as string;
      if (sortParam.startsWith("-")) {
        sortField = sortParam.substring(1);
        sortOrder = -1; // Descending
      } else {
        sortField = sortParam;
        sortOrder = 1; // Ascending
      }
    }

    // Build filter
    const filter: any = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.featured) filter.featured = req.query.featured === "true";
    if (req.query.status && req.query.status !== "all") {
      filter.status = req.query.status;
    }
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice)
        filter.price.$gte = parseFloat(req.query.minPrice as string);
      if (req.query.maxPrice)
        filter.price.$lte = parseFloat(req.query.maxPrice as string);
    }
    if (req.query.search) {
      const searchTerm = (req.query.search as string).trim();
      if (searchTerm.length) {
        const escaped = searchTerm.replace(/[.*+?^${}()|\[\]\\]/g, "\\$&");
        const regex = new RegExp(escaped, "i");
        filter.$or = [{ name: regex }, { description: regex }];
      }
    }

    const total = await Product.countDocuments(filter);

    // Build sort object
    const sortObj: Record<string, 1 | -1> = {};
    sortObj[sortField] = sortOrder as 1 | -1;

    const products = await Product.find(filter)
      .populate("category", "name description")
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    const response = formatPaginationResponse(products, total, page, limit);
    res.status(200).json({ success: true, ...response });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

export const getProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name description"
    );
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }
    res.status(200).json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
};

export const searchProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const query = req.query.q as string;
    if (!query) {
      res
        .status(400)
        .json({ success: false, message: "Search query is required" });
      return;
    }

    const products = await Product.find({ $text: { $search: query } })
      .limit(10)
      .select("name price category");

    res.status(200).json({ success: true, data: products });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error searching products",
      error: error.message,
    });
  }
};

export const createProduct = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, description, price, category, stock, imageUrl, status } =
      req.body;

    let processedImageUrl = imageUrl;
    const files = req.files as Express.Multer.File[] | undefined;

    if (files && files.length > 0) {
      const file = files[0];
      processedImageUrl = `/uploads/${file.filename}`;
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      imageUrl: processedImageUrl,
      status,
    });

    const populatedProduct = await Product.findById(product._id).populate(
      "category",
      "name description"
    );

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: populatedProduct,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error creating product",
      error: error.message,
    });
  }
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updateData: any = {
      ...req.body,
    };

    const files = req.files as Express.Multer.File[] | undefined;

    if (files && files.length > 0) {
      const file = files[0];
      updateData.imageUrl = `/uploads/${file.filename}`;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate("category", "name description");

    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
};
