"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "./button";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

const Navbar = () => {
  const { status, data } = useSession();
  const isLoggedIn = status === "authenticated";

  const [isVisible, setIsVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserLoggingIn, setIsUserLoggingIn] = useState(false);

  const router = useRouter();
  const pathname = usePathname();


  useEffect(() => {
    setIsUserLoggingIn(
      pathname === "/sign-in" || pathname === "/sign-up"
    );
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY === 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePageNavigation = (pagename: string): void => {
    router.push(pagename);
    setIsMenuOpen(false);
  };

  if (isUserLoggingIn) return null;

  return (
    <div className="flex">
      <div
        className={`transition-all duration-300 ${
          isVisible ? "h-[65px]" : "h-0"
        }`}
      >
        <div
          className={`fixed top-0 left-0 w-full z-50 bg-black transition-all duration-300 ${
            isVisible ? "h-[64px] opacity-100" : "h-0 opacity-0"
          }`}
        >
          <div
            className={`flex justify-start gap-2 items-center p-5 text-white ${
              isVisible ? "h-[64px]" : "h-0"
            }`}
          >
            {/* Logo */}
            <span
              className="font-bold font-mono text-2xl cursor-pointer"
              onClick={() => handlePageNavigation("/")}
            >
              VisualizeX
            </span>

            {/* Hamburger */}
            <div className="lg:hidden justify-end w-full flex">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white"
              >
                ☰
              </button>
            </div>

            {/* Desktop Nav */}
            <div className="hidden lg:flex gap-2">
              <Button
                className={`font-bold rounded-3xl hover:text-black hover:bg-gray-200 ${
                  pathname === "/Algorithms"
                    ? "bg-gray-600"
                    : "bg-transparent"
                }`}
                onClick={() => handlePageNavigation("/Algorithms")}
              >
                Algorithm Selector
              </Button>

              <Button
                className={`font-bold rounded-3xl hover:text-black hover:bg-gray-200 ${
                  pathname === "/onlineIDE"
                    ? "bg-gray-600"
                    : "bg-transparent"
                }`}
                onClick={() => handlePageNavigation("/onlineIDE")}
              >
                Online IDE
              </Button>

              <Button
                className={`font-bold rounded-3xl hover:text-black hover:bg-gray-200 ${
                  pathname === "/HowTo"
                    ? "bg-gray-600"
                    : "bg-transparent"
                }`}
                onClick={() => handlePageNavigation("/HowTo")}
              >
                How to use
              </Button>
            </div>

            {/* Desktop Right */}
            <div className="hidden lg:flex justify-end w-full">
              {isLoggedIn ? (
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => handlePageNavigation("/dashboard")}
                >
                  <Image
                    src={data?.user?.image || "/images/avatar.svg"}
                    alt="avatar"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <span>{data?.user?.username}</span>
                </div>
              ) : (
                <Button
                  className="font-bold bg-gray-600"
                  onClick={() => router.push("/sign-in")}
                >
                  Log in
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`lg:hidden absolute top-0 left-0 w-full bg-black text-white transition-transform duration-300 ${
              isMenuOpen ? "translate-y-0" : "-translate-y-full"
            }`}
          >
            <div className="flex flex-col p-4 gap-2">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-4 right-4"
              >
                ✕
              </button>

              <span
                className="font-bold font-mono text-2xl cursor-pointer"
                onClick={() => handlePageNavigation("/")}
              >
                VisualizeX
              </span>

              <Button onClick={() => handlePageNavigation("/Algorithms")}>
                Algorithm Selector
              </Button>

              <Button onClick={() => handlePageNavigation("/onlineIDE")}>
                Online IDE
              </Button>

              <Button onClick={() => handlePageNavigation("/HowTo")}>
                How to use
              </Button>

              {isLoggedIn ? (
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => handlePageNavigation("/dashboard")}
                >
                  <Image
                    src={data?.user?.image || "/images/avatar.svg"}
                    alt="avatar"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <span>{data?.user?.username}</span>
                </div>
              ) : (
                <Button onClick={() => router.push("/sign-in")}>
                  Log in
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;