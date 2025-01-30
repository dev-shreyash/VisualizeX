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
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for hamburger menu
  const router = useRouter();

  useEffect(() => {
    if (session.status === "authenticated") {
      setIsLoggedIn(true);
    }
  }, [session.status]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setIsVisible(true); // Show navbar when at the top
      } else {
        setIsVisible(false); // Hide navbar when not at the top
      }
    };

    // Listen for scroll events
    window.addEventListener("scroll", handleScroll);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handlePageNavigation = (pagename: string): void => {
    router.push(pagename);
    setIsMenuOpen(false); // Close menu on navigation
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
          <div
            className={`flex justify-start gap-2 items-center p-5 text-white bg-gray-800 shadow-md ${isVisible ? "h-[64px]" : "h-0"}`}
          >
            <div className="flex gap-2 items-center">
              <span
                className="font-bold font-mono text-2xl cursor-pointer"
                onClick={() => handlePageNavigation("/")}
              >
                VisualizeX
              </span>
            </div>

            {/* Hamburger Menu for Small Devices */}
            <div className="lg:hidden justify-end w-full flex">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex gap-2 justify-start">
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

            {/* Desktop User Info */}
            <div className="hidden lg:flex justify-end w-full">
              {isLoggedIn ? (
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => handlePageNavigation("/dashboard")}>
                  <Image
                    src={"/images/avatar.svg"}
                    alt="avatar"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <span>{session.data?.user?.username}</span>
                </div>
              ) : (
                <Button className="font-bold bg-gray-600" onClick={() => signIn()}>
                  Log in
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`lg:hidden flex  absolute top-0 left-0 w-full bg-gray-800 text-white transition-transform duration-300 ${isMenuOpen ? "transform translate-y-0" : "transform -translate-y-full"}`}
          >
            <div className="flex flex-col items-start p-4 gap-2 justify-start">
              {/* Close Button */}
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-white absolute top-4 right-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="flex gap-2 items-center">
              <span
                className="font-bold font-mono text-2xl cursor-pointer"
                onClick={() => handlePageNavigation("/")}
              >
                VisualizeX
              </span>
            </div>

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
              {isLoggedIn ? (
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => handlePageNavigation("/dashboard")}>
                  <Image
                    src={"/images/avatar.svg"}
                    alt="avatar"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <span>{session.data?.user?.username}</span>
                </div>
              ) : (
                <Button className="font-bold bg-gray-600" onClick={() => signIn()}>
                  Log in
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
