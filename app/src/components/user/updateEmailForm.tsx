"use client"; // Ensures this is a client-side component

import React from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { updateEmailSchema } from "@/schemas/userSchemas";
import { Loader2 } from "lucide-react";

interface UpdateEmailFormProps {
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  defaultValues: {
    email: string;
    password: string;
  };
}

const UpdateEmailForm: React.FC<UpdateEmailFormProps> = ({ onSubmit, isSubmitting, defaultValues }) => {
  const form = useForm({
    resolver: zodResolver(updateEmailSchema),
    defaultValues, // Set the default values passed as props
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Email</FormLabel>
              <Input {...field} placeholder="Enter new email" />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <Input {...field} type="password" placeholder="Enter your password" />
              <FormMessage />
            </FormItem>
          )}
        />

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

export default UpdateEmailForm;
