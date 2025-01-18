"use client"; // Ensures this is a client-side component

import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import UpdateEmailForm from "@/components/user/updateEmailForm";
import UpdatePasswordForm from "@/components/user/updatePasswordForm";
import { set } from "zod";

const UserDashboard = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [formType, setFormType] = useState<"email" | "password" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formOn, setFormOn] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false, callbackUrl: "/sign-in" });
      router.push("/sign-in");
      //window.location.reload();
    } catch {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFormType = (type: "email" | "password") => {
    setFormOn(true);
    setFormType(type);
  };

  const handleEmailSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Include the username from the session
      const payload = {
        ...data,
        username: session?.user?.username, // Add the username from the session
      };

      const response = await fetch("/api/users/update-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Email updated successfully",
        });
        handleSignOut()
        window.location.reload();

        // Update the session to reflect the new email
        const updatedSession = await fetch("/api/auth/session"); // Default NextAuth session endpoint
        const sessionData = await updatedSession.json();
        update(sessionData); // Update the session in the client

        setFormType(null); // Reset formType
       
      } else {
        const result = await response.json();
        toast({
          title: "Error",
          description: result.message || "Failed to update email.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setFormOn(false); // Reset the form visibility

    }
  };

  const handlePasswordSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Include the username from the session
      const payload = {
        ...data,
        username: session?.user?.username, // Add the username from the session
      };

      const response = await fetch("/api/users/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Password updated successfully",
        });

        // Refresh the session if required (no visible data change in session for password)
        await fetch("/api/auth/session", { method: "POST" });

        setFormType(null); // Reset formType
        handleSignOut()
        window.location.reload();

      } else {
        const result = await response.json();
        toast({
          title: "Error",
          description: result.message || "Failed to update password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setFormOn(false); // Reset the form visibility
    }
  };

  const defaultEmailValues = {
    email: session?.user?.email || "",
    password: "",
  };

  const defaultPasswordValues = {
    password: "",
    newPassword: "",
    confirmNewPassword: "",
  };

  return (
    <div className="flex justify-center mx-5 items-center min-h-screen bg-[#e0e0e0]">
      <div className="w-full max-w-lg p-8 rounded-lg shadow-lg bg-white">
        <h1 className="text-3xl font-bold text-center mb-6">User Dashboard</h1>
        <div className="mb-6 text-center">
          <p className="font-medium">Username: {session?.user?.username}</p>
          <p className="font-medium">Email: {session?.user?.email}</p>
        </div>
        <div className="flex justify-center gap-4 mb-6">
          <Button onClick={() => handleFormType("email")}>Update Email</Button>
          <Button onClick={() => handleFormType("password")}>
            Update Password
          </Button>
        </div>

        {/* Conditionally render the forms based on formType */}
        {formType === "email" && (
          <>
            <UpdateEmailForm
              onSubmit={handleEmailSubmit}
              isSubmitting={isSubmitting}
              defaultValues={defaultEmailValues}
            />
            <p className="text-yellow-500">*To see changes, logout and login again</p>
            <Button
              className="w-full mt-4"
              disabled={isSubmitting}
              onClick={() => {
                setFormType(null);
                setFormOn(false);
              }}
            >
              Cancle
            </Button>
          </>
        )}

        {formType === "password" && (
          <>
            <UpdatePasswordForm
              onSubmit={handlePasswordSubmit}
              isSubmitting={isSubmitting}
              defaultValues={defaultPasswordValues}
            />
            <Button
              className="w-full mt-4"
              disabled={isSubmitting}
              onClick={() => {
                setFormType(null);
                setFormOn(false);
              }}
            >
              Cancle
            </Button>
          </>
        )}

        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={handleSignOut}
          disabled={formOn}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default UserDashboard;
