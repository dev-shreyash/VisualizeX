"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { updatePasswordSchema } from "@/schemas/userSchemas";
import { z } from "zod";
import { Loader2 } from "lucide-react";

// Define the type for form data
type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;

interface UpdatePasswordFormProps {
  onSubmit: (data: UpdatePasswordFormData) => void;
  isSubmitting: boolean;
  defaultValues: UpdatePasswordFormData;
}

const UpdatePasswordForm: React.FC<UpdatePasswordFormProps> = ({ onSubmit, isSubmitting, defaultValues }) => {
  const form = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Old Password Field */}
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Old Password</FormLabel>
              <Input
                {...field}
                type="password"
                placeholder="Enter your old password"
                autoComplete="current-password"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* New Password Field */}
        <FormField
          name="newPassword"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <Input
                {...field}
                type="password"
                placeholder="Enter your new password"
                autoComplete="new-password"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm New Password Field */}
        <FormField
          name="confirmNewPassword"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <Input
                {...field}
                type="password"
                placeholder="Re-enter your new password"
                autoComplete="new-password"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              Updating...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default UpdatePasswordForm;
