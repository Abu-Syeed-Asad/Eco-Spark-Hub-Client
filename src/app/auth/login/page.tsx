import LoginForm from '@/components/module/auth/LoginForm';
import React from 'react';

interface LoginParams {
  searchParams: Promise<{
    redirect?: string;
  }>;
}

const LoginPage = async ({
  searchParams,
}: LoginParams) => {

  const params = await searchParams;

  const redirectUrl = params.redirect;
  return (
    <div>
      <LoginForm redirectUrl={redirectUrl} />
    </div>
  );
};

export default LoginPage;