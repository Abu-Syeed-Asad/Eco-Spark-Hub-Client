"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ImagePlus, Loader2, PencilLine } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/toast"
import { updateUserProfile } from "@/service/auth/auth.client"
import type { IUser } from "@/types/auth.type"

const editProfileSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  phone: z.string().trim().optional(),
  image: z.string().nullable().optional(),
})

type EditProfileValues = z.infer<typeof editProfileSchema>

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

const MAX_IMAGE_PAYLOAD_SIZE = 100000

const readFileAsDataUrl = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result)
        return
      }

      reject(new Error("Unable to read the selected image."))
    }

    reader.onerror = () => reject(new Error("Unable to read the selected image."))
    reader.readAsDataURL(file)
  })
}

const compressDataUrl = (dataUrl: string, quality: number) => {
  return new Promise<string>((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      const canvas = document.createElement("canvas")
      const maxWidth = 1200
      const scale = Math.min(maxWidth / img.width, maxWidth / img.height, 1)

      canvas.width = Math.max(1, Math.round(img.width * scale))
      canvas.height = Math.max(1, Math.round(img.height * scale))

      const context = canvas.getContext("2d")

      if (!context) {
        reject(new Error("Unable to process the selected image."))
        return
      }

      context.fillStyle = "#ffffff"
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.drawImage(img, 0, 0, canvas.width, canvas.height)

      resolve(canvas.toDataURL("image/jpeg", quality))
    }

    img.onerror = () => reject(new Error("Unable to process the selected image."))
    img.src = dataUrl
  })
}

const compressProfileImage = async (file: File) => {
  const originalDataUrl = await readFileAsDataUrl(file)

  if (originalDataUrl.length <= MAX_IMAGE_PAYLOAD_SIZE) {
    return originalDataUrl
  }

  let quality = 0.8
  let compressedDataUrl = originalDataUrl

  while (compressedDataUrl.length > MAX_IMAGE_PAYLOAD_SIZE && quality > 0.3) {
    compressedDataUrl = await compressDataUrl(originalDataUrl, quality)
    quality -= 0.1
  }

  return compressedDataUrl.length <= MAX_IMAGE_PAYLOAD_SIZE ? compressedDataUrl : null
}

export default function EditProfileDialog({ user }: { user: IUser }) {
  const [open, setOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(user.image)

  const queryClient = useQueryClient()

  const form = useForm<EditProfileValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user.name,
      phone: user.phone ?? "",
      image: user.image,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        name: user.name,
        phone: user.phone ?? "",
        image: user.image,
      })
      setPreviewImage(user.image)
    }
  }, [open, user, form])

  const mutation = useMutation({
    mutationFn: async (values: EditProfileValues) => {
      const trimmedName = values.name.trim()
      const trimmedPhone = values.phone?.trim() || null

      return await updateUserProfile({
        name: trimmedName,
        phone: trimmedPhone,
        image: values.image ?? null,
      })
    },
    onSuccess: async (updatedUser) => {
      const nextUser = updatedUser ?? {
        ...user,
        name: form.getValues("name").trim(),
        phone: form.getValues("phone")?.trim() || null,
        image: previewImage ?? null,
      }

      queryClient.setQueryData(["user"], nextUser)
      await queryClient.invalidateQueries({ queryKey: ["user"] })

      toast.add({
        type: "success",
        title: "Profile updated",
        description: "Your profile details were updated successfully.",
      })

      setOpen(false)
      form.reset({
        name: nextUser.name,
        phone: nextUser.phone ?? "",
        image: nextUser.image ?? null,
      })
    },
    onError: (error) => {
      toast.add({
        type: "error",
        title: "Update failed",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong while updating your profile.",
      })
    },
  })

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    try {
      const compressedImage = await compressProfileImage(file)

      setPreviewImage(compressedImage)
      form.setValue("image", compressedImage ?? null, {
        shouldDirty: true,
        shouldTouch: true,
      })
    } catch {
      toast.add({
        type: "error",
        title: "Image upload failed",
        description: "The selected image could not be processed. Please try another file.",
      })
    }

    event.target.value = ""
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <PencilLine className="h-4 w-4" />
        Edit profile
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Update your public profile details below. Read-only fields remain locked.
            </DialogDescription>
          </DialogHeader>

          <form
            className="space-y-6"
            onSubmit={form.handleSubmit((values: EditProfileValues) => mutation.mutate(values))}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Avatar size="lg" className="h-20 w-20 border-4 border-background">
                {previewImage ? <AvatarImage src={previewImage} alt={user.name} /> : null}
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>

              <div className="space-y-2">
                <Label htmlFor="profile-image">Profile image</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const input = document.getElementById("profile-image") as HTMLInputElement | null
                      input?.click()
                    }}
                  >
                    <ImagePlus className="h-4 w-4" />
                    Upload image
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {previewImage ? "Preview ready" : "No image selected"}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="profile-name">Name</Label>
                <Input id="profile-name" {...form.register("name")} />
                {form.formState.errors.name ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.name.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-email">Email</Label>
                <Input id="profile-email" value={user.email} disabled readOnly />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-role">Role</Label>
                <Input id="profile-role" value={user.role} disabled readOnly />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-status">Status</Label>
                <Input id="profile-status" value={user.status} disabled readOnly />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-phone">Phone</Label>
                <Input
                  id="profile-phone"
                  {...form.register("phone")}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-total-amount">Total amount</Label>
                <Input id="profile-total-amount" value={user.totalAmount ?? 0} disabled readOnly />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
