"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMemo, useState } from "react";
import {
  createPaginatedRowModel,
  createSortedRowModel,
  flexRender,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import type { DashboardPost, PostStatus, PostType } from "@/types/dashboard.type";

export type DraftedPost = DashboardPost;

interface DraftedPostTableProps {
  posts: DraftedPost[];
}

const formatEnumLabel = (value: string) =>
  value.charAt(0) + value.slice(1).toLowerCase();

const getPostStatus = (status?: string): PostStatus => {
  switch (status?.toUpperCase()) {
    case "APPROVED":
      return "APPROVED";
    case "REJECTED":
      return "REJECTED";
    case "DELETED":
      return "DELETED";
    default:
      return "DRAFT";
  }
};

const getPostType = (postType?: string): PostType => {
  switch (postType?.toUpperCase()) {
    case "FREE":
      return "FREE";
    case "PAID":
      return "PAID";
    default:
      return "UNPAID";
  }
};

const statusBadgeClasses: Record<PostStatus, string> = {
  DRAFT: "border-amber-200 bg-amber-50 text-amber-700",
  APPROVED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  REJECTED: "border-red-200 bg-red-50 text-red-700",
  DELETED: "border-red-200 bg-red-50 text-red-700",
};

const typeBadgeClasses: Record<PostType, string> = {
  FREE: "border-sky-200 bg-sky-50 text-sky-700",
  PAID: "border-violet-200 bg-violet-50 text-violet-700",
  UNPAID: "border-slate-200 bg-slate-100 text-slate-700",
};

const tableFeaturesConfig = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
});

const AdminDashBoardAllPost = ({ posts }: DraftedPostTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const categoryOptions = useMemo(
    () =>
      Array.from(
        new Set(
          posts
            .map((post) => post.category?.title)
            .filter((title): title is string => Boolean(title))
        )
      ).sort((a, b) => a.localeCompare(b)),
    [posts]
  );

  const visiblePosts = useMemo(() => {
    if (selectedCategory === "all") return posts;
    return posts.filter(
      (post) => post.category?.title?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [posts, selectedCategory]);

  const columns = useMemo(
    () => [
      {
        id: "category",
        accessorFn: (row: DraftedPost) => row.category?.title ?? "Uncategorized",
        header: "Category",
        enableSorting: true,
        cell: ({ getValue }: any) => (
          <span className="text-slate-600">{String(getValue() ?? "Uncategorized")}</span>
        ),
      },
      {
        accessorKey: "title",
        header: "Title",
        enableSorting: true,
        cell: ({ row }: any) => (
          <span className="font-medium text-slate-800">{row.original.title}</span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        enableSorting: true,
        cell: ({ row }: any) => {
          const status = getPostStatus(row.original.status);

          return (
            <Badge variant="outline" className={statusBadgeClasses[status]}>
              {formatEnumLabel(status)}
            </Badge>
          );
        },
      },
      {
        accessorKey: "postType",
        header: "Type",
        enableSorting: true,
        cell: ({ row }: any) => {
          const postType = getPostType(row.original.postType);

          return (
            <Badge variant="outline" className={typeBadgeClasses[postType]}>
              {formatEnumLabel(postType)}
            </Badge>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        enableSorting: true,
        cell: ({ row }: any) => {
          const value = row.original.createdAt;
          return value ? new Date(value).toLocaleDateString() : "-";
        },
      },
      {
        id: "actions",
        header: "Action",
        cell: ({ row }: any) => {
          const post = row.original as DraftedPost;

          const handleView = (item: DraftedPost) => {
            console.log("View post:", item);
          };

          const handleEdit = (item: DraftedPost) => {
            console.log("Edit post:", item);
          };

          const handleDelete = (id: string) => {
            console.log("Delete post:", id);
          };

          return (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                }
              />

              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleView(post)}>
                  View
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => handleEdit(post)}>
                  Edit
                </DropdownMenuItem>

                <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(post.id)}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ] as any,
    []
  );

  const table = useTable({
    data: visiblePosts,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    features: tableFeaturesConfig,
  });

  if (!posts?.length) {
    return (
      <div className="rounded-lg border p-6 text-center text-slate-500">
        No drafted posts found
      </div>
    );
  }

  const pageCount = table.getPageCount();
  const currentPage = table.state.pagination.pageIndex + 1;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="category-select" className="text-sm font-medium text-slate-700">
            Category
          </label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(event) => {
              setSelectedCategory(event.target.value);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-700 outline-none focus:border-slate-500"
          >
            <option value="all">All Categories</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="text-sm text-slate-600">
          Showing {visiblePosts.length} post{visiblePosts.length === 1 ? "" : "s"}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-[760px] w-full border-collapse">
          <thead className="bg-slate-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();

                  return (
                    <th
                      key={header.id}
                      className={`px-4 py-3 text-left text-sm font-semibold text-slate-700 ${
                        canSort ? "cursor-pointer select-none hover:bg-slate-100" : ""
                      }`}
                      onClick={
                        canSort ? header.column.getToggleSortingHandler() : undefined
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}

                      {header.column.getIsSorted() === "asc" && " ↑"}
                      {header.column.getIsSorted() === "desc" && " ↓"}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t border-slate-200 bg-white hover:bg-slate-50">
                {row.getAllCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-sm text-slate-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Rows per page</span>
          <select
            value={table.state.pagination.pageSize}
            onChange={(event) => table.setPageSize(Number(event.target.value))}
            className="rounded border border-slate-300 bg-white px-2 py-1 text-sm text-slate-700"
          >
            {[5, 10, 15].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">
            Page {currentPage} of {pageCount || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashBoardAllPost;
