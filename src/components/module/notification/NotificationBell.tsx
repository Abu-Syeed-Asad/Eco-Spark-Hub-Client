"use client";
import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "@/service/notification/notification.actions";
import type { NotificationItem } from "@/types/notification";
import { AppLoader } from "@/components/ui/app-loader";

export default function NotificationBell({ userId, userRole = "USER" }: { userId: string; userRole?: string }) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const client = useQueryClient();
  const key = ["notifications", userId];
  const query = useQuery({
    queryKey: [...key, page], queryFn: () => getNotifications(page),
    refetchInterval: 15000, refetchOnWindowFocus: true, staleTime: 0, retry: 1,
    meta: { globalLoading: false },
  });
  const mutation = useMutation({
    mutationFn: (id: string | null) => id ? markNotificationRead(id) : markAllNotificationsRead(),
    onSuccess: () => client.invalidateQueries({ queryKey: key }),
    onError: () => toast.error("Could not mark notifications as read. Please try again."),
    retry: false,
  });
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  const select = async (item: NotificationItem) => {
    if (!item.isRead) {
      try { await mutation.mutateAsync(item.id); } catch { return; }
    }
    const href = item.entityType === "POST_CREATED"
      ? "/dashboard/admin/all-post"
      : item.entityType === "POST_DELETED"
      ? userRole === "ADMIN" ? "/dashboard/admin/all-post" : "/dashboard/user/my-post"
      : (item.entityType === "POST" || item.entityType === "POST_UPDATED") && item.entityId
      ? item.type === "POST_REJECTED" ? userRole === "ADMIN" ? "/dashboard/admin/all-post" : "/dashboard/user/my-post" : `/posts/${encodeURIComponent(item.entityId)}`
      : item.entityType === "PAYMENT" ? userRole === "ADMIN" ? "/dashboard/admin/all-payment" : "/dashboard/user/payment" : null;
    if (href) { setOpen(false); router.push(href); }
  };
  const count = query.data?.unreadCount ?? 0;
  return (
    <div className="relative" ref={container}>
      <button ref={trigger} type="button" onClick={() => { setOpen(!open); if (!open) void query.refetch(); }} aria-label={`Notifications${count ? `, ${count} unread` : ""}`} aria-expanded={open} aria-controls="notification-panel" className="relative grid size-10 place-items-center rounded-lg hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:hover:bg-slate-800">
        <Bell className="size-5" />
        {count > 0 && <span className="absolute right-0 top-0 rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">{count > 99 ? "99+" : count}</span>}
      </button>
      {open && <section id="notification-panel" aria-label="Notifications" className="fixed right-3 top-16 z-50 w-[calc(100vw-1.5rem)] max-w-sm overflow-hidden rounded-xl border bg-white text-slate-900 shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 sm:absolute sm:right-0 sm:top-12 sm:w-96">
        <div className="flex items-center justify-between border-b p-3 dark:border-slate-700">
          <h2 className="font-semibold">Notifications</h2>
          <div className="flex items-center gap-2">
            <button type="button" disabled={!count || mutation.isPending} onClick={() => mutation.mutate(null)} className="flex items-center gap-1 text-xs text-emerald-700 disabled:opacity-50 dark:text-emerald-400"><CheckCheck className="size-4" /> Mark all read</button>
            <button type="button" aria-label="Close notifications" onClick={() => { setOpen(false); trigger.current?.focus(); }}><X className="size-4" /></button>
          </div>
        </div>
        <div className="max-h-[60vh] overflow-y-auto" aria-live="polite">
          {query.isPending ? <AppLoader compact label="Loading notifications..." className="p-6" /> : query.isError ? <div className="p-6 text-center text-sm"><p>Could not load notifications.</p><button className="mt-2 text-emerald-600" onClick={() => void query.refetch()}>Try again</button></div> : !query.data?.notifications.length ? <p className="p-6 text-center text-sm text-slate-500">You have no notifications yet.</p> : query.data.notifications.map(item => <button type="button" key={item.id} disabled={mutation.isPending} onClick={() => void select(item)} className={`block w-full border-b p-4 text-left hover:bg-slate-50 disabled:opacity-60 dark:border-slate-800 dark:hover:bg-slate-800 ${!item.isRead ? "bg-emerald-50 dark:bg-emerald-950/40" : ""}`}>
            <span className="flex items-center gap-2 text-sm font-semibold">{!item.isRead && <span className="size-2 shrink-0 rounded-full bg-emerald-500" />}{item.title}</span>
            <span className="mt-1 block text-sm text-slate-600 dark:text-slate-300">{item.message}</span>
            <time dateTime={item.createdAt} className="mt-2 block text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</time>
          </button>)}
        </div>
        {!!query.data?.totalPages && query.data.totalPages > 1 && <div className="flex items-center justify-between p-3 text-sm">
          <button disabled={page === 1 || query.isFetching} onClick={() => setPage(page - 1)} className="disabled:opacity-40">Previous</button>
          <span>Page {page} of {query.data.totalPages}</span>
          <button disabled={page >= query.data.totalPages || query.isFetching} onClick={() => setPage(page + 1)} className="disabled:opacity-40">Next</button>
        </div>}
      </section>}
    </div>
  );
}
