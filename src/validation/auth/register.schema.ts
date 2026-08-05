import z from "zod";

export const registerSchema = z.object({
  name: z.string().min(4, { message: "Name is required" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .nonempty({ message: "Email is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 6 characters long" })
    // .max(100, { message: "Password must be at most 100 characters long" })
    // .nonempty({ message: "Password is required" })
    // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    // .regex(/[0-9]/, "Password must contain at least one number")
    // .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

export type RegisterType = z.infer<typeof registerSchema>;
