"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, FolderTree, Pencil, Plus, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  allCategory,
  deleteCategory,
  updateCategory,
  type CategoryPayload,
  type PostCategory,
} from "@/service/category/categoryservice";

const formatDate = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en-BD", { dateStyle: "medium" }).format(date);
};

export default function AllCategoryPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const categoriesQuery = useQuery({
    queryKey: ["admin-categories"],
    queryFn: allCategory,
  });

  const refreshCategories = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] }),
      queryClient.invalidateQueries({ queryKey: ["post-categories"] }),
    ]);
  };

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CategoryPayload }) =>
      updateCategory(id, payload),
    onSuccess: async () => {
      await refreshCategories();
      setEditingId(null);
      toast.success("Category updated.");
    },
    onError: (error: Error) => {
      toast.error("Could not update category", {
        description: error.message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: async () => {
      await refreshCategories();
      toast.success("Category deleted.");
    },
    onError: (error: Error) => {
      toast.error("Could not delete category", {
        description: error.message,
      });
    },
  });

  useEffect(() => {
    if (categoriesQuery.error) {
      toast.error("Could not load categories", {
        description: categoriesQuery.error.message,
      });
    }
  }, [categoriesQuery.error]);

  const startEdit = (category: PostCategory) => {
    setEditingId(category.id);
    setEditTitle(category.title);
  };

  const submitEdit = (event: React.FormEvent<HTMLFormElement>, id: string) => {
    event.preventDefault();
    const title = editTitle.trim();
    if (!title) {
      toast.error("Category name cannot be empty.");
      return;
    }
    updateMutation.mutate({ id, payload: { title } });
  };

  const confirmDelete = (category: PostCategory) => {
    if (window.confirm(`Delete the category "${category.title}"?`)) {
      deleteMutation.mutate(category.id);
    }
  };

  const categories = categoriesQuery.data ?? [];

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 p-4 sm:p-6">
      <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
            <FolderTree className="size-6" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">All categories</h1>
            <p className="mt-1 text-sm text-slate-500">
              View, rename, and remove post categories.
            </p>
          </div>
        </div>
        <Link href="/dashboard/admin/create-category">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 size-4" aria-hidden="true" />
            Create category
          </Button>
        </Link>
      </header>

      {categoriesQuery.isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950">
          Loading categories...
        </div>
      ) : categoriesQuery.isError ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
        >
          Could not load categories. Refresh the page to try again.
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-950">
          <FolderTree className="mx-auto size-8 text-slate-400" aria-hidden="true" />
          <p className="mt-3 font-medium">No categories yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Create a category to make it available for posts.
          </p>
        </div>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2">
          {categories.map((category) => {
            const isEditing = editingId === category.id;
            const isDeleting =
              deleteMutation.isPending &&
              deleteMutation.variables === category.id;
            const isUpdating =
              updateMutation.isPending &&
              updateMutation.variables?.id === category.id;

            return (
              <article
                key={category.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950"
              >
                {isEditing ? (
                  <form
                    onSubmit={(event) => submitEdit(event, category.id)}
                    className="space-y-4"
                  >
                    <label
                      htmlFor={`category-${category.id}`}
                      className="text-sm font-medium"
                    >
                      Category name
                    </label>
                    <input
                      id={`category-${category.id}`}
                      value={editTitle}
                      onChange={(event) => setEditTitle(event.target.value)}
                      maxLength={80}
                      required
                      autoFocus
                      className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus-visible:border-emerald-600 focus-visible:ring-2 focus-visible:ring-emerald-600/20 dark:border-slate-700 dark:bg-slate-900"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                        disabled={isUpdating}
                      >
                        <X className="mr-1 size-4" aria-hidden="true" />
                        Cancel
                      </Button>
                      <Button type="submit" size="sm" disabled={isUpdating}>
                        <Check className="mr-1 size-4" aria-hidden="true" />
                        {isUpdating ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="break-words text-lg font-semibold">
                          {category.title}
                        </h2>
                        <p className="mt-2 break-all text-xs text-slate-500">
                          ID: {category.id}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Created {formatDate(category.createdAt)}
                        </p>
                      </div>
                      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        <FolderTree className="size-5" aria-hidden="true" />
                      </span>
                    </div>
                    <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => startEdit(category)}
                        disabled={deleteMutation.isPending || updateMutation.isPending}
                      >
                        <Pencil className="mr-1 size-4" aria-hidden="true" />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => confirmDelete(category)}
                        disabled={isDeleting || updateMutation.isPending}
                      >
                        <Trash2 className="mr-1 size-4" aria-hidden="true" />
                        {isDeleting ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </>
                )}
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
