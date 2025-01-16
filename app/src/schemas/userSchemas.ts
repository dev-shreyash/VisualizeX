import { z } from "zod";

// Schema for updating email
export const updateEmailSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address") // Email validation
    .min(1, "Email is required"),
  password: z
    .string()
    .min(6, "Password should be at least 6 characters") // Minimum password length
    .max(50, "Password should not exceed 50 characters"),
});

// Schema for updating password
export const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password should be at least 6 characters") // Old password validation
      .max(50, "Password should not exceed 50 characters"),
    newPassword: z
      .string()
      .min(6, "New password should be at least 6 characters")
      .max(50, "New password should not exceed 50 characters"), // New password validation
    confirmNewPassword: z
      .string()
      .min(6, "Confirm new password should be at least 6 characters")
      .max(50, "Confirm new password should not exceed 50 characters"), // Confirm new password validation
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"], // Point the error at confirmNewPassword
  });

