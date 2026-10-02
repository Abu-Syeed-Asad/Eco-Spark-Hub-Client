"use client";

import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { changePassword } from "@/service/auth/auth.client";

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () =>
      changePassword({
        currentPassword,
        newPassword,
      }),
    onSuccess: () => {
      setCurrentPassword("");
      setNewPassword("");
      setErrorMessage(null);

      toast.add({
        type: "success",
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while changing your password.";

      setErrorMessage(message);

      toast.add({
        type: "error",
        title: "Password change failed",
        description: message,
      });
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!currentPassword.trim()) {
      setErrorMessage("Current password is required.");
      return;
    }

    if (!newPassword.trim()) {
      setErrorMessage("New password is required.");
      return;
    }

    if (newPassword.trim().length < 6) {
      setErrorMessage("New password must be at least 6 characters long.");
      return;
    }

    setErrorMessage(null);
    mutation.mutate();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl items-center justify-center">
        <Card className="w-full max-w-xl overflow-hidden border-0 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm">
          <div className="bg-linear-to-r from-emerald-600 to-teal-500 px-6 py-5 text-white sm:px-8">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white/15 p-2">
                <LockKeyhole className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-100">
                  Security
                </p>
                <h1 className="text-2xl font-semibold">Change Password</h1>
              </div>
            </div>
          </div>

          <CardHeader className="space-y-2 px-6 pb-0 pt-6 sm:px-8">
            <CardTitle className="text-xl font-semibold text-slate-900">
              Update your account password
            </CardTitle>
            <CardDescription className="text-sm text-slate-600">
              Enter your current password and choose a new one to keep your account secure.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-6 pt-6 sm:px-8">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-sm font-medium text-slate-700">
                  Current Password
                </Label>

                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    placeholder="Enter your current password"
                    className="h-11 rounded-xl border-slate-200 bg-slate-50 pr-11 focus-visible:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((value) => !value)}
                    className="absolute inset-y-0 right-3 flex items-center text-slate-500 transition hover:text-slate-700"
                    aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium text-slate-700">
                  New Password
                </Label>

                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    placeholder="Enter your new password"
                    className="h-11 rounded-xl border-slate-200 bg-slate-50 pr-11 focus-visible:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((value) => !value)}
                    className="absolute inset-y-0 right-3 flex items-center text-slate-500 transition hover:text-slate-700"
                    aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {errorMessage ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {errorMessage}
                </div>
              ) : null}

              <Button
                type="submit"
                className="h-11 w-full rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Changing password..." : "Change Password"}
              </Button>
            </form>

            <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              <ShieldCheck className="h-4 w-4" />
              Use a strong password with at least 6 characters.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChangePasswordPage;