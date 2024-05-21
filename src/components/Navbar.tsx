"use client";

import React from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { Recursive } from "next/font/google";
const recursive = Recursive({ subsets: ["cyrillic-ext"] });

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  console.log("User::::::;;;;", session);

  return (
    <nav className="p-2 md:px-20 shadow-sm backdrop-blur-lg bg-white/70 fixed w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          className={`${recursive.className} text-sm md:text-lg text-gray-800 font-semibold`}
          href="/"
        >
          GET-Responses ✉️
        </Link>
        {session ? (
          <>
            <span>Welcome, {user.username}</span>
            <Button onClick={() => signOut()}>Sign Out</Button>
          </>
        ) : (
          <Link href="/signin">
            <Button className="px-4" size={"sm"}>
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
