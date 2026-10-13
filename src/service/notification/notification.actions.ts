"use server";
import { http } from "@/lib/axios/axios_instance";
import type { NotificationPage } from "@/types/notification";
// Forward HttpOnly cookies from Next.js to the backend; never expose tokens to the browser.
export async function getNotifications(page = 1): Promise<NotificationPage> {
  return (await http.httpget<NotificationPage>("/notifications", { params: { page, limit: 20 } })).data;
}
export async function markNotificationRead(id: string) {
  await http.httpUpdate(`/notifications/${encodeURIComponent(id)}/read`, {});
}
export async function markAllNotificationsRead() {
  await http.httpUpdate("/notifications/read-all", {});
}
