"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePathname } from "next/navigation";
import React from "react";
import { IoIosSend } from "react-icons/io";

const Page = () => {
  const pathname = usePathname();
  const username = pathname?.split("/")[2];

  console.log(pathname);

  return (
    // <main className="flex flex-col items-center justify-center">
    <section className="flex max-w-4xl m-auto flex-col pt-5 md:pt-10 gap-9 md:gap-14">
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 text-center">
        Send an Anonymous message to{" "}
        <span className="text-primary bg-purple-50">@{username}</span>
      </h1>
      <div className="flex flex-col gap-4 items-start">
        <div className="grid w-full gap-3 min-h-[10rem]">
          <Label htmlFor="message">Send your messsage to ${username}</Label>
          <Textarea placeholder="Type your message here." id="message" />
        </div>
        <Button className="flex gap-2">
          Send <IoIosSend size={18} />
        </Button>
      </div>
      <div></div>
    </section>
    // </main>
  );
};

export default Page;
