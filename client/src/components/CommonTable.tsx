import "react-loading-skeleton/dist/skeleton.css";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type ColumnDef,
  type HeaderGroup,
  type Header,
  type Row,
  type Cell,
} from "@tanstack/react-table";
import { useSearchParams, useNavigate } from "react-router-dom";
import React, { useEffect, useMemo, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-hot-toast";
import NoData from "./NoData";
import Pagination from "./Pagination";

const LIMIT_OPTIONS = [5, 10, 20, 50];

export interface CommonTableProps<T> {
  columns: ColumnDef<T, any>[];
  data: T[];
  error?: string | null;
  isLoading?: boolean;
  totalPages?: number;
  dashBoard?: boolean;
  customComponent?: React.ReactNode;
  title?: string;
}

const CommonTable = <T,>({
  columns,
  data,
  error,
  isLoading,
  totalPages: TotalPages,
  dashBoard,
  customComponent,
  title = "items",
}: CommonTableProps<T>) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    setCurrentPage(Number(searchParams.get("page")) || 1);
    setLimit(Number(searchParams.get("limit")) || 10);
  }, [searchParams]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const updatedColumns = useMemo(
    () => [
      {
        id: "serialNo",
        header: "#",
        cell: ({ row }: any) => row.index + 1 + (currentPage - 1) * limit,
      },
      ...columns,
    ],
    [columns, currentPage, limit]
  );

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    navigate(`?${params.toString()}`);
  };

  const handleLimitChange = (newLimit: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", newLimit.toString());
    params.set("page", "1"); // Reset to page 1 when limit changes
    navigate(`?${params.toString()}`);
  };

  const paginatedData = useMemo(
    () =>
      TotalPages
        ? data
        : data.slice((currentPage - 1) * limit, currentPage * limit),
    [TotalPages, data, currentPage, limit]
  );

  const table = useReactTable({
    columns: updatedColumns,
    data: paginatedData,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
  });

  const totalPages = useMemo(
    () => TotalPages || Math.ceil(data?.length / limit),
    [TotalPages, data, limit]
  );

  return (
    <>
      <div className="card overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 bg-linear-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700 font-medium">Show:</span>
              <select
                className="input-field py-2 px-4 text-sm font-medium border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 rounded-lg shadow-sm"
                value={limit}
                onChange={(e) => handleLimitChange(Number(e.target.value))}
              >
                {LIMIT_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option} rows
                  </option>
                ))}
              </select>
            </div>
            {customComponent && (
              <div className="ml-auto">{customComponent}</div>
            )}
          </div>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup: HeaderGroup<T>) => (
                <tr
                  key={headerGroup.id}
                  className="bg-linear-to-r from-gray-100 to-gray-50 text-left border-b-2 border-gray-300"
                >
                  {headerGroup.headers.map((header: Header<T, unknown>) => (
                    <th
                      key={header.id}
                      className={`min-w-[50px] cursor-pointer whitespace-nowrap px-6 py-4 font-bold text-gray-800 text-xs uppercase tracking-wider transition-colors hover:bg-gray-200 ${
                        header.id === "actions" ? "text-right" : ""
                      } ${header.id === "serialNo" ? "w-16" : ""}`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div
                        className={`flex items-center gap-2 ${header.id === "actions" ? "justify-end" : ""}`}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getIsSorted() === "asc"
                          ? " 🔼"
                          : header.column.getIsSorted() === "desc"
                            ? " 🔽"
                            : ""}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {isLoading ? (
                [...Array(limit)].map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    {updatedColumns.map((_, i) => (
                      <td key={i} className="px-6 py-4">
                        <Skeleton height={20} className="opacity-50" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row: Row<T>, index) => (
                  <tr
                    key={row.id}
                    className={`transition-all duration-150 hover:bg-linear-to-r hover:from-primary-50 hover:to-transparent hover:shadow-sm ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    {row.getVisibleCells().map((cell: Cell<T, unknown>) => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 text-sm text-gray-900"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="w-full p-4 text-center"
                  >
                    <NoData title={title} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {!dashBoard && totalPages > 1 && (
        <Pagination
          total={data?.length || 0}
          currentPage={currentPage || 1}
          pageSize={limit || 10}
          onChange={handlePageChange}
          displayTotal={true}
          onlyArrow={false}
        />
      )}
    </>
  );
};

export default CommonTable;
