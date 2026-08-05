/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useMemo, useState } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { FieldContent, FieldLabel } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import AppSubminButton from "./AppSubminButton";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MailCheckIcon, RefreshCcw } from "lucide-react";
import { verifyEmailAction, resendVerifyEmailAction } from "@/app/auth/verify-email/_action";

interface AppOtpProps {
  email: string;
}

const AppOtp = ({ email }: AppOtpProps) => {
  const [otpCode, setOtpCode] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [message, setMessage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setMessage("Enter the 6-digit OTP before submitting.");
      return;
    }

    setMessage(null);
    setIsVerifying(true);

    try {
      await verifyEmailAction({ email, otp: otpCode });
    } catch (error: any) {
      setMessage(error?.message ?? "Unable to verify OTP. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setMessage(null);
    setIsResending(true);

    try {
      await resendVerifyEmailAction({ email });
      setMessage("A new OTP has been sent to your email.");
      setResendTimer(30);
    } catch (error: any) {
      setMessage(error?.message ?? "Unable to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = window.setTimeout(() => setResendTimer((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [resendTimer]);

  const isValidOtp = useMemo(() => otpCode.length === 6, [otpCode]);

  return (
    <div className="h-full min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-xl text-center shadow-xl">
        <CardHeader className="px-8 pt-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MailCheckIcon className="h-6 w-6" />
          </div>
          <CardTitle className="mt-4 text-2xl font-semibold">Verify Your Email</CardTitle>
          <CardDescription className="mt-2 text-sm text-muted-foreground">
            An OTP has been sent to <span className="font-medium text-foreground">{email}</span>. Enter it below to complete registration.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 px-8 pb-4 pt-4">
          <CardDescription className="text-sm text-muted-foreground">
            Enter the 6-digit code from your email to verify your account.
          </CardDescription>

          {message && (
            <Alert variant="destructive">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <FieldContent className="mx-auto w-fit">
            <FieldLabel htmlFor="digits-only" className="sr-only">
              OTP Code
            </FieldLabel>
            <InputOTP
              id="digits-only"
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS}
              value={otpCode}
              onChange={(value) => setOtpCode(value)}
              textAlign="center"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </FieldContent>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              disabled={resendTimer > 0 || isResending}
              onClick={handleResend}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
            </Button>

            <AppSubminButton
              type="submit"
              onClick={handleVerify}
              className="w-full sm:w-auto"
              isPending={isVerifying}
              pendingLabel="Verifying..."
              disabled={!isValidOtp || isVerifying}
            >
              Verify OTP
            </AppSubminButton>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 px-8 pb-8 pt-0 text-sm text-muted-foreground">
          <span>If you did not receive the email, check your spam folder or request a new code.</span>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AppOtp;
