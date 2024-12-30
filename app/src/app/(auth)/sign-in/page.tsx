"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signIn } from "next-auth/react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { signInSchema } from "@/schemas/signInSchema";
import { Loader2, RefreshCcw } from "lucide-react";
import { useState } from "react";

export default function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const { toast } = useToast();

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier, // use correct field names
      password: data.password,
    });

    console.log(result);

    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        toast({
          title: "Login Failed",
          description: "Incorrect username or password",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    }
    

    if (result?.ok) {
      router.replace("/dashboard");
      window.location.reload();
    }
  };

  const handleOAuthSignIn = async (provider: string) => {
    const result = await signIn(provider, { callbackUrl: "/dashboard" });
    console.log(result);
    if (result?.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center mx-5 items-center min-h-screen h-72 bg-[#e0e0e0]">
      <div className="relative w-full max-w-md p-8 rounded-lg shadow-[0_2px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)]">
        <div className="absolute inset-0 bg-white bg-opacity-35  rounded-lg"></div>
        <div className="relative z-10">
          <div className="text-center">
            <h1 className="text-2xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Welcome Back to VisualizeX
            </h1>
            <p className="mb-4">Sign in to continue your learning</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email/Username</FormLabel>
                    <Input
                      {...field}
                      name="identifier" // use correct field name
                      className="appearance-none border-none border-b-2 border-transparent bg-black bg-opacity-20 w-full py-2 px-3 text-white leading-tight focus:outline-none focus-visible:border-gray-500 placeholder:text-gray-300 focus:ring-0"
                      type="text"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <Input
                      {...field}
                      name="password" // use correct field name
                      type="password"
                      className="appearance-none border-none border-b-2 border-transparent bg-black bg-opacity-20 w-full py-2 px-3 text-white leading-tight focus:outline-none focus-visible:border-gray-500 placeholder:text-gray-300 focus:ring-0"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
             <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>
          <div className="flex items-center justify-center mt-4">
            <hr className="w-full border-gray-300" />
            <span className="px-2 text-gray-500">OR</span>
            <hr className="w-full border-gray-300" />
          </div>
          <div className="flex flex-col space-y-4 mt-4">
            <Button
              className="w-full"
              onClick={() => handleOAuthSignIn("google")}
            >
              Sign In with Google
            </Button>
            <Button
              className="w-full"
              onClick={() => handleOAuthSignIn("github")}
            >
              Sign In with GitHub
            </Button>
          </div>
          <div className="text-center mt-4">
            <p>
              Not a member yet?{" "}
              <Link
                href="/sign-up"
                className="text-blue-600 hover:text-blue-800"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
