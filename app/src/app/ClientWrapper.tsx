"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from '@/components/ui/toaster';

const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <>
        {children}
        <Toaster />
      </>
    </SessionProvider>
  );
};

export default ClientWrapper;
