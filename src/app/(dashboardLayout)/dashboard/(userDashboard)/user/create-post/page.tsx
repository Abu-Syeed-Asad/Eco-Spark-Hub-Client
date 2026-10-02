import { redirect } from "next/navigation";

import CreatePostForm from "@/components/module/forms/CreatePostForm";
import { getUserInfo } from "@/service/auth/auth.service";

const CreatePost = async () => {
  const user = await getUserInfo();

  if (!user?.id) {
    redirect("/auth/login");
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <CreatePostForm userId={user.id} />
    </div>
  );
};

export default CreatePost;