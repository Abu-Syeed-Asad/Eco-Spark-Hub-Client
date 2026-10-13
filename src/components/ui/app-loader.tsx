import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type AppLoaderProps = {
  label?: string;
  compact?: boolean;
  className?: string;
};

export function AppLoader({
  label = "Loading...",
  compact = false,
  className,
}: AppLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={cn(
        "flex min-w-0 items-center justify-center gap-3 text-sm text-muted-foreground",
        compact ? "py-4" : "min-h-48 w-full flex-col py-10",
        className,
      )}
    >
      <LoaderCircle
        aria-hidden="true"
        className={cn(
          "shrink-0 animate-spin text-emerald-600 motion-reduce:animate-none dark:text-emerald-400",
          compact ? "size-4" : "size-8",
        )}
      />
      <span>{label}</span>
    </div>
  );
}
