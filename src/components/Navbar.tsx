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
    <nav className="p-3 md:p-4 md:px-20 shadow-sm bg-purple-50">
      <div className="flex justify-between items-center">
        <Link
          className={`${recursive.className} text-gray-800 font-extrabold font-`}
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
            <Button>Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
