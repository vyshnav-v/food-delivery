import { ChevronLeft, ChevronRight } from "lucide-react";
import classNames from "classnames";
import React, { useCallback, useEffect, useMemo, useState } from "react";

interface PaginationProps {
  total: number;
  displayTotal?: boolean;
  pageSize?: number;
  className?: string;
  currentPage?: number;
  onChange?: (page: number) => void;
  onlyArrow?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  total,
  displayTotal = false,
  pageSize = 10,
  className,
  currentPage = 1,
  onChange,
}) => {
  const [paginationTotal, setPaginationTotal] = useState(total);
  const [internalPageSize, setInternalPageSize] = useState(pageSize);
  const [internalCurrentPage, setInternalCurrentPage] = useState(currentPage);

  const getInternalPageCount = useMemo(() => {
    return Math.ceil(paginationTotal / internalPageSize);
  }, [paginationTotal, internalPageSize]);

  const getValidCurrentPage = useCallback(
    (count: number) => {
      const value = parseInt(count.toString(), 10);
      const internalPageCount = getInternalPageCount;
      let resetValue;
      if (value < 1) resetValue = 1;
      if (value > internalPageCount) resetValue = internalPageCount;
      return resetValue ?? value;
    },
    [getInternalPageCount]
  );

  useEffect(() => {
    setPaginationTotal(total);
    setInternalPageSize(pageSize);
    setInternalCurrentPage(getValidCurrentPage(currentPage));
  }, [total, pageSize, currentPage, getValidCurrentPage]);

  const onPaginationChange = useCallback(
    (val: number) => {
      const newPage = getValidCurrentPage(val);
      setInternalCurrentPage(newPage);
      onChange?.(newPage);
    },
    [getValidCurrentPage, onChange]
  );

  const onPrev = useCallback(() => {
    const newPage = internalCurrentPage - 1;
    onPaginationChange(newPage);
  }, [internalCurrentPage, onPaginationChange]);

  const onNext = useCallback(() => {
    const newPage = internalCurrentPage + 1;
    onPaginationChange(newPage);
  }, [internalCurrentPage, onPaginationChange]);

  const onFirst = useCallback(() => {
    onPaginationChange(1);
  }, [onPaginationChange]);

  const onLast = useCallback(() => {
    onPaginationChange(getInternalPageCount);
  }, [getInternalPageCount, onPaginationChange]);

  const paginationClass = classNames("pagination", className);

  return (
    <div className={paginationClass}>
      {displayTotal && (
        <div className="pagination-total">
          Total <span>{total}</span> Items
        </div>
      )}
      <div className="flex items-center gap-3 ml-auto">
        {/* First Button */}
        <button
          className={`px-3 py-1.5 text-sm font-medium text-gray-700 rounded-md transition-colors ${
            internalCurrentPage <= 1
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-gray-100 cursor-pointer"
          }`}
          onClick={internalCurrentPage > 1 ? onFirst : undefined}
          disabled={internalCurrentPage <= 1}
        >
          First
        </button>

        {/* Previous Button */}
        <button
          className={`p-2 rounded-md transition-colors ${
            internalCurrentPage <= 1
              ? "opacity-40 cursor-not-allowed text-gray-400"
              : "hover:bg-gray-100 cursor-pointer text-gray-600"
          }`}
          onClick={internalCurrentPage > 1 ? onPrev : undefined}
          disabled={internalCurrentPage <= 1}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Page Indicator */}
        <div className="px-4 py-1.5 text-sm font-medium text-gray-700">
          Page {internalCurrentPage} of {getInternalPageCount}
        </div>

        {/* Next Button */}
        <button
          className={`p-2 rounded-md transition-colors ${
            internalCurrentPage >= getInternalPageCount
              ? "opacity-40 cursor-not-allowed text-gray-400"
              : "hover:bg-gray-100 cursor-pointer text-gray-600"
          }`}
          onClick={
            internalCurrentPage < getInternalPageCount ? onNext : undefined
          }
          disabled={internalCurrentPage >= getInternalPageCount}
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Last Button */}
        <button
          className={`px-3 py-1.5 text-sm font-medium text-gray-700 rounded-md transition-colors ${
            internalCurrentPage >= getInternalPageCount
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-gray-100 cursor-pointer"
          }`}
          onClick={
            internalCurrentPage < getInternalPageCount ? onLast : undefined
          }
          disabled={internalCurrentPage >= getInternalPageCount}
        >
          Last
        </button>
      </div>
    </div>
  );
};

export default Pagination;
