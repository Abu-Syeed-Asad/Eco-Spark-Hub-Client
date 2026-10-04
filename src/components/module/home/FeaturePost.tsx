"use client";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Tag,
  User,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Post } from "@/types/post";
import { PostStatus, PostType } from "@/types/dashboard.type";
import Image from "next/image";




interface FeaturedPostProps {
  post: Post;
}

const statusStyles: Record<PostStatus, string> = {
  APPROVED:
    "bg-green-600 text-white hover:bg-green-600",
  DRAFT:
    "bg-yellow-500 text-white hover:bg-yellow-500",
  REJECTED:
    "bg-red-600 text-white hover:bg-red-600",
  UNPAID:
    "bg-orange-500 text-white hover:bg-orange-500",
  DELETED:
    "bg-red-700 text-white hover:bg-red-700",
};

const postTypeStyles: Record<PostType, string> = {
  FREE:
    "bg-white/90 text-green-700 hover:bg-white",
  PAID:
    "bg-white/90 text-blue-700 hover:bg-white",
  UNPAID:
    "bg-white/90 text-orange-700 hover:bg-white",
};

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Unknown date";
  }

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatPrice(price: number) {
  if (!Number.isFinite(price)) {
    return "0";
  }

  return new Intl.NumberFormat("en-BD").format(price);
}

export default function FeaturedPost({
  post,
}: FeaturedPostProps) {
  const {
    title,
    description,
    photo,
    postType,
    taka,
    status,
    user,
    category,
    createdAt,
    id,
  } = post;
 console.log(post,"fea")
  return (
    <article className="group w-full overflow-hidden rounded-2xl border bg-background shadow-sm transition-all duration-300 hover:shadow-xl">
      {/* =========================================
          IMAGE
      ========================================== */}
      <div className="relative h-[280px] w-full overflow-hidden sm:h-[360px] md:h-[450px] lg:h-[520px]">
        {photo ? (
          <Image
            src={photo}
            alt={title || "Post image"}
            fill
            priority
            sizes="
              (max-width: 640px) 100vw,
              (max-width: 1024px) 100vw,
              1200px
            "
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <span className="text-sm text-muted-foreground">
              No image available
            </span>
          </div>
        )}

        {/* Image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

        {/* =========================================
            TOP BADGES
        ========================================== */}
        <div className="absolute left-4 top-4 flex flex-wrap gap-2 sm:left-6 sm:top-6">
          <Badge
            className={
              statusStyles[status] ??
              "bg-gray-600 text-white"
            }
          >
            {status}
          </Badge>

          <Badge
            className={
              postTypeStyles[postType] ??
              "bg-white text-black"
            }
          >
            {postType}
          </Badge>
        </div>

        {/* =========================================
            PRICE
        ========================================== */}
        {postType === "PAID" && (
          <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
            <div className="rounded-full bg-white px-4 py-2 text-sm font-bold text-black shadow-lg sm:text-base">
              ৳ {formatPrice(taka)}
            </div>
          </div>
        )}

        {/* =========================================
            IMAGE CONTENT
        ========================================== */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 md:p-8 lg:p-10">
          <div className="max-w-4xl">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-green-400 sm:text-sm">
               
              </span>
            </div>

            <h1 className="line-clamp-2 text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
              {title?.trim() || "Untitled Post"}
            </h1>

            <p className="mt-3 line-clamp-2 max-w-3xl text-sm leading-6 text-white/80 sm:text-base md:text-lg">
              {description || "No description available."}
            </p>
          </div>
        </div>
      </div>

      {/* =========================================
          POST INFORMATION
      ========================================== */}
      <div className="p-5 sm:p-6 lg:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          
          {/* LEFT INFORMATION */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-4">
            
            {/* USER */}
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                ) : (
                  <User className="h-5 w-5 text-muted-foreground" />
                )}
              </div>

              <div className="min-w-0">
                <p className="max-w-[150px] truncate text-sm font-semibold">
                  {user?.name || "Unknown User"}
                </p>

                <p className="text-xs text-muted-foreground">
                  {user?.role || "USER"}
                </p>
              </div>
            </div>

            {/* DIVIDER */}
            <div className="hidden h-8 w-px bg-border sm:block" />

            {/* CATEGORY */}
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 shrink-0 text-muted-foreground" />

              <span className="max-w-[150px] truncate text-sm text-muted-foreground">
                {category?.title || "Uncategorized"}
              </span>
            </div>

            {/* DATE */}
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />

              <span className="text-sm text-muted-foreground">
                {formatDate(createdAt)}
              </span>
            </div>
          </div>

          {/* =========================================
              VIEW BUTTON
          ========================================== */}
          <Button
            
            className="w-full shrink-0 sm:w-auto"
          >
            <Link href={`/posts/${id}`}>
              View Post

              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
