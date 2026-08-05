/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { registerSchema, RegisterType } from '@/validation/auth/register.schema';
import { useForm } from '@tanstack/react-form';
import React, { useState } from 'react';
import AppField from '../forms/AppField';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AppSubminButton from '../forms/AppSubminButton';
import ContinueWithGoogle from '../forms/ContinueWithGoogle';
import { useMutation } from '@tanstack/react-query';
import { RegisterUser } from '@/app/auth/register/_action';

const RegisterForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {mutateAsync } = useMutation({
    mutationFn:(payload:RegisterType)=>(RegisterUser(payload))
  })

  const registerForm = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      try {
        setServerError(null)
         await mutateAsync(value) as any;
      } catch (error: any) {
        setServerError(`Register failed: ${error?.message ?? String(error)}`)
      }
    },
  });

  return (
    <div className='min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8 bg-slate-50'>
      <div className='w-full max-w-xl'>
        <Card className='w-full'>
          <CardHeader className='text-center'>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>Create your account and start using </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <form
              className='space-y-5'
              onSubmit={(e) => {
                e.preventDefault();
                registerForm.handleSubmit();
              }}
            >
              <registerForm.Field name='name' validators={{ onChange: registerSchema.shape.name }}>
                {(field) => (
                  <AppField
                    field={field}
                    labelName='Name'
                    type='text'
                    placeholder='Enter Your Name'
                  />
                )}
              </registerForm.Field>

              <registerForm.Field name='email' validators={{ onChange: registerSchema.shape.email }}>
                {(field) => (
                  <AppField
                    field={field}
                    labelName='Email'
                    type='email'
                    placeholder='Enter Your Email'
                  />
                )}
              </registerForm.Field>

              <registerForm.Field name='password' validators={{ onChange: registerSchema.shape.password }}>
                {(field) => (
                  <AppField
                    field={field}
                    labelName='Password'
                    placeholder='Enter Your Password'
                    type={showPassword ? 'text' : 'password'}
                    append={
                      <Button
                        type='button'
                        onClick={() => setShowPassword((value) => !value)}
                        variant='ghost'
                        size='icon'
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </Button>
                    }
                  />
                )}
              </registerForm.Field>

              {serverError &&  (
                <Alert variant='destructive'>
                  <AlertDescription>{serverError}</AlertDescription>
                </Alert>
              )}

              <registerForm.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                  <AppSubminButton isPending={isSubmitting} pendingLabel='Registering ...' disabled={!canSubmit}>
                    Create Account
                  </AppSubminButton>
                )}
              </registerForm.Subscribe>
            </form>

            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300'></div>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-white text-gray-500'>Or continue with</span>
              </div>
            </div>

            <ContinueWithGoogle />
          </CardContent>
          <CardFooter className='justify-center border-t pt-4'>
            <p className='text-sm text-muted-foreground'>
              Already have an account?{' '}
              <Link href='/auth/login' className='text-primary font-medium hover:underline underline-offset-4'>
                Log In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};


export default RegisterForm;