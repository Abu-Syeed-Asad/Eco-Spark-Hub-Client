"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, FolderPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  createCategory,
  type CategoryPayload,
} from "@/service/category/categoryservice";

export default function CreateCategoryPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");

  const createMutation = useMutation({
    mutationFn: (payload: CategoryPayload) => createCategory(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["post-categories"] }),
        queryClient.invalidateQueries({ queryKey: ["admin-categories"] }),
      ]);
      toast.success("Category created.");
      router.push("/dashboard/admin/all-category");
    },
    onError: (error: Error) => {
      toast.error("Could not create category", {
        description: error.message,
      });
    },
  });

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedTitle = title.trim();
    if (!normalizedTitle) {
      toast.error("Enter a category name.");
      return;
    }
    createMutation.mutate({ title: normalizedTitle });
  };

  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 p-4 sm:p-6">
      <Link
        href="/dashboard/admin/all-category"
        className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        All categories
      </Link>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-6 flex items-center gap-4">
          <span className="grid size-12 place-items-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
            <FolderPlus className="size-6" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create category</h1>
            <p className="mt-1 text-sm text-slate-500">
              Add a category for organizing community posts.
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="category-title" className="text-sm font-medium">
              Category name
            </label>
            <input
              id="category-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={80}
              required
              autoFocus
              placeholder="For example, Recycling"
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus-visible:border-emerald-600 focus-visible:ring-2 focus-visible:ring-emerald-600/20 dark:border-slate-700 dark:bg-slate-900"
            />
            <p className="text-xs text-slate-500">Up to 80 characters.</p>
          </div>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/admin/all-category")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create category"}
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}
