"use client";
import React, { useState, useEffect } from "react";
import { useSessionData } from "@/app/hooks/useSessionData";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import AlgorithmSelector from "@/components/Algorithm/algorithmSelector";

const UserDashboard = () => {
  const { session, status } = useSessionData();
  const router = useRouter();
  const [userStatus, setUserStatus] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      setUserStatus(true);
    }
  }, [session, status]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (userStatus === false) {
    router.replace("/sign-in");
    return <div>Please log in to view your dashboard</div>;
  }

  // Logout handler
  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false, callbackUrl: "/" });
      router.push("/");
      window.location.reload();
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center">
      <div className="flex flex-col items-center justify-center text-gray-600 font-bold bg-slate-200 w-full">
        <h2 className="text-3xl">User Dashboard</h2>
        <div>
          <h2>Profile</h2>
          <p>Username: {session?.user?.username}</p>
          <p>Email: {session?.user?.email}</p>
        </div>
        <Button
          className="w-full mx-4 md:w-auto bg-slate-900 text-white"
          variant="outline"
          onClick={handleSignOut}
        >
          Logout
        </Button>
      </div>

      <div className="container">
        <div className="flex flex-col font-bold text-3xl text-white m-0 p-3 bg-black justify-center">
          <AlgorithmSelector
            selectedAlgorithm={selectedAlgorithm}
            setSelectedAlgorithm={setSelectedAlgorithm}
          />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
