/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ActionType } from "./tanstackTableData";
import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  flexRender,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";

const tableFeaturesConfig = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
});

const getValueByPath = (record: Record<string, any>, path: string) => {
  if (!path) {
    return undefined;
  }

  return path.split(".").reduce<any>((acc, key) => {
    if (acc === null || acc === undefined) {
      return undefined;
    }

    return acc[key];
  }, record);
};

const collectSearchableValues = (value: unknown): string[] => {
  if (value === null || value === undefined) {
    return [];
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return [String(value)];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => collectSearchableValues(item));
  }

  if (typeof value === "object") {
    return Object.values(value).flatMap((item) => collectSearchableValues(item));
  }

  return [];
};

const BasicTanstackTable = <TData extends object>({
  data,
  columns,
  isLoading = false,
  emptyMessage = "No records found.",
  showRoleFilter = true,
  showCategoryFilter = false,
  showTypeFilter = false,
  tableTitle = "Users",
  recordLabel = "users",
  categoryFilterPath = "category.title",
  typeFilterPath = "type",
}: {
  data: TData[];
  columns: any[];
  isLoading?: boolean;
  emptyMessage?: string;
  showRoleFilter?: boolean;
  showCategoryFilter?: boolean;
  showTypeFilter?: boolean;
  tableTitle?: string;
  recordLabel?: string;
  categoryFilterPath?: string;
  typeFilterPath?: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const users = data;

  const selectedRole = searchParams.get("role") ?? "";
  const selectedStatus = searchParams.get("status") ?? "";
  const selectedCategory = searchParams.get("category") ?? "";
  const selectedType = searchParams.get("type") ?? "";
  const globalFilter = searchParams.get("search") ?? "";

  const updatePageInUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }

    const queryString = params.toString();

    router.push(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  };

  const rawPage = Number(searchParams.get("page") ?? "1");

  const pagination: PaginationState = {
    pageIndex: Number.isNaN(rawPage) || rawPage < 1 ? 0 : rawPage - 1,
    pageSize: 10,
  };

  const sorting: SortingState = useMemo(() => {
    const sortKey = searchParams.get("sort");
    const order = searchParams.get("order") ?? "asc";

    if (!sortKey) {
      return [];
    }

    return [
      {
        id: sortKey,
        desc: order === "desc",
      },
    ];
  }, [searchParams]);

  const uniqueRoles = useMemo(
    () =>
      Array.from(new Set(users.map((user) => (user as any).role))).sort((a, b) =>
        String(a).localeCompare(String(b))
      ),
    [users]
  );


  const uniqueCategories = useMemo(() => {
    if (!showCategoryFilter) {
      return [];
    }

    return Array.from(
      new Set(
        users
          .map((user) => getValueByPath(user as Record<string, any>, categoryFilterPath))
          .filter((value): value is string => value !== null && value !== undefined && value !== "")
      )
    )
      .map((value) => String(value))
      .sort((a, b) => a.localeCompare(b));
  }, [categoryFilterPath, showCategoryFilter, users]);

  const uniqueTypes = useMemo(() => {
    if (!showTypeFilter) {
      return [];
    }

    return Array.from(
      new Set(
        users
          .map((user) => getValueByPath(user as Record<string, any>, typeFilterPath))
          .filter((value): value is string => value !== null && value !== undefined && value !== "")
      )
    )
      .map((value) => String(value))
      .sort((a, b) => a.localeCompare(b));
  }, [showTypeFilter, typeFilterPath, users]);

  const filteredUsers = useMemo(() => {
    let result = users;

    if (selectedRole) {
      result = result.filter((user) => (user as any).role === selectedRole);
    }

    if (selectedStatus) {
      result = result.filter((user) => (user as any).status === selectedStatus);
    }

    if (selectedCategory) {
      result = result.filter(
        (user) =>
          String(getValueByPath(user as Record<string, any>, categoryFilterPath) ?? "") ===
          selectedCategory
      );
    }

    if (selectedType) {
      result = result.filter(
        (user) =>
          String(getValueByPath(user as Record<string, any>, typeFilterPath) ?? "") === selectedType
      );
    }

    if (globalFilter) {
      const query = globalFilter.toLowerCase();

      result = result.filter((user) =>
        collectSearchableValues(user).some((value) => value.toLowerCase().includes(query))
      );
    }

    return result;
  }, [selectedCategory, selectedRole, selectedStatus, selectedType, categoryFilterPath, globalFilter, typeFilterPath, users]);

  const pageCount = Math.max(
    Math.ceil(filteredUsers.length / pagination.pageSize),
    1
  );
  const safePageIndex = Math.min(pagination.pageIndex, pageCount - 1);

  const paginatedUsers = useMemo(() => {
    const start = safePageIndex * pagination.pageSize;

    return filteredUsers.slice(start, start + pagination.pageSize);
  }, [filteredUsers, safePageIndex, pagination.pageSize]);

  const handleAction = (action: ActionType, user: any) => {
    console.log(`${action} user:`, user);
  };

  const table = useTable<any, TData, any>({
    data: paginatedUsers,
    columns,
    manualPagination: true,
    rowCount: filteredUsers.length,
    state: {
      sorting,
      pagination: {
        ...pagination,
        pageIndex: safePageIndex,
      },
      globalFilter,
    },
    onSortingChange: (updater: SortingState | ((old: SortingState) => SortingState)) => {
      const nextSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      const nextSort = nextSorting[0];
      const params = new URLSearchParams(searchParams.toString());

      if (nextSort) {
        params.set("sort", nextSort.id);
        params.set("order", nextSort.desc ? "desc" : "asc");
      } else {
        params.delete("sort");
        params.delete("order");
      }

      const queryString = params.toString();

      router.push(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    onPaginationChange: (updater: PaginationState | ((old: PaginationState) => PaginationState)) => {
      const nextPagination =
        typeof updater === "function" ? updater(pagination) : updater;
      const params = new URLSearchParams(searchParams.toString());

      if (nextPagination.pageIndex === 0) {
        params.delete("page");
      } else {
        params.set("page", String(nextPagination.pageIndex + 1));
      }

      const queryString = params.toString();

      router.push(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    meta: {
      onAction: handleAction,
    },
    features: tableFeaturesConfig,
  });

  const currentPage = safePageIndex + 1;
  const totalPages = pageCount;
  const visibleRowCount = paginatedUsers.length;
  const filteredRowCount = filteredUsers.length;

  const pageNumbers: Array<number | "..."> = (() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 5) {
      return [1, 2, 3, 4, 5, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    if (currentPage >= totalPages - 4) {
      return [1, 2, 3, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [
      1,
      2,
      3,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  })();

  return (
    <div className="w-full overflow-hidden">
      {/* Table Card */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Table Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {tableTitle}
            </h2>

            <p className="text-sm text-gray-500">
              {filteredRowCount} {recordLabel} match current filters
            </p>
          </div>
        </div>

        {/* Responsive Table */}
        <div>
          <div className="w-full overflow-x-auto">
            <div className="grid gap-4 border-b border-gray-200 bg-gray-50 p-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)]">
              <div className="w-full md:max-w-sm">
                <label
                  htmlFor="search-users"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Search
                </label>

                <input
                  id="search-users"
                  type="text"
                  placeholder="Search records..."
                  value={globalFilter}
                  onChange={(event) => {
                    const value = event.target.value;
                    const params = new URLSearchParams(searchParams.toString());

                    params.delete("page");

                    if (value) {
                      params.set("search", value);
                    } else {
                      params.delete("search");
                    }

                    const queryString = params.toString();

                    router.push(queryString ? `${pathname}?${queryString}` : pathname, {
                      scroll: false,
                    });
                  }}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex w-full flex-col gap-4 md:max-w-3xl">
                <div className="flex w-full flex-col gap-4 md:flex-row md:items-end">
                  {showRoleFilter ? (
                    <div className="w-full md:w-1/3">
                      <label
                        htmlFor="role-filter"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Filter by role
                      </label>

                      <select
                        id="role-filter"
                        value={selectedRole}
                        onChange={(event) => {
                          const value = event.target.value;
                          const params = new URLSearchParams(searchParams.toString());

                          if (value) {
                            params.set("role", value);
                          } else {
                            params.delete("role");
                          }

                          params.delete("page");

                          const queryString = params.toString();

                          router.push(queryString ? `${pathname}?${queryString}` : pathname, {
                            scroll: false,
                          });
                        }}
                        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="">All roles</option>

                        {uniqueRoles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : null}

                  {showCategoryFilter ? (
                    <div className="w-full md:w-1/3">
                      <label
                        htmlFor="category-filter"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Filter by category
                      </label>

                      <select
                        id="category-filter"
                        value={selectedCategory}
                        onChange={(event) => {
                          const value = event.target.value;
                          const params = new URLSearchParams(searchParams.toString());

                          if (value) {
                            params.set("category", value);
                          } else {
                            params.delete("category");
                          }

                          params.delete("page");

                          const queryString = params.toString();

                          router.push(queryString ? `${pathname}?${queryString}` : pathname, {
                            scroll: false,
                          });
                        }}
                        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="">All categories</option>

                        {uniqueCategories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : null}

                  {showTypeFilter ? (
                    <div className="w-full md:w-1/3">
                      <label
                        htmlFor="type-filter"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Filter by type
                      </label>

                      <select
                        id="type-filter"
                        value={selectedType}
                        onChange={(event) => {
                          const value = event.target.value;
                          const params = new URLSearchParams(searchParams.toString());

                          if (value) {
                            params.set("type", value);
                          } else {
                            params.delete("type");
                          }

                          params.delete("page");

                          const queryString = params.toString();

                          router.push(queryString ? `${pathname}?${queryString}` : pathname, {
                            scroll: false,
                          });
                        }}
                        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="">All types</option>

                        {uniqueTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : null}

                  <div className={showRoleFilter || showCategoryFilter || showTypeFilter ? "w-full md:w-1/3" : "w-full"}>
                    <div className="flex items-center gap-3" />
                  </div>
                </div>
              </div>
            </div>
            
 
          <table className="w-full min-w-175 border-collapse">
            {/* ================= HEADER ================= */}
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="border-b border-gray-200 bg-gray-50 px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-600"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            {/* ================= BODY ================= */}
            <tbody className="divide-y divide-gray-100">
              {isLoading
                ? Array.from({ length: pagination.pageSize }).map((_, index) => (
                    <tr key={`loading-row-${index}`} className="animate-pulse">
                      {columns.map((_, cellIndex) => (
                        <td key={`loading-cell-${cellIndex}`} className="px-5 py-4">
                          <div className="h-4 w-full rounded bg-gray-200" />
                        </td>
                      ))}
                    </tr>
                  ))
                : table.getRowModel().rows.length > 0
                  ? table.getRowModel().rows.map((row) => (
                      <tr
                        key={row.id}
                        className="transition-colors hover:bg-gray-50"
                      >
                        {row.getAllCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="px-5 py-4 text-sm text-gray-700"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))
                  : (
                    <tr>
                      <td colSpan={columns.length} className="px-5 py-10 text-center text-sm text-gray-500">
                        {emptyMessage}
                      </td>
                    </tr>
                  )}
            </tbody>
          </table>
          </div>
          
        </div>
   

        {/* ================= FOOTER ================= */}
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
          <div className="flex flex-col gap-1 text-sm text-gray-500 sm:flex-row sm:items-center sm:gap-2">
            <span>
              Showing <span className="font-medium text-gray-900">{visibleRowCount}</span> of <span className="font-medium text-gray-900">{filteredRowCount}</span> {recordLabel}
            </span>
            <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
              Page {currentPage} of {totalPages}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => updatePageInUrl(Math.max(currentPage - 1, 1))}
              disabled={!table.getCanPreviousPage()}
              className="rounded-xl border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <div className="flex items-center gap-1">
              {pageNumbers.map((page, index) => {
                if (page === "...") {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 text-sm text-gray-500"
                    >
                      ...
                    </span>
                  );
                }

                const pageNumber = page;
                const isActive = currentPage === pageNumber;

                return (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => updatePageInUrl(Number(pageNumber))}
                    disabled={pageNumber > totalPages}
                    className={[
                      "h-8 min-w-8 rounded-lg border px-2 text-sm shadow-sm transition",
                      isActive
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100",
                    ].join(" ")}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => updatePageInUrl(Math.min(currentPage + 1, totalPages))}
              disabled={!table.getCanNextPage()}
              className="rounded-xl border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicTanstackTable;
