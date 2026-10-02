"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, Sprout } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { allCategory } from "@/service/category/categoryservice";
import { createPost, type CreatePostPayload } from "@/service/post/allAprovedPost";
import type { PostCategory, PostType } from "@/types/post";

const createPostSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters."),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters."),
  photo: z.string().refine(
    (value) => value === "" || value.startsWith("data:image/jpeg;base64,"),
    "Choose a valid image file."
  ),
  postType: z.enum(["FREE", "PAID", "UNPAID"]),
  taka: z
    .number({ error: "Enter a valid amount." })
    .finite("Enter a valid amount.")
    .min(0, "Amount cannot be negative."),
  categoryId: z.string().min(1, "Choose a category."),
});

export type FormData = z.infer<typeof createPostSchema>;

const defaultValues: FormData = {
  title: "",
  description: "",
  photo: "",
  postType: "FREE",
  taka: 0,
  categoryId: "",
};

const postTypes: PostType[] = ["FREE", "PAID", "UNPAID"];
const MAX_IMAGE_DATA_URL_LENGTH = 100_000;
const MAX_IMAGE_FILE_SIZE = 10 * 1024 * 1024;

const getErrorMessage = (error: Error) => error.message || "Something went wrong.";

const readImageFile = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Unable to read the selected image."));
      }
    };
    reader.onerror = () => reject(new Error("Unable to read the selected image."));
    reader.readAsDataURL(file);
  });

const compressImageFile = async (file: File) => {
  if (!file.type.startsWith("image/")) {
    throw new Error("Choose an image file.");
  }

  if (file.size > MAX_IMAGE_FILE_SIZE) {
    throw new Error("Image must be 10 MB or smaller.");
  }

  const source = await readImageFile(file);
  const image = new window.Image();
  image.src = source;
  await image.decode();

  const canvas = document.createElement("canvas");
  const maxDimension = 1200;
  const scale = Math.min(maxDimension / image.width, maxDimension / image.height, 1);
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Unable to process the selected image.");
  }

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  let quality = 0.8;
  let compressedImage = canvas.toDataURL("image/jpeg", quality);
  while (compressedImage.length > MAX_IMAGE_DATA_URL_LENGTH && quality > 0.3) {
    quality -= 0.1;
    compressedImage = canvas.toDataURL("image/jpeg", quality);
  }

  if (compressedImage.length > MAX_IMAGE_DATA_URL_LENGTH) {
    throw new Error("This image could not be compressed small enough. Choose a smaller image.");
  }

  return compressedImage;
};

export default function CreatePostForm({ userId }: { userId: string }) {
  const queryClient = useQueryClient();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const form = useForm<FormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues,
    mode: "onBlur",
  });

  const categoriesQuery = useQuery<PostCategory[], Error>({
    queryKey: ["post-categories"],
    queryFn: allCategory,
  });

  useEffect(() => {
    if (categoriesQuery.error) {
      toast.error("Could not load categories", {
        description: getErrorMessage(categoriesQuery.error),
      });
    }
  }, [categoriesQuery.error]);

  const createPostMutation = useMutation({
    mutationFn: (payload: CreatePostPayload) => createPost(payload),
    onSuccess: async () => {
      toast.success("Post created successfully.");
      form.reset(defaultValues);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
      await queryClient.invalidateQueries({ queryKey: ["dashboard-all-posts"] });
    },
    onError: (error: Error) => {
      toast.error("Could not create post", {
        description: getErrorMessage(error),
      });
    },
  });

  const submitForm = form.handleSubmit((values) => {
    const payload: CreatePostPayload = {
      title: values.title,
      description: values.description,
      photo: values.photo,
      postType: values.postType,
      taka: Number(values.taka),
      categoryId: values.categoryId,
      userId,
    };

    createPostMutation.mutate(payload);
  });

  return (
    <section className="mx-auto w-full max-w-3xl">
      <div className="mb-6 space-y-2">
        <Badge variant="outline" className="gap-1.5 border-emerald-700/20 text-emerald-800">
          <Sprout className="size-3.5" />
          Community contribution
        </Badge>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Create a post</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Share a project, idea, or opportunity with the Eco Spark community.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-5 shadow-sm sm:p-7">
        <Form {...form}>
          <form onSubmit={submitForm} className="space-y-5">
            <FormField
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="post-title">Title</FormLabel>
                  <FormControl>
                    <Input
                      id="post-title"
                      placeholder="Give your post a clear title"
                      aria-invalid={fieldState.invalid}
                      maxLength={120}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="post-description">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      id="post-description"
                      placeholder="Describe what you are sharing..."
                      rows={6}
                      maxLength={5000}
                      aria-invalid={fieldState.invalid}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="photo"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="post-photo">Post image</FormLabel>
                  <FormControl>
                    <Input
                      id="post-photo"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      aria-invalid={fieldState.invalid}
                      name={field.name}
                      ref={(element) => {
                        field.ref(element);
                        imageInputRef.current = element;
                      }}
                      onBlur={field.onBlur}
                      onChange={async (event) => {
                        const input = event.currentTarget;
                        const file = input.files?.[0];
                        if (!file) return;

                        try {
                          const photo = await compressImageFile(file);
                          form.setValue("photo", photo, {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                          });
                        } catch (error) {
                          toast.error("Image could not be added", {
                            description:
                              error instanceof Error
                                ? error.message
                                : "Choose another image and try again.",
                          });
                          input.value = "";
                        }
                      }}
                    />
                  </FormControl>
                  {field.value ? (
                    <div className="relative mt-3 aspect-video w-full max-w-sm overflow-hidden rounded-lg border bg-muted">
                      <Image
                        src={field.value}
                        alt="Selected post image preview"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="postType"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel htmlFor="post-type">Post type</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value) => field.onChange(value as PostType)}
                      >
                        <SelectTrigger id="post-type" aria-invalid={fieldState.invalid}>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                          {postTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taka"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel htmlFor="post-taka">Amount (৳)</FormLabel>
                    <FormControl>
                      <Input
                        id="post-taka"
                        type="number"
                        min="0"
                        step="any"
                        aria-invalid={fieldState.invalid}
                        value={field.value}
                        onBlur={field.onBlur}
                        onChange={(event) => {
                          const value = event.target.value;
                          field.onChange(value === "" ? 0 : Number(value));
                        }}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="post-category">Category</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value || null}
                      onValueChange={(value) => field.onChange(value ?? "")}
                      disabled={categoriesQuery.isLoading || categoriesQuery.isError}
                    >
                      <SelectTrigger id="post-category" aria-invalid={fieldState.invalid}>
                        <SelectValue
                          placeholder={
                            categoriesQuery.isLoading
                              ? "Loading categories..."
                              : "Choose a category"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {(categoriesQuery.data ?? []).map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />

            <div className="flex justify-end border-t pt-5">
              <Button
                type="submit"
                size="lg"
                disabled={createPostMutation.isPending || categoriesQuery.isLoading}
                className="min-w-36"
              >
                {createPostMutation.isPending ? (
                  <>
                    <LoaderCircle className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create post"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
}