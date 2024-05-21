import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import React from "react";
import { Recursive } from "next/font/google";
import { Metadata } from "next";
const recursive = Recursive({ subsets: ["cyrillic-ext"] });

export const metadata: Metadata = {
  title: "Send Message - Get Responses ",
  description: "Create account or Signin",
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
