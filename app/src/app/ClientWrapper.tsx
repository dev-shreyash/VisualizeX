"use client"; // Mark this file as a Client Component

import { usePathname } from 'next/navigation';
import { Toaster } from '@/components/ui/toaster';


const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const noNavbarRoutes = ['/sign-in', '/sign-up'];
  
    // const showNavbar = !noNavbarRoutes.some(route => pathname.startsWith(route));
  
    return (
      <>
        {/* {showNavbar && <Navbar2/>} */}
        {children}
        <Toaster />
      </>
    );
  };
  
  export default ClientWrapper;