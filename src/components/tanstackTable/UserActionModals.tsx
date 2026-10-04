import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { UserData } from "@/components/tanstackTable/tanstackTableData";

const formatValue = (value: unknown) => {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.join(", ");
  return JSON.stringify(value);
};

const displayStatus = (status: string | undefined | null) => {
  const normalized = String(status ?? "").toUpperCase();

  if (normalized === "ACTIVE") return "Active";
  if (normalized === "DELETE" || normalized === "DELETED") return "Deleted";
  if (normalized === "BLOCK" || normalized === "BLOCKED") return "Blocked";
  return status ?? "—";
};

const roleOptions = ["USER", "ADMIN"] as const;
const statusOptions = ["ACTIVE", "DELETE", "BLOCK"] as const;

const normalizeRole = (role: string) =>
  roleOptions.find((option) => option === role.toUpperCase()) ?? "";

const normalizeStatus = (status: string) => {
  const normalized = status.toUpperCase();

  if (normalized === "DELETED") return "DELETE";
  if (normalized === "BLOCKED") return "BLOCK";

  return statusOptions.find((option) => option === normalized) ?? "";
};

const readonlyFields: Array<{ key: keyof UserData; label: string }> = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "role", label: "Role" },
  { key: "status", label: "Status" },
  { key: "needPasswordChange", label: "Password change required" },
  { key: "isDeleted", label: "Deleted" },
  { key: "emailVerified", label: "Email verified" },
  { key: "createdAt", label: "Created at" },
  { key: "updatedAt", label: "Updated at" },
  { key: "totalAmount", label: "Total amount" },
];

export function UserViewDialog({
  user,
  open,
  onOpenChange,
}: {
  user: UserData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>User details</DialogTitle>
          <DialogDescription>Review all of the selected user information.</DialogDescription>
        </DialogHeader>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {readonlyFields.map((field) => {
            const value = user[field.key];
            const isStatusField = field.key === "status";

            return (
              <div
                key={field.key}
                className={field.key === "id" ? "sm:col-span-2" : "sm:col-span-1"}
              >
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  {field.label}
                </label>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  {isStatusField ? displayStatus(String(value)) : formatValue(value)}
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function UserEditDialog({
  user,
  open,
  onOpenChange,
  onSave,
}: {
  user: UserData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedUser: UserData) => void;
}) {
  if (!user) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const nextUser: UserData = {
      ...user,
      name: String(formData.get("name") ?? user.name).trim(),
      email: String(formData.get("email") ?? user.email).trim(),
      phone: String(formData.get("phone") ?? user.phone ?? "") || null,
      role: String(formData.get("role") ?? user.role).trim(),
      status: String(formData.get("status") ?? user.status) as UserData["status"],
      totalAmount: Number(formData.get("totalAmount") ?? user.totalAmount ?? 0),
      needPasswordChange:
        String(formData.get("needPasswordChange") ?? String(user.needPasswordChange)) === "true",
      isDeleted:
        String(formData.get("isDeleted") ?? String(user.isDeleted)) === "true",
      emailVerified:
        String(formData.get("emailVerified") ?? String(user.emailVerified)) === "true",
    };

    onSave(nextUser);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit user</DialogTitle>
          <DialogDescription>Update the fields below and save your changes.</DialogDescription>
        </DialogHeader>

        <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <div className="sm:col-span-2">
            <label htmlFor="user-id" className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              ID
            </label>
            <Input id="user-id" value={user.id} readOnly className="bg-slate-50" />
          </div>

          <div>
            <label htmlFor="user-name" className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Name
            </label>
            <Input id="user-name" name="name" defaultValue={user.name} required />
          </div>

          <div>
            <label htmlFor="user-email" className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Email
            </label>
            <Input id="user-email" name="email" type="email" defaultValue={user.email} required />
          </div>

          <div>
            <label htmlFor="user-phone" className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Phone
            </label>
            <Input id="user-phone" name="phone" defaultValue={user.phone ?? ""} />
          </div>

          <div>
            <label htmlFor="user-role" className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Role
            </label>
            <select
              id="user-role"
              name="role"
              defaultValue={normalizeRole(user.role)}
              required
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="" disabled>Select a role</option>
              {roleOptions.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="user-status" className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Status
            </label>
            <select
              id="user-status"
              name="status"
              defaultValue={normalizeStatus(user.status)}
              required
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="" disabled>Select a status</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="user-totalAmount" className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Total amount
            </label>
            <Input id="user-totalAmount" name="totalAmount" type="number" defaultValue={user.totalAmount ?? 0} />
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 sm:col-span-2">
            <input id="user-password-change" type="checkbox" name="needPasswordChange" defaultChecked={user.needPasswordChange} />
            <label htmlFor="user-password-change" className="text-sm text-slate-700">Password change required</label>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 sm:col-span-1">
            <input id="user-is-deleted" type="checkbox" name="isDeleted" defaultChecked={user.isDeleted} />
            <label htmlFor="user-is-deleted" className="text-sm text-slate-700">Deleted</label>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 sm:col-span-1">
            <input id="user-email-verified" type="checkbox" name="emailVerified" defaultChecked={user.emailVerified} />
            <label htmlFor="user-email-verified" className="text-sm text-slate-700">Email verified</label>
          </div>

          <DialogFooter className="sm:col-span-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function UserDeleteDialog({
  user,
  open,
  onOpenChange,
  onConfirm,
}: {
  user: UserData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete user?</DialogTitle>
          <DialogDescription>
            This action will remove <span className="font-semibold text-slate-900">{user.name}</span> from the current list.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p><span className="font-semibold">Email:</span> {user.email}</p>
          <p><span className="font-semibold">ID:</span> {user.id}</p>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={() => {
            onConfirm();
            onOpenChange(false);
          }}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
