import { Response } from "express";
import { validationResult } from "express-validator";
import Category from "../models/Category";
import Product from "../models/Product";
import { AuthRequest } from "../types";
import {
  formatPaginationResponse,
  getPaginationParams,
  getPaginationSkip,
} from "../utils/pagination";

// @desc    Get all categories
// @route   GET /api/categories
// @access  Private
export const getCategories = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { page, limit, sort, order } = getPaginationParams(req);
    const skip = getPaginationSkip(page, limit);

    const search = (req.query.search as string) || "";
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;
    const includeProductCount = req.query.includeProductCount === "true";

    const filter: Record<string, unknown> = {};

    if (search) {
      const regex = new RegExp(
        search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );
      filter.$or = [{ name: regex }, { description: regex }];
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        (filter.createdAt as Record<string, Date>).$gte = new Date(startDate);
      }
      if (endDate) {
        (filter.createdAt as Record<string, Date>).$lte = new Date(endDate);
      }
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

    const total = await Category.countDocuments(filter);

    const categories = await Category.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean();

    let data = categories as Array<Record<string, any>>;

    if (includeProductCount && categories.length > 0) {
      const categoryIds = categories.map((category) => category._id);

      const counts = await Product.aggregate([
        { $match: { category: { $in: categoryIds } } },
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
          },
        },
      ]);

      const countMap = new Map(
        counts.map((entry) => [entry._id.toString(), entry.count as number])
      );

      data = categories.map((category) => ({
        ...category,
        productCount: countMap.get(category._id.toString()) || 0,
      }));
    }

    const response = formatPaginationResponse(data, total, page, limit);

    res.status(200).json({
      success: true,
      ...response,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: error.message,
    });
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Private
export const getCategory = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404).json({
        success: false,
        message: "Category not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching category",
      error: error.message,
    });
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private
export const createCategory = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const { name, description } = req.body;

    // Check if category with same name already exists
    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      res.status(400).json({
        success: false,
        message: "Category with this name already exists",
      });
      return;
    }

    const category = await Category.create({
      name,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error creating category",
      error: error.message,
    });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private
export const updateCategory = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, description } = req.body;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!category) {
      res.status(404).json({
        success: false,
        message: "Category not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error updating category",
      error: error.message,
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
export const deleteCategory = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      res.status(404).json({
        success: false,
        message: "Category not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error deleting category",
      error: error.message,
    });
  }
};
