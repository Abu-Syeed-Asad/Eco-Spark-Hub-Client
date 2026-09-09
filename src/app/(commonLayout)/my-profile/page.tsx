import { redirect } from "next/navigation";

export default function MyProfilePage() {
  redirect("/auth/me");
}
