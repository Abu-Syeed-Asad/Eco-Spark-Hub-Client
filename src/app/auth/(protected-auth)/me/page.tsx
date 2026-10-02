import { redirect } from "next/navigation";



import UserProfileCard from "@/components/module/profile/UserProfileCard";
import { getUserInfo } from "@/service/auth/auth.service";


const UserInformation = async () => {
  const user = await getUserInfo();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <main className="h-full min-h-0 overflow-x-hidden bg-muted/20 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-8 pb-8">
          <UserProfileCard user={user} />
        </div>
    </main>
  );
};

export default UserInformation;