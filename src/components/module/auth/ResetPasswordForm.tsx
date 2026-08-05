"use client"

import { IResetPasswordPayload, resetPassword } from '@/app/auth/reset-password/_action';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldLabel } from '@/components/ui/field';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import AppField from '../forms/AppField';
import AppSubminButton from '../forms/AppSubminButton';
import { loginSchema } from '@/validation/auth/login.schema';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';


const ResetPasswordForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get('email') ?? '';

  const { mutateAsync } = useMutation({
    mutationFn: async (payload: IResetPasswordPayload) => resetPassword(payload),
  });

  const resetForm = useForm({
    defaultValues: {
      email: emailFromQuery,
      otp: '',
      newPassword: '',
    },
    onSubmit: async ({ value }) => {
      setServerError(null);

      const payload: IResetPasswordPayload = {
        email: String(value.email ?? '').trim(),
        otp: String(value.otp ?? '').replace(/\D/g, ''),
        newPassword: String(value.newPassword ?? ''),
      };

      try {
        await mutateAsync(payload);
      } catch (error: unknown) {
        setServerError(error instanceof Error ? error.message : 'Something went wrong.');
      }
    },
  });



  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-semibold">Reset Password</CardTitle>
          <CardDescription>Enter your OTP and a new password to secure your account.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form
            className="space-y-5"
            onSubmit={ async(e) => {
              e.preventDefault();
              e.stopPropagation();
             await resetForm.handleSubmit();
            }}
          >
            <resetForm.Field name="email" validators={{ onChange: loginSchema.shape.email }}>
              {(field) => (
                <AppField
                  field={field}
                  labelName="Email Address"
                  placeholder="user@example.com"
                  type="email"
                  disabled
                />
              )}
            </resetForm.Field>

            <resetForm.Field
              name="otp"
              validators={{
                onChange: ({ value }: { value: string }) =>
                  value.trim().length === 6 ? undefined : 'OTP must be exactly 8 digits.',
              }}
            >
              {(field) => (
                <Field className="space-y-2">
                  <FieldLabel htmlFor={field.name}>Verification Code</FieldLabel>
                  <div className="mx-auto w-fit">
                    <InputOTP
                      id="reset-password-otp"
                      maxLength={6}
                      pattern={REGEXP_ONLY_DIGITS}
                      value={String(field.state.value ?? '')}
                      onChange={(value) => field.handleChange(value)}
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
                  </div>
                  {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive" role="alert">
                      {field.state.meta.errors.map((error) => String(error)).join(', ')}
                    </p>
                  )}
                </Field>
              )}
            </resetForm.Field>

            <resetForm.Field name="newPassword" validators={{ onChange: loginSchema.shape.password }}>
              {(field) => (
                <AppField
                  field={field}
                  labelName="New Password"
                  placeholder="Create a secure password"
                  type={showPassword ? 'text' : 'password'}
                  append={
                    <Button type="button" onClick={() => setShowPassword((value) => !value)} variant="ghost" size="icon">
                      {showPassword ? <EyeOff /> : <Eye />}
                    </Button>
                  }
                />
              )}
            </resetForm.Field>

            {serverError && (
              <Alert variant="destructive">
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            <resetForm.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <AppSubminButton type="submit" isPending={isSubmitting} pendingLabel="Resetting..." disabled={!canSubmit}>
                  Reset Password
                </AppSubminButton>
              )}
            </resetForm.Subscribe>
          </form>
        </CardContent>

        <CardFooter className="text-sm text-muted-foreground">
          <p>After a successful reset, you will be redirected to the login page.</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPasswordForm;