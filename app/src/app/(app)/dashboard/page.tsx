"use client";
import React, { useEffect, useState } from 'react';
import { useSessionData } from '@/app/hooks/useSessionData';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const UserDashboard = () => {

  const { session, status } = useSessionData();
  const router = useRouter();
  const [userStatus, setUserStatus] =useState(false);
  useEffect(() => {

    if (status === "authenticated") {
      setUserStatus(true);
      console.log("Session data:", session);
    }
  }, [session, status]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (userStatus === false) {
    return <div>Please log in to view your dashboard</div>;
  }

  // Logout
  const handleSignOut = async () => {
    try {
      await signOut({
        redirect: false, 
        callbackUrl: '/', 
      });
  
      router.push('/'); 
      window.location.reload();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <div>
      <h2>User Dashboard</h2>
      <div>
        <h2>Profile</h2>
        <p>Username: {session?.user?.username}</p>
        <p>Email: {session?.user?.email}</p>
        <Button className="w-full mx-4 md:w-auto bg-slate-900 text-white" variant='outline' onClick={handleSignOut}>Logout</Button>
      </div>
    </div>
  );
};

export default UserDashboard;
