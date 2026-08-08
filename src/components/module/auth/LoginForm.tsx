/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { loginSchema, LoginType } from '@/validation/auth/login.schema';
import { useForm } from '@tanstack/react-form';
import React, {  useState } from 'react';
import AppField from '../forms/AppField';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AppSubminButton from '../forms/AppSubminButton';
import ContinueWithGoogle from '../forms/ContinueWithGoogle';
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '@/app/auth/login/_action';




interface LoginFormProps {
  redirectUrl?: string;
}
const LoginForm = ({ redirectUrl }: LoginFormProps) => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync } = useMutation({
    mutationFn: (payload: LoginType) => loginUser(payload, redirectUrl),
  });

  const loginform = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const redirectPath = await mutateAsync(value);
        if (redirectPath) {
          router.push(redirectPath as string);
        }
      } catch (error: any) {
        setServerError(`Login failed: ${error?.message ?? String(error)}`);
      }
    },
  });
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8 bg-slate-50">
      <div className="w-full max-w-xl">
        <Card className="w-full">
          <CardHeader className='text-center'>
            <CardTitle >
              Welcome Back !
            </CardTitle>
            <CardDescription>
              Please Enter Your Credentials To Log In
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                loginform.handleSubmit();
              }}
            >
              <loginform.Field
                name="email"
                validators={{ onChange: loginSchema.shape.email }}
              >
                {(field) => (
                  <AppField
                    field={field}
                    labelName="Email"
                    type="email"
                    placeholder="Enter Your Email"
                  />
                )}
              </loginform.Field>
              <loginform.Field
                name="password"
                validators={{ onChange: loginSchema.shape.password }}
              >
                {(field) => (
                  <AppField
                    labelName="Password"
                    field={field}
                    placeholder="Enter Your Password"
                    type={showPassword ? "text" : "password"}
                    append={
                      <Button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        variant="ghost"
                        size="icon"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </Button>
                    }
                  />
                )}
              </loginform.Field>
              <div className="text-right">
                <Link href="/auth/forget-password" className="text-sm hover:underline underline-offset-4">
                  Forget password
                </Link>
              </div>
              {serverError && (
                <Alert variant="destructive" className='text-center'>
                  <AlertDescription>{serverError}</AlertDescription>
                </Alert>
              )}
              <loginform.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                  <AppSubminButton isPending={isSubmitting} pendingLabel="Log In .... " disabled={!canSubmit} >
                    Log In
                  </AppSubminButton>
                )}
              </loginform.Subscribe>
            </form>
            <div className="relative ">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
         
               
           <ContinueWithGoogle></ContinueWithGoogle>
              
          </CardContent>
          <CardFooter className="justify-center border-t pt-4">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/auth/register" className="text-primary font-medium hover:underline underline-offset-4">
                Sign Up for an account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
export default LoginForm;