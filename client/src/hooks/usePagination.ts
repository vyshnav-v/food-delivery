import { useState } from "react";

interface UsePaginationOptions {
  initialPage?: number;
  pageSize?: number;
}

/**
 * Custom hook for managing pagination state and logic
 */
export function usePagination({
  initialPage = 1,
  pageSize = 10,
}: UsePaginationOptions = {}) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(pageSize);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);
  const goToFirst = () => goToPage(1);
  const goToLast = () => goToPage(totalPages);

  const updateTotalCount = (count: number) => {
    setTotalCount(count);
    setTotalPages(Math.max(1, Math.ceil(count / limit)));
  };

  const setPageSize = (newLimit: number) => {
    if (Number.isNaN(newLimit) || newLimit <= 0 || newLimit === limit) return;
    setLimit(newLimit);
    setCurrentPage(1);
    if (totalCount > 0) {
      setTotalPages(Math.max(1, Math.ceil(totalCount / newLimit)));
    }
  };

  const reset = () => {
    setCurrentPage(initialPage);
    setTotalPages(1);
    setTotalCount(0);
    setLimit(pageSize);
  };

  return {
    currentPage,
    totalPages,
    totalCount,
    pageSize: limit,
    goToPage,
    nextPage,
    prevPage,
    goToFirst,
    goToLast,
    setCurrentPage,
    setTotalPages,
    updateTotalCount,
    setPageSize,
    reset,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
}
