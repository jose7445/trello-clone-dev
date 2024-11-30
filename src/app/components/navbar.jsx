"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useCurrentUser } from "@/hooks/useCurrentUser"; // Import the custom hook

export default function ButtonAppBar() {
  const { userId, fullname, session, status } = useCurrentUser(); // Use custom hook

  // State to handle mobile menu toggle
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="container mx-auto flex flex-wrap items-center justify-between py-4">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <Image src="/logo_web.webp" alt="Logo Web" width={50} height={50} />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            PLANIFY
          </span>
        </Link>
        <button
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          onClick={toggleMenu} // Toggle the menu visibility
          aria-controls="navbar-default"
          aria-expanded={isOpen ? "true" : "false"} // Dynamically change aria-expanded
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          className={`${isOpen ? "block" : "hidden"} w-full md:block md:w-auto`} // Control visibility based on state
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              {session ? (
                <div className="flex items-center gap-4">
                  <span className="font-semibold">{fullname}</span>
                  <Button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="bg-primary text-white text-center py-2 px-4 font-medium rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    LOGOUT
                  </Button>
                </div>
              ) : (
                <div>
                  <Link href="/login">
                    <Button className="text-primary mr-4 text-center py-2 px-4 font-medium rounded-lg hover:bg-teal-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-primary text-white text-center py-2 px-4 font-medium rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
