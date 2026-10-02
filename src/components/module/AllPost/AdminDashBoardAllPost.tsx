"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMemo, useState, type FormEvent } from "react";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2, MoreHorizontal, PencilLine, Trash2 } from "lucide-react";
import {
  deletePost,
  getPostById,
  type UpdatePostPayload,
  updatePost,
} from "@/service/post/allAprovedPost";
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

type EditPostDialogProps = {
  postId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: UpdatePostPayload) => void;
  isSubmitting: boolean;
};

function EditPostDialog({
  postId,
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: EditPostDialogProps) {
  const {
    data: post,
    error,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["post-for-edit", postId],
    queryFn: () => getPostById(postId as string),
    enabled: open && Boolean(postId),
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!post) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const postType = String(formData.get("postType")) as PostType;
    const rawPrice = Number(formData.get("taka"));

    onSubmit({
      title: String(formData.get("title") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
      photo: String(formData.get("photo") ?? "").trim(),
      postType,
      taka: postType === "PAID" && Number.isFinite(rawPrice) ? rawPrice : 0,
      categoryId: post.categoryId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit post</DialogTitle>
          <DialogDescription>
            Update the post details below. The current category will stay the same.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center gap-3 py-14 text-sm text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
            Loading post details...
          </div>
        ) : null}

        {isError ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {error instanceof Error
              ? error.message
              : "Unable to load the post details. Please try again."}
          </div>
        ) : null}

        {post ? (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="edit-post-title">Title</Label>
                <Input
                  id="edit-post-title"
                  name="title"
                  defaultValue={post.title}
                  required
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="edit-post-description">Description</Label>
                <textarea
                  id="edit-post-description"
                  name="description"
                  defaultValue={post.description}
                  required
                  rows={6}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="edit-post-photo">Image URL</Label>
                <Input
                  id="edit-post-photo"
                  name="photo"
                  type="url"
                  defaultValue={post.photo}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-post-type">Post type</Label>
                <select
                  id="edit-post-type"
                  name="postType"
                  defaultValue={post.postType}
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <option value="FREE">Free</option>
                  <option value="PAID">Paid</option>
                  <option value="UNPAID">Unpaid</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-post-price">Price (৳)</Label>
                <Input
                  id="edit-post-price"
                  name="taka"
                  type="number"
                  min="0"
                  step="1"
                  defaultValue={post.taka ?? 0}
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="edit-post-category">Category</Label>
                <Input
                  id="edit-post-category"
                  value={post.category?.title || "Uncategorized"}
                  disabled
                  readOnly
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <PencilLine className="size-4" />
                    Save changes
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

type DeletePostDialogProps = {
  post: DraftedPost | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting: boolean;
};

function DeletePostDialog({
  post,
  open,
  onOpenChange,
  onConfirm,
  isDeleting,
}: DeletePostDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete post?</DialogTitle>
          <DialogDescription>
            {post
              ? `Are you sure you want to delete “${post.title}”? This action cannot be undone.`
              : "Are you sure you want to delete this post?"}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting || !post}
          >
            {isDeleting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="size-4" />
                Delete post
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const AdminDashBoardAllPost = ({ posts }: DraftedPostTableProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [postToEdit, setPostToEdit] = useState<DraftedPost | null>(null);
  const [postToDelete, setPostToDelete] = useState<DraftedPost | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const refreshPostQueries = async (postId: string) => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["dashboard-all-posts"] }),
      queryClient.invalidateQueries({ queryKey: ["all-approve-post"] }),
      queryClient.invalidateQueries({ queryKey: ["specific-post", postId] }),
      queryClient.invalidateQueries({ queryKey: ["post-for-edit", postId] }),
    ]);
  };

  const editMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePostPayload }) =>
      updatePost(id, payload),
    onSuccess: async (_updatedPost, variables) => {
      await refreshPostQueries(variables.id);
      toast.add({
        type: "success",
        title: "Post updated",
        description: "The post details were saved successfully.",
      });
      setIsEditDialogOpen(false);
      setPostToEdit(null);
    },
    onError: (error) => {
      toast.add({
        type: "error",
        title: "Update failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to update the post. Please try again.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: async (_response, postId) => {
      await refreshPostQueries(postId);
      toast.add({
        type: "success",
        title: "Post deleted",
        description: "The post was deleted successfully.",
      });
      setIsDeleteDialogOpen(false);
      setPostToDelete(null);
    },
    onError: (error) => {
      toast.add({
        type: "error",
        title: "Delete failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to delete the post. Please try again.",
      });
    },
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

  const typeOptions = useMemo(
    () =>
      Array.from(
        new Set(
          posts.map((post) => getPostType(post.postType)).filter(Boolean)
        )
      ).sort((a, b) => a.localeCompare(b)),
    [posts]
  );

  const statusOptions = useMemo(
    () =>
      Array.from(
        new Set(posts.map((post) => getPostStatus(post.status)))
      ).sort((a, b) => a.localeCompare(b)),
    [posts]
  );

  const visiblePosts = useMemo(() => {
    const searchValue = searchTerm.trim().toLowerCase();

    return posts.filter((post) => {
      const categoryTitle = post.category?.title?.trim() ?? "";
      const normalizedCategory = categoryTitle.toLowerCase();
      const normalizedPostType = getPostType(post.postType).toLowerCase();
      const normalizedStatus = getPostStatus(post.status).toLowerCase();
      const searchableText = [
        post.title,
        categoryTitle,
        normalizedPostType,
        normalizedStatus,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesCategory =
        selectedCategory === "all" || normalizedCategory === selectedCategory.toLowerCase();
      const matchesType =
        selectedType === "all" || normalizedPostType === selectedType.toLowerCase();
      const matchesStatus =
        selectedStatus === "all" || normalizedStatus === selectedStatus.toLowerCase();
      const matchesSearch = !searchValue || searchableText.includes(searchValue);

      return matchesCategory && matchesType && matchesStatus && matchesSearch;
    });
  }, [posts, searchTerm, selectedCategory, selectedStatus, selectedType]);

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
                <DropdownMenuItem onClick={() => router.push(`/posts/${post.id}`)}>
                  View
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    setPostToEdit(post);
                    setIsEditDialogOpen(true);
                  }}
                >
                  Edit
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => {
                    setPostToDelete(post);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ] as any,
    [router]
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
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-end">
            <div className="flex-1">
              <label htmlFor="post-search" className="mb-1 block text-sm font-medium text-slate-700">
                Global search
              </label>
              <input
                id="post-search"
                type="text"
                placeholder="Search by title, category, status or type"
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                }}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-500"
              />
            </div>

            <div className="w-full md:max-w-55">
              <label htmlFor="category-select" className="mb-1 block text-sm font-medium text-slate-700">
                Category
              </label>
              <select
                id="category-select"
                value={selectedCategory}
                onChange={(event) => {
                  setSelectedCategory(event.target.value);
                  setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                }}
                className="w-full rounded-md border border-slate-300 bg-white px-2 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-500"
              >
                <option value="all">All Categories</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full md:max-w-45">
              <label htmlFor="type-select" className="mb-1 block text-sm font-medium text-slate-700">
                Type
              </label>
              <select
                id="type-select"
                value={selectedType}
                onChange={(event) => {
                  setSelectedType(event.target.value);
                  setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                }}
                className="w-full rounded-md border border-slate-300 bg-white px-2 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-500"
              >
                <option value="all">All Types</option>
                {typeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full md:max-w-45">
              <label htmlFor="status-select" className="mb-1 block text-sm font-medium text-slate-700">
                Status
              </label>
              <select
                id="status-select"
                value={selectedStatus}
                onChange={(event) => {
                  setSelectedStatus(event.target.value);
                  setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                }}
                className="w-full rounded-md border border-slate-300 bg-white px-2 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-500"
              >
                <option value="all">All Statuses</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {formatEnumLabel(status)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-sm text-slate-600">
            Showing {visiblePosts.length} post{visiblePosts.length === 1 ? "" : "s"}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-190 w-full border-collapse">
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

      <EditPostDialog
        postId={postToEdit?.id ?? null}
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            setPostToEdit(null);
          }
        }}
        onSubmit={(payload) => {
          if (postToEdit) {
            editMutation.mutate({ id: postToEdit.id, payload });
          }
        }}
        isSubmitting={editMutation.isPending}
      />

      <DeletePostDialog
        post={postToDelete}
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) {
            setPostToDelete(null);
          }
        }}
        onConfirm={() => {
          if (postToDelete) {
            deleteMutation.mutate(postToDelete.id);
          }
        }}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};

export default AdminDashBoardAllPost;
