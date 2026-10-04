"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  CircleDollarSign,
  FileText,
  LockKeyhole,
  Tag,
  User,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getPostById } from "@/service/post/allAprovedPost";
import type { PostStatus, PostType } from "@/types/post";

const statusStyles: Record<PostStatus, string> = {
  APPROVED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  DRAFT: "border-amber-200 bg-amber-50 text-amber-700",
  REJECTED: "border-red-200 bg-red-50 text-red-700",
  UNPAID: "border-orange-200 bg-orange-50 text-orange-700",
  DELETED: "border-slate-200 bg-slate-100 text-slate-700",
};

const postTypeStyles: Record<PostType, string> = {
  FREE: "border-emerald-200 bg-emerald-50 text-emerald-700",
  PAID: "border-blue-200 bg-blue-50 text-blue-700",
  UNPAID: "border-orange-200 bg-orange-50 text-orange-700",
};

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Unknown date";
  }

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatPrice(price: number) {
  if (!Number.isFinite(price)) {
    return "0";
  }

  return new Intl.NumberFormat("en-BD").format(price);
}

export default function SpecificPost() {
  const params = useParams<{ id: string }>();
  const postId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { data: post, error, isError, isLoading } = useQuery({
    queryKey: ["specific-post", postId],
    queryFn: () => getPostById(postId),
    enabled: Boolean(postId),
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl animate-pulse space-y-6">
        <div className="h-5 w-28 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="aspect-[16/9] rounded-3xl bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-3 rounded-3xl bg-white p-8 dark:bg-slate-900">
          <div className="h-5 w-40 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-10 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-5 w-full rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-5 w-5/6 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <section className="mx-auto max-w-2xl rounded-3xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/70 dark:bg-red-950/30">
        <h1 className="text-xl font-bold text-red-900 dark:text-red-100">
          Unable to load this post
        </h1>
        <p className="mt-3 text-sm leading-6 text-red-700 dark:text-red-200">
          {error instanceof Error
            ? error.message
            : "This post may no longer be available."}
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
        >
          <ArrowLeft className="size-4" />
          Back to posts
        </Link>
      </section>
    );
  }
  if (post?.paymentUrl) {
    return (
      <main className="relative isolate flex min-h-[70vh] items-center justify-center overflow-hidden px-4 py-12">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-emerald-100/70 via-background to-background dark:from-emerald-950/40"
        />
        <section
          aria-labelledby="payment-card-title"
          className="w-full max-w-lg overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-xl shadow-emerald-950/10 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="h-1.5 bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500" />
          <div className="p-7 text-center sm:p-10">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-8 ring-emerald-50/60 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-950/40">
              <CircleDollarSign className="size-8" aria-hidden="true" />
            </div>

            <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
              Secure checkout
            </p>
            <h1
              id="payment-card-title"
              className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white"
            >
              Complete your payment
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Continue to our secure payment partner to finish checkout
              {post.title ? ` for “${post.title}”` : ""}.
            </p>

            <a
              href={post.paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-900/15 transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            >
              <LockKeyhole className="size-4" aria-hidden="true" />
              Pay securely
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <LockKeyhole className="size-3.5" aria-hidden="true" />
              Your payment is handled securely by Stripe.
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 dark:text-slate-400 dark:hover:text-emerald-300"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to posts
            </Link>
          </div>
        </section>
      </main>
    );
  }
  return (
    <article className="mx-auto max-w-4xl">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:text-emerald-400 dark:hover:text-emerald-200"
      >
        <ArrowLeft className="size-4" />
        Back to posts
      </Link>

      <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="relative aspect-[16/9] min-h-64 overflow-hidden bg-slate-100 dark:bg-slate-800">
          {post.photo ? (
            <Image
              src={post.photo}
              alt={post.title || "Post image"}
              fill
              priority
              sizes="(max-width: 896px) 100vw, 896px"
              className="object-cover"
            />
          ) : (
            <div className="grid h-full place-items-center text-sm text-slate-500 dark:text-slate-400">
              No image available
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />

          <div className="absolute left-5 top-5 flex flex-wrap gap-2 sm:left-7 sm:top-7">
            <Badge
              className={
                statusStyles[post.status] ??
                "border-slate-200 bg-white/90 text-slate-700"
              }
            >
              {post.status}
            </Badge>
            <Badge
              className={
                postTypeStyles[post.postType] ??
                "border-slate-200 bg-white/90 text-slate-700"
              }
            >
              {post.postType}
            </Badge>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-2">
              <Tag className="size-4 text-emerald-600 dark:text-emerald-400" />
              {post.category?.title || "Uncategorized"}
            </span>
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="size-4 text-emerald-600 dark:text-emerald-400" />
              {formatDate(post.createdAt)}
            </span>
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            {post.title?.trim() || "Untitled Post"}
          </h1>

          {post.postType === "PAID" && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-800 dark:bg-blue-500/15 dark:text-blue-200">
              <CircleDollarSign className="size-5" />
              Price: ৳ {formatPrice(post.taka)}
            </div>
          )}

          <div className="my-8 h-px bg-slate-200 dark:bg-slate-800" />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_220px]">
            <section aria-labelledby="post-content-heading">
              <h2
                id="post-content-heading"
                className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white"
              >
                <FileText className="size-5 text-emerald-600 dark:text-emerald-400" />
                Post details
              </h2>
              <p className="mt-4 whitespace-pre-line text-[15px] leading-8 text-slate-700 dark:text-slate-200 sm:text-base">
                {post.description?.trim() || "No description has been added."}
              </p>
            </section>

            <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/40">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                Published by
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300">
                  {post.user?.image ? (
                    <Image
                      src={post.user.image}
                      alt={post.user.name || "Post author"}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  ) : (
                    <User className="size-5" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900 dark:text-white">
                    {post.user?.name || "Unknown user"}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {post.user?.role || "USER"}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </article>
  );
}
