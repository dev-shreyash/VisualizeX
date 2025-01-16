"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Navbar = () => {
  const session = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // Navbar visibility state
  const router = useRouter();

  useEffect(() => {
    if (session.status === "authenticated") {
      setIsLoggedIn(true);
    }
  }, [session.status]);

  useEffect(() => {
    // Hide navbar after 5 seconds
    const hideNavbarTimeout = setInterval(() => {
      setIsVisible(false);
    }, 5000);

    // Show navbar on mouse hover at the top
    const handleMouseMove = (event: MouseEvent) => {
      if (event.clientY <= 50) {
        setIsVisible(true);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      clearTimeout(hideNavbarTimeout);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handlePageNavigation = (pagename: string): void => {
    router.push(pagename);
  };

  return (
    <>
      <div
        className={`transition-all duration-300 ${
          isVisible ? "h-[75px]" : "h-0"
        }`}
      >
        <div
          className={`fixed top-0 left-0 w-full z-50 bg-gray-800 shadow-md transition-all duration-300 ${
            isVisible ? "h-[64px] opacity-100" : "h-0 opacity-0"
          }`}
        >
          <div className={`flex justify-between items-center p-5 text-white bg-gray-800 shadow-md ${isVisible ? "h-[64px]" : "h-0"}`}>
            <div className="flex gap-2 items-center">
              <span
                className="font-bold font-mono text-2xl cursor-pointer"
                onClick={() => handlePageNavigation("/")}
              >
                VisualizeX
              </span>
              <Button
                className="font-bold bg-gray-600"
                onClick={() => handlePageNavigation("/Algorithms")}
              >
                Algorithm Selector
              </Button>
              <Button
                className="font-bold bg-gray-600"
                onClick={() => handlePageNavigation("/onlineIDE")}
              >
                Online IDE
              </Button>
              <Button
                className="font-bold bg-transparent underline"
                onClick={() => handlePageNavigation("/HowTo")}
              >
                How to use
              </Button>
            </div>
            <div className="flex">
              {isLoggedIn ? (
                <div className="flex items-center gap-2 cursor-pointer" onClick={()=> handlePageNavigation("/dashboard")}>
                  <Image
                    src={"/images/avatar.svg"}
                    alt="avatar"
                    width={40}
                    height={40}
                    className="rounded-full"
                  ></Image>
                  <span>{session.data?.user?.username}</span>
                </div>
              ) : (
                <Button className="font-bold bg-gray-600"
                onClick={() => signIn()}>Log in</Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
