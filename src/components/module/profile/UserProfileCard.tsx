import Link from "next/link"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { IUser } from "@/types/auth.type"
import {
  CalendarDays,
  CheckCircle2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react"

import EditProfileDialog from "./EditProfileDialog"
import LogoutButton from "./LogoutButton"

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount)

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(value))

const formatPhone = (value: string | null) => {
  if (!value) return "Not provided"

  return value
}

export default function UserProfileCard({ user }: { user: IUser }) {
  const initials = getInitials(user.name || "User")

  return (
    <Card className="overflow-hidden border-0 bg-linear-to-br from-background via-background to-primary/5 shadow-[0_24px_80px_-24px_rgba(15,23,42,0.28)]">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Avatar size="lg" className="h-16 w-16 border-4 border-background shadow-lg sm:h-20 sm:w-20">
              {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-xl font-semibold tracking-tight sm:text-2xl">
                  {user.name}
                </CardTitle>
                <Badge
                  variant={user.emailVerified ? "default" : "secondary"}
                  className="gap-1"
                >
                  {user.emailVerified ? (
                    <>
                      <CheckCircle2 className="h-3 w-3" />
                      Email verified
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3 w-3" />
                      Verification pending
                    </>
                  )}
                </Badge>
              </div>

              <CardDescription className="flex items-center gap-2 break-all text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                {user.email}
              </CardDescription>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  {user.role}
                </Badge>
                <Badge
                  variant={user.status === "ACTIVE" ? "default" : "destructive"}
                  className="gap-1"
                >
                  {user.status}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
            <EditProfileDialog user={user} />
            <Link href="/auth/change-password" className="w-full sm:w-auto">
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <LockKeyhole className="h-4 w-4" />
                Change password
              </Button>
            </Link>
            <LogoutButton />
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid gap-4 border-t bg-muted/20 p-4 sm:grid-cols-2 xl:grid-cols-2">
        <div className="rounded-xl border bg-background p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <WalletCards className="h-4 w-4 text-primary" />
            Total Amount
          </div>
          <div className="mt-3 text-2xl font-bold text-primary">
            {formatCurrency(user.totalAmount || 0)}
          </div>
        </div>

        <div className="rounded-xl border bg-background p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4 text-primary" />
            Joined
          </div>
          <div className="mt-3 text-lg font-semibold">{formatDate(user.createdAt)}</div>
        </div>

        <div className="rounded-xl border bg-background p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            Phone
          </div>
          <div className="mt-3 text-lg font-semibold">
            {formatPhone(user.phone)}
          </div>
        </div>

        <div className="rounded-xl border bg-background p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            Account status
          </div>
          <div className="mt-3 text-lg font-semibold">
            {user.needPasswordChange ? "Password reset needed" : "Active account"}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
