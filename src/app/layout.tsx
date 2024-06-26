import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthProvider";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import { Recursive } from "next/font/google";
const recursive = Recursive({ subsets: ["cyrillic-ext"] });
import { RecoilRoot } from "recoil";
import { RecoilProvider } from "@/context/RecoilProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Get responses - By Naveen",
  description: "Receive anonymous responses from people!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={recursive.className}>
        <RecoilProvider>
          <Toaster />
          <AuthProvider>{children}</AuthProvider>
        </RecoilProvider>
      </body>
    </html>
  );
}
