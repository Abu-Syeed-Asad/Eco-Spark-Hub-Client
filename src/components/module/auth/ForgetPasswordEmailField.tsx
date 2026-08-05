/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { loginSchema } from '@/validation/auth/login.schema';
import { useForm } from '@tanstack/react-form';
import React, { useState } from 'react';
import AppField from '../forms/AppField';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AppSubminButton from '../forms/AppSubminButton';
import { useMutation } from '@tanstack/react-query';
import { OTPdSenderForForgetPassword } from '@/app/auth/forget-password/_action';


const ForgetPasswordEmailField = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const {mutateAsync } = useMutation({
  mutationFn:async (email:string)=> OTPdSenderForForgetPassword(email),
})

  const forgetForm = useForm({
    defaultValues: {
      email:'',
    }, 
    onSubmit: async ({ value }) => {
      setServerError(null)
      try {
        await mutateAsync(value.email) as any;
      } catch (error) {
         setServerError(
          error instanceof Error
      ? error.message
      : "Something went wrong"
  );
      }
    
   
    }
  })

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8 bg-slate-50">
    <Card className="mx-auto w-full max-w-md shadow-lg">
  <CardHeader className="space-y-2 text-center">
    <CardTitle className="text-2xl font-bold">
      Forgot Password
    </CardTitle>

    <p className="text-sm text-muted-foreground">
      Enter your email address and will send you a verification OTP.
    </p>
  </CardHeader>

  <CardContent>
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        forgetForm.handleSubmit();
      }}
    >
      <forgetForm.Field
        name="email"
        validators={{
          onChange: loginSchema.shape.email,
        }}
      >
        {(field) => (
          <AppField
            field={field}
            labelName="Email Address"
            placeholder="john@example.com"
            type="email"
          />
        )}
      </forgetForm.Field>

      {serverError && (
        <Alert variant="destructive">
          <AlertDescription>
            {serverError}
          </AlertDescription>
        </Alert>
      )}

      <forgetForm.Subscribe
        selector={(s) => [s.canSubmit, s.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <AppSubminButton
            type="submit"
            isPending={isSubmitting}
            pendingLabel="Sending OTP..."
            disabled={!canSubmit}
            className="w-full"
          >
            Send OTP
          </AppSubminButton>
        )}
      </forgetForm.Subscribe>
    </form>
  </CardContent>
</Card>
    </div>
  );
};

export default ForgetPasswordEmailField;