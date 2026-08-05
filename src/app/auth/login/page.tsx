import LoginForm from '@/components/module/auth/LoginForm';
import React from 'react';

interface LoginParamas {
  searchParams: Promise<{redirect?:string} >;
}

const LoginPage = async({searchParams}:LoginParamas) => {
  const params = await searchParams;
  const redirectUrl = params.redirect;
  return (
    <div>
      <LoginForm redirectUrl={redirectUrl} />
    </div>
  );
};

export default LoginPage;