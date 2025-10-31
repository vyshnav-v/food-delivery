import { Request } from "express";

export interface PaginationOptions {
  page: number;
  limit: number;
  sort: string;
  order: "asc" | "desc";
}

export interface PaginationResult<T> {
  data: T[];
  count: number;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const getPaginationParams = (req: Request): PaginationOptions => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(
    100,
    Math.max(1, parseInt(req.query.limit as string) || 10)
  );
  const sort = (req.query.sort as string) || "createdAt";
  const order = (req.query.order as "asc" | "desc") === "asc" ? "asc" : "desc";

  return { page, limit, sort, order };
};

export const getPaginationSkip = (page: number, limit: number): number => {
  return (page - 1) * limit;
};

export const formatPaginationResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginationResult<T> => {
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    count: total,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};
