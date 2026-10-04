"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import BasicTanstackTable from "@/components/tanstackTable/BasicTanstackTable";
import { columns, type UserData } from "@/components/tanstackTable/tanstackTableData";
import {
  UserDeleteDialog,
  UserEditDialog,
  UserViewDialog,
} from "@/components/tanstackTable/UserActionModals";
import {
  deleteUserByAdmin,
  updateUserByAdmin,
} from "@/service/auth/auth.client";
import type { IAdminUserUpdatePayload } from "@/types/auth.type";
import { getDashboardAllUser } from "@/service/dashboard/allUser";

const AllUsr = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<UserData[]>({
    queryKey: ["dashboard-all-user"],
    queryFn: () => getDashboardAllUser<UserData[]>(),
  });

  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [activeDialog, setActiveDialog] = useState<"view" | "edit" | "delete" | null>(null);

  const userList = useMemo(() => data ?? [], [data]);

  const updateUserMutation = useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: IAdminUserUpdatePayload }) =>
      updateUserByAdmin(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-all-user"] });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => deleteUserByAdmin(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-all-user"] });
    },
  });

  const handleAction = (action: "view" | "edit" | "delete", user: UserData) => {
    setSelectedUser(user);
    setActiveDialog(action);
  };

  const handleSaveUser = (updatedUser: UserData) => {
    if (!selectedUser) return;

    const payload: IAdminUserUpdatePayload = {
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      image: updatedUser.image,
      role: updatedUser.role,
      status: updatedUser.status,
    };

    updateUserMutation.mutate({ userId: selectedUser.id, payload });
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    deleteUserMutation.mutate(selectedUser.id);
  };

  return (
    <div>
      <BasicTanstackTable
        data={userList}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No users found."
        onAction={handleAction}
      />

      <UserViewDialog
        user={activeDialog === "view" ? selectedUser : null}
        open={activeDialog === "view"}
        onOpenChange={(open) => {
          if (!open) setActiveDialog(null);
        }}
      />

      <UserEditDialog
        user={activeDialog === "edit" ? selectedUser : null}
        open={activeDialog === "edit"}
        onOpenChange={(open) => {
          if (!open) setActiveDialog(null);
        }}
        onSave={handleSaveUser}
      />

      <UserDeleteDialog
        user={activeDialog === "delete" ? selectedUser : null}
        open={activeDialog === "delete"}
        onOpenChange={(open) => {
          if (!open) setActiveDialog(null);
        }}
        onConfirm={handleDeleteUser}
      />
    </div>
  );
};

export default AllUsr;