"use client";

import { useIsFetching, useIsMutating } from "@tanstack/react-query";

/** Opt out of global feedback with meta: { globalLoading: false }. */
export function GlobalLoading() {
  const fetching = useIsFetching({
    type: "active",
    predicate: (query) => query.meta?.globalLoading !== false,
  });
  const mutating = useIsMutating({
    predicate: (mutation) =>
      mutation.options.meta?.globalLoading !== false && !mutation.state.isPaused,
  });

  if (fetching + mutating === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      data-global-loading
      className="global-loading pointer-events-none fixed inset-x-0 top-0 z-[100] h-1 overflow-hidden bg-emerald-100 dark:bg-emerald-950"
    >
      <span className="global-loading-bar absolute inset-y-0 left-0 w-1/3 rounded-full bg-emerald-600 dark:bg-emerald-400" />
      <span className="sr-only">{mutating > 0 ? "Saving changes..." : "Loading content..."}</span>
    </div>
  );
}
