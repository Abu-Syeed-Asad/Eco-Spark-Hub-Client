
import AppOtp from "@/components/module/forms/AppOtp";

interface Props {
  searchParams: Promise<{
    email?: string;
  }>;
}

const VerifyEmailPage = async ({ searchParams }: Props) => {
  const { email } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-10">
      <AppOtp email={email ?? ""} />
    </div>
  );
};

export default VerifyEmailPage;