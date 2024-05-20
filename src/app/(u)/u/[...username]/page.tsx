"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { IoIosSend } from "react-icons/io";
import { useForm, SubmitHandler } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useToast } from "@/components/ui/use-toast";
import { ApiResponseInterface } from "@/types/ApiResponse";
import Link from "next/link";

type Inputs = {
  message: string;
};

const Page = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log("on submit called");
    try {
      setLoading(true);
      const message = data.message;
      const res = await axios.post("/api/send-message", {
        username,
        content: message,
      });
      console.log(res);
      if (res.data.success) {
        toast({
          title: "Message sent!",
          description: res.data.message,
          variant: "default",
        });
        reset();
      } else {
        toast({
          title: "Message sent!",
          description: res.data.message,
          variant: "default",
        });
      }
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiResponseInterface>;
      // Default error message
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Failed to send message!",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const pathname = usePathname();
  const username = pathname?.split("/")[2];

  console.log(pathname);

  return (
    // <main className="flex flex-col items-center justify-center">
    <section className="flex max-w-4xl mx-5 md:mx-auto m-auto flex-col pt-5 md:pt-10 gap-9 md:gap-14">
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 text-center">
        Send an Anonymous message to{" "}
        <span className="text-primary bg-purple-50">@{username}</span>
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 items-start"
      >
        <div className="flex flex-col w-full gap-3 ">
          <Label htmlFor="message">Send your messsage to @{username}</Label>
          <Textarea
            disabled={loading}
            {...register("message", { required: true, minLength: 5 })}
            className="min-h-[10rem]"
            placeholder="Type your message here."
            id="message"
          />
        </div>
        <Button onClick={handleSubmit(onSubmit)} className="flex gap-2">
          Send{" "}
          {loading ? (
            <AiOutlineLoading3Quarters size={18} className="animate-spin" />
          ) : (
            <IoIosSend size={18} />
          )}
        </Button>
      </form>
      <div className="flex flex-col items-center gap-3">
        <h2>Get your own message dashboard!</h2>
        <Button>
          <Link href="/signup">Create Account</Link>
        </Button>
      </div>
    </section>
    // </main>
  );
};

export default Page;
