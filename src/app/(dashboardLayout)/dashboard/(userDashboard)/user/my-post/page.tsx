"use client";

import Image from "next/image";
import { useMemo, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2, MoreHorizontal, PencilLine, Trash2 } from "lucide-react";
import type { Post } from "@/types/post";
import { getDashboardAllpost } from "@/service/dashboard/allPost";
import {
  deletePost,
  type UpdatePostPayload,
  updatePost,
} from "@/service/post/allAprovedPost";

const PAGE_SIZE = 10;

const statusClasses: Record<Post["status"], string> = {
  DRAFT: "border-amber-200 bg-amber-50 text-amber-800",
  APPROVED: "border-emerald-200 bg-emerald-50 text-emerald-800",
  REJECTED: "border-red-200 bg-red-50 text-red-800",
};

const formatDate = (value?: string) => {
  if (!value) return "-";

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
};

const formatPrice = (amount?: number) =>
  `৳${Number(amount ?? 0).toLocaleString("en-BD", { maximumFractionDigits: 2 })}`;

const extractPosts = (response: unknown): Post[] => {
  if (Array.isArray(response)) {
    return response as Post[];
  }

  if (!response || typeof response !== "object") {
    return [];
  }

  const payload = response as Record<string, unknown>;
  const nestedData = payload.data;
  const dashboard =
    payload.UserDashBoardPost ??
    payload.userDashboardPost ??
    (nestedData && typeof nestedData === "object"
      ? (nestedData as Record<string, unknown>).UserDashBoardPost ??
        (nestedData as Record<string, unknown>).userDashboardPost
      : undefined);

  if (!dashboard || typeof dashboard !== "object") {
    return [];
  }

  const dashboardPosts = dashboard as Record<string, unknown>;
  const posts = dashboardPosts.allposts ?? dashboardPosts.DraftedPost;

  return Array.isArray(posts) ? (posts as Post[]) : [];
};

type EditMyPostDialogProps = {
  post: Post | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: UpdatePostPayload) => void;
  isSubmitting: boolean;
};

function EditMyPostDialog({
  post,
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: EditMyPostDialogProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!post) return;

    const formData = new FormData(event.currentTarget);
    const postType = String(formData.get("postType")) as Post["postType"];
    const amount = Number(formData.get("taka"));

    onSubmit({
      title: String(formData.get("title") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
      photo: String(formData.get("photo") ?? "").trim(),
      postType,
      taka: postType === "PAID" && Number.isFinite(amount) ? amount : 0,
      categoryId: post.categoryId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit post</DialogTitle>
          <DialogDescription>Update your post details. The category will remain unchanged.</DialogDescription>
        </DialogHeader>
        {post ? (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="my-post-title">Title</Label>
              <Input id="my-post-title" name="title" defaultValue={post.title} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="my-post-description">Description</Label>
              <textarea
                id="my-post-description"
                name="description"
                defaultValue={post.description}
                rows={6}
                required
                className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="my-post-photo">Image URL</Label>
              <Input id="my-post-photo" name="photo" type="url" defaultValue={post.photo} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="my-post-type">Post type</Label>
                <select
                  id="my-post-type"
                  name="postType"
                  defaultValue={post.postType}
                  onChange={(event) => {
                    const amountInput = event.currentTarget.form?.elements.namedItem(
                      "taka"
                    ) as HTMLInputElement | null;
                    if (amountInput && event.target.value !== "PAID") {
                      amountInput.value = "0";
                      amountInput.disabled = true;
                    } else if (amountInput) {
                      amountInput.disabled = false;
                    }
                  }}
                  className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="FREE">Free</option>
                  <option value="PAID">Paid</option>
                  <option value="UNPAID">Unpaid</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="my-post-price">Price (৳)</Label>
                <Input
                  id="my-post-price"
                  name="taka"
                  type="number"
                  min="0"
                  step="any"
                  defaultValue={post.taka ?? 0}
                  disabled={post.postType !== "PAID"}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : <PencilLine />}
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

type DeleteMyPostDialogProps = {
  post: Post | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting: boolean;
};

function DeleteMyPostDialog({
  post,
  open,
  onOpenChange,
  onConfirm,
  isDeleting,
}: DeleteMyPostDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete post?</DialogTitle>
          <DialogDescription>
            {post ? `Delete “${post.title}”? This action cannot be undone.` : "Delete this post?"}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm} disabled={isDeleting || !post}>
            {isDeleting ? <Loader2 className="animate-spin" /> : <Trash2 />}
            {isDeleting ? "Deleting..." : "Delete post"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const MyAllPost = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { data, isLoading, isError, error } = useQuery<unknown, Error>({
    queryKey: ["my-posts"],
    queryFn: getDashboardAllpost,
  });
  const posts = useMemo(() => extractPosts(data), [data]);

  const editMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePostPayload }) =>
      updatePost(id, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["my-posts"] }),
        queryClient.invalidateQueries({ queryKey: ["dasboard-data"] }),
      ]);
      toast.add({ type: "success", title: "Post updated", description: "Your post was updated." });
      setIsEditDialogOpen(false);
      setPostToEdit(null);
    },
    onError: (mutationError) => {
      toast.add({
        type: "error",
        title: "Update failed",
        description: mutationError instanceof Error ? mutationError.message : "Unable to update post.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["my-posts"] }),
        queryClient.invalidateQueries({ queryKey: ["dasboard-data"] }),
      ]);
      toast.add({ type: "success", title: "Post deleted", description: "Your post was deleted." });
      setIsDeleteDialogOpen(false);
      setPostToDelete(null);
    },
    onError: (mutationError) => {
      toast.add({
        type: "error",
        title: "Delete failed",
        description: mutationError instanceof Error ? mutationError.message : "Unable to delete post.",
      });
    },
  });
  const filteredPosts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return posts;

    return posts.filter((post) =>
      [
        post.id,
        post.title,
        post.description,
        post.category?.title,
        post.postType,
        post.status,
        post.taka,
        post.createdAt,
      ]
        .filter((value) => value !== null && value !== undefined)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [posts, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visiblePosts = filteredPosts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

      return (
        <section className="space-y-5 p-4 sm:p-6">
          <header className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">My posts</h1>
            <p className="text-sm text-muted-foreground">
              Review the posts you have shared with the community.
            </p>
          </header>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="w-full sm:max-w-sm">
              <label htmlFor="my-post-search" className="mb-1.5 block text-sm font-medium">
                Search posts
              </label>
              <Input
                id="my-post-search"
                value={searchTerm}
                placeholder="Title, category, status, or type"
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setPage(1);
                }}
              />
            </div>
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
            <table className="w-full min-w-[1180px] border-collapse text-left text-sm">
              <thead className="bg-muted/60 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Post</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium">Updated</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                    Array.from({ length: 5 }, (_, index) => (
                    <tr key={index}>
                        {Array.from({ length: 9 }, (_, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-4">
                          <Skeleton className="h-4 w-full max-w-32" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : isError ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-destructive">
                      {error.message || "Unable to load your posts."}
                    </td>
                  </tr>
                ) : visiblePosts.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-muted-foreground">
                      {posts.length === 0 ? "You have not created any posts yet." : "No posts match your search."}
                    </td>
                  </tr>
                ) : (
                  visiblePosts.map((post) => (
                    <tr key={post.id} className="align-top transition-colors hover:bg-muted/30">
                      <td className="max-w-64 px-4 py-3">
                        <div className="flex min-w-48 items-start gap-3">
                          {post.photo ? (
                            <div className="relative size-14 shrink-0 overflow-hidden rounded-md border bg-muted">
                              <Image
                                src={post.photo}
                                alt=""
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex size-14 shrink-0 items-center justify-center rounded-md border bg-muted text-xs text-muted-foreground">
                              No image
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="line-clamp-2 font-medium text-foreground">{post.title}</p>
                            <p className="mt-1 truncate text-xs text-muted-foreground" title={post.id}>
                              ID: {post.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="max-w-72 px-4 py-3 text-muted-foreground">
                        <p className="line-clamp-3 min-w-48">{post.description}</p>
                      </td>
                      <td className="px-4 py-3">{post.category?.title ?? "Uncategorized"}</td>
                      <td className="px-4 py-3">{post.postType}</td>
                      <td className="whitespace-nowrap px-4 py-3">{formatPrice(post.taka)}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={statusClasses[post.status]}>
                          {post.status}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">{formatDate(post.createdAt)}</td>
                      <td className="whitespace-nowrap px-4 py-3">{formatDate(post.updatedAt)}</td>
                      <td className="px-4 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button type="button" variant="ghost" size="icon" aria-label={`Actions for ${post.title}`}>
                                <MoreHorizontal />
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
                              className="text-destructive"
                              onClick={() => {
                                setPostToDelete(post);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!isLoading && !isError && filteredPosts.length > 0 ? (
            <footer className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </footer>
          ) : null}

          <EditMyPostDialog
            post={postToEdit}
            open={isEditDialogOpen}
            onOpenChange={(open) => {
              setIsEditDialogOpen(open);
              if (!open) setPostToEdit(null);
            }}
            onSubmit={(payload) => {
              if (postToEdit) {
                editMutation.mutate({ id: postToEdit.id, payload });
              }
            }}
            isSubmitting={editMutation.isPending}
          />

          <DeleteMyPostDialog
            post={postToDelete}
            open={isDeleteDialogOpen}
            onOpenChange={(open) => {
              setIsDeleteDialogOpen(open);
              if (!open) setPostToDelete(null);
            }}
            onConfirm={() => {
              if (postToDelete) deleteMutation.mutate(postToDelete.id);
            }}
            isDeleting={deleteMutation.isPending}
          />
        </section>
      );
};

export default MyAllPost;