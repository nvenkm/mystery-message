import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import React from "react";
import { Recursive } from "next/font/google";
const recursive = Recursive({ subsets: ["cyrillic-ext"] });

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col justify-center items-start md:items-center min-h-screen bg-purple-100 px-4">
      <Link
        className={`${recursive.className} absolute top-0 left-0 m-4 text-sm md:text-lg text-gray-800 font-semibold`}
        href="/"
      >
        GET-Responses ✉️
      </Link>
      {children}
    </div>
  );
};

export default Layout;
