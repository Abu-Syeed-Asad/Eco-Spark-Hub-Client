/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

type User = {
  id: string;
  name: string;
  email: string;
  age: number;
};

const data: User[] = [
  {
    id: "1",
    name: "asad",
    email: "asad@gmail.com",
    age: 13,
  },
  {
    id: "2",
    name: "akas",
    email: "akas@gmail.com",
    age: 343,
  },
  {
    id: "3",
    name: "mam",
    email: "ma@gmail.com",
    age: 45,
  },
];

const tableFeaturesConfig = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
});

export default function EcoAllUser() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 2,
  });

  // -----------------------------
  // VIEW
  // -----------------------------
  const handleView = (user: User) => {
    console.log("View user:", user);
  };

  // -----------------------------
  // EDIT
  // -----------------------------
  const handleEdit = (user: User) => {
    console.log("Edit user:", user);
  };

  // -----------------------------
  // DELETE
  // -----------------------------
  const handleDelete = (id: string) => {
    console.log("Delete user:", id);
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      enableSorting: true,
    },

    {
      accessorKey: "email",
      header: "Email",
      enableSorting: false,
    },

    {
      accessorKey: "age",
      header: "Age",
      enableSorting: true,
    },

    // -----------------------------
    // ACTIONS COLUMN
    // -----------------------------
    {
      id: "actions",
      header: "Actions",

      cell: ({ row }: { row: any }) => {
        const user: User = row.original;

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
              <DropdownMenuItem onClick={() => handleView(user)}>
                View
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => handleEdit(user)}>
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDelete(user.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    features: tableFeaturesConfig,
  });

  const pageCount = table.getPageCount();
  const currentPage = table.state.pagination.pageIndex + 1;

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full table-fixed border-collapse border border-gray-300">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort();

                return (
                  <th
                    key={header.id}
                    className={`border border-gray-300 p-3 text-center ${
                      canSort
                        ? "cursor-pointer select-none hover:bg-gray-100"
                        : ""
                    }`}
                    onClick={
                      canSort
                        ? header.column.getToggleSortingHandler()
                        : undefined
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
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getAllCells().map((cell) => (
                <td
                  key={cell.id}
                  className="border border-gray-300 p-3 text-center"
                >
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Rows per page</span>
          <select
            value={table.state.pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="rounded border border-gray-300 bg-white px-2 py-1 text-sm"
          >
            {[2, 3, 5].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
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
}