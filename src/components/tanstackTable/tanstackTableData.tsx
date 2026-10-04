/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  MessageSquareCheck,
  MoreHorizontal,
  User,
} from "lucide-react";

import type { ColumnDef } from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type UserData = {
  id: string;
  name: string;
  email: string;
  status: "ACTIVE" | "DELETE" | "BLOCK";
  phone: string | null;
  role: string;
  needPasswordChange: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  totalAmount: number;
};

export type ActionType = "view" | "edit" | "delete";

export type ColumnMeta = {
  onAction?: (action: ActionType, user: UserData) => void;
};

const formatDateTime = (value: string | null) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export const columns: ColumnDef<any, UserData, unknown>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
    {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const name = row.original.name || "User";
      const initials = name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

      return (
        <div className="flex items-center justify-center">
          <Avatar className="h-10 w-10 border border-gray-200 bg-gray-100">
            {row.original.image ? (
              <AvatarImage src={row.original.image} alt={name} />
            ) : null}
            <AvatarFallback className="bg-gray-100 text-xs font-semibold text-gray-700">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    enableSorting: true,
    header: ({ column }) => {
      const sorted = column.getIsSorted();

      return (
        <button
          type="button"
          onClick={() => column.toggleSorting(sorted === "asc")}
          className="inline-flex items-center gap-2"
        >
          <User className="h-4 w-4" />
          UserName
          {sorted === "asc" ? (
            <ArrowUp className="h-4 w-4" />
          ) : sorted === "desc" ? (
            <ArrowDown className="h-4 w-4" />
          ) : (
            <ArrowUpDown className="h-4 w-4" />
          )}
        </button>
      );
    },
  },

  {
    accessorKey: "email",
    enableSorting: true,
    header: ({ column }) => {
      const sorted = column.getIsSorted();

      return (
        <button
          type="button"
          onClick={() => column.toggleSorting(sorted === "asc")}
          className="inline-flex items-center gap-2"
        >
          <MessageSquareCheck className="h-4 w-4" />
          Email
          {sorted === "asc" ? (
            <ArrowUp className="h-4 w-4" />
          ) : sorted === "desc" ? (
            <ArrowDown className="h-4 w-4" />
          ) : (
            <ArrowUpDown className="h-4 w-4" />
          )}
        </button>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Taka",
    enableSorting: true,
  },
  {
    accessorKey: "role",
    header: "Role",
    enableSorting: true,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    enableSorting: true,
    cell: ({ row }) => formatDateTime(row.original.createdAt),
  },
  {
    accessorKey: "status",
    enableSorting: true,
    header: ({ column }) => {
      const sorted = column.getIsSorted();

      return (
        <button
          type="button"
          onClick={() => column.toggleSorting(sorted === "asc")}
          className="inline-flex items-center gap-2"
        >
          Status
          {sorted === "asc" ? (
            <ArrowUp className="h-4 w-4" />
          ) : sorted === "desc" ? (
            <ArrowDown className="h-4 w-4" />
          ) : (
            <ArrowUpDown className="h-4 w-4" />
          )}
        </button>
      );
    },
    cell: ({ row }) => {
      const status = row.original.status;
      const normalizedStatus = String(status).toUpperCase();
      const label =
        normalizedStatus === "ACTIVE"
          ? "Active"
          : normalizedStatus === "DELETE"
            ? "Deleted"
            : "Blocked";
      const isActive = normalizedStatus === "ACTIVE";

      return (
        <span
          className={
            isActive
              ? "font-medium text-green-600"
              : normalizedStatus === "BLOCK"
                ? "font-medium text-amber-600"
                : "font-medium text-red-600"
          }
        >
          {label}
        </span>
      );
    },
  },
  {
    id: "action",
    header: "Action",
    enableSorting: false,
    cell: ({ row, table }) => {
      const user = row.original;
      const meta = table.options.meta as ColumnMeta | undefined;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open actions</span>
              </Button>
            }
          />

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => meta?.onAction?.("view", user)}>
              View
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => meta?.onAction?.("edit", user)}>
              Edit
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => meta?.onAction?.("delete", user)}
              className="text-red-600 focus:text-red-600"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];