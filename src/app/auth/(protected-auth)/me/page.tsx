import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UserProfileCard from "@/components/module/profile/UserProfileCard";
import { getUserInfo } from "@/service/auth/auth.service";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(value));

const UserInformation = async () => {
  const user = await getUserInfo();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <main className="min-h-screen bg-muted/20 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <UserProfileCard user={user} />

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Review account details and update your public profile when needed.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1 rounded-xl border bg-muted/20 p-4">
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="text-base font-medium">{user.name}</p>
            </div>

            <div className="space-y-1 rounded-xl border bg-muted/20 p-4">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-base font-medium">{user.email}</p>
            </div>

            <div className="space-y-1 rounded-xl border bg-muted/20 p-4">
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="text-base font-medium">{user.role}</p>
            </div>

            <div className="space-y-1 rounded-xl border bg-muted/20 p-4">
              <p className="text-sm text-muted-foreground">Status</p>
              <div className="mt-1 flex items-center">
                <Badge variant={user.status === "ACTIVE" ? "default" : "destructive"}>
                  {user.status}
                </Badge>
              </div>
            </div>

            <div className="space-y-1 rounded-xl border bg-muted/20 p-4">
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="text-base font-medium">{user.phone ?? "Not provided"}</p>
            </div>

            <div className="space-y-1 rounded-xl border bg-muted/20 p-4">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-base font-semibold text-primary">
                {formatCurrency(user.totalAmount ?? 0)}
              </p>
            </div>

            <div className="space-y-1 rounded-xl border bg-muted/20 p-4 md:col-span-2">
              <p className="text-sm text-muted-foreground">Joined Date</p>
              <p className="text-base font-medium">{formatDate(user.createdAt)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default UserInformation;