"use client"

import { logoutAction } from "@/app/auth/logout/action"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function LogoutButton() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const shouldLogout = window.confirm("Are you sure you want to log out?")

    if (!shouldLogout) {
      event.preventDefault()
    }
  }

  return (
    <form action={logoutAction} onSubmit={handleSubmit}>
      <Button type="submit" variant="destructive" size="sm" className="gap-2">
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </form>
  )
}
