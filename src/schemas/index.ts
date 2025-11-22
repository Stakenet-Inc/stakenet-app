import z from "zod";

export const signInSchema = z.object({
  email: z.email({ message: "Please enter a valid email" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().optional(),
});

export const passwordSchema = z
  .string()
  .min(1, { message: "Password is required" })
  .min(8, { message: "Password must be at least 8 characters" })
  .regex(/[^A-Za-z0-9]/, {
    message: "Password must contain at least one special character",
  });

export const signUpSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.email({ message: "Please enter a valid email" }),
    password: passwordSchema,
    passwordConfirmation: z
      .string()
      .min(1, { message: "Please confirm password" }),
    age: z.boolean().refine((val) => val === true, {
      message: "You must be at least 18 years old",
    }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

export const resetPasswordSchema = z.object({
  newPassword: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  email: z.email({ message: "Please enter a valid email" }),
});

export const updateEmailSchema = z.object({
  newEmail: z.email({ message: "Enter a valid email" }),
});

export const updatePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, { message: "Current password is required" }),
  newPassword: passwordSchema,
});
