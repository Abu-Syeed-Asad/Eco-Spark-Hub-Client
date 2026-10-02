"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";

import { allApprovedPost } from "@/service/post/allAprovedPost";
import FeaturedPost from "./FeaturePost";


export default function Post() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["all-approve-post"],
    queryFn: allApprovedPost,
  });

  // ================================
  // LOADING
  // ================================
  if (isLoading) {
    return (
      <section className="w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="h-[400px] w-full animate-pulse rounded-3xl bg-muted" />
        </div>
      </section>
    );
  }

  // ================================
  // ERROR
  // ================================
  if (isError) {
    return (
      <section className="w-full px-4 py-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <h2 className="text-lg font-semibold text-destructive">
            Failed to load posts
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "Something went wrong."}
          </p>
        </div>
      </section>
    );
  }

  // ================================
  // EMPTY
  // ================================
  if (!data || data.length === 0) {
    return (
      <section className="w-full px-4 py-8">
        <div className="mx-auto max-w-7xl rounded-2xl border p-10 text-center">
          <h2 className="text-xl font-semibold">
            No approved posts found
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            There are currently no posts available.
          </p>
        </div>
      </section>
    );
  }

  // ================================
  // POSTS
  // ================================
  return (
    <section className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Section heading */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
            Explore
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Latest Approved Posts
          </h2>

          <p className="mt-2 max-w-2xl text-muted-foreground">
            Discover the latest content shared by our community.
          </p>
        </div>

        {/* Posts */}
        <div className="space-y-8">
          {data?.map((post) => (
            <FeaturedPost
              key={post.id}
              post={post}
            />
          ))}
        </div>

      </div>
    </section>
  );
}