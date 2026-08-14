import React from "react";
import { IUser } from "@/types/auth.type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const UserProfile: React.FC<{ userInfo: IUser }> = ({ userInfo }) => {
  const firstTwoLetters = userInfo.name.slice(0, 2).toUpperCase();

  return (
    <div className="space-y-2">
      <Separator />
      
      <div className="px-4 py-4 space-y-3">
        {/* User Avatar and Info */}
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 shrink-0">
            {userInfo.image && <AvatarImage src={userInfo.image} alt={userInfo.name} />}
            <AvatarFallback className="bg-blue-500 text-white font-medium">
              {firstTwoLetters}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 overflow-hidden">
            <h3 className="font-semibold text-sm truncate">{userInfo.name}</h3>
            <p className="text-xs text-muted-foreground truncate">{userInfo.email}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;
