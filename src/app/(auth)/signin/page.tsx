"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { signinSchema } from "@/schemas/signinSchema";
import { isLoadingAtom } from "@/state-machine/Atoms";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import * as z from "zod";

const Signin = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useRecoilState(isLoadingAtom);

  //zod implementation
  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    setIsLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
      callbackUrl: "/dashboard",
    });

    if (result?.error) {
      toast({
        title: "Signin Failed",
        description: result.error,
        variant: "destructive",
      });
    }

    // redirect to dashboard
    if (result?.url) {
      router.replace("/dashboard");
      setIsLoading(false);
    }
  };

  const handleFillCredentials = () => {
    form.reset({
      email: "7naveennn@gmail.com",
      password: "naveen",
    });
  };

  return (
    <div className="max-w-4xl mx-7 my-20 md:m-0 grid grid-cols-1 md:grid-cols-2">
      <div className="col-span-1 hidden md:block relative">
        <div className="absolute top-8 left-6">
          <h2 className="text-white text-4xl font-extrabold tracking-tight">
            Welcome Back 👋
          </h2>
          <div className="text-white mt-4 flex flex-col items-start gap-2 bg-white/20 p-3 rounded-md">
            <h3 className="text-lg font-semibold">Test Credentials</h3>
            <span>Email : 7naveennn@gmail.com</span>
            <span>Password : naveen</span>
            <Button
              onClick={handleFillCredentials}
              className="bg-transparent text-white border border-white h-8 leading-none"
            >
              Fill Credentials
            </Button>
          </div>
        </div>
        <Image
          className="w-full h-full object-cover"
          priority
          width={1080}
          alt="Form"
          height={1350}
          src="https://static.vecteezy.com/system/resources/previews/013/545/880/non_2x/modern-colorful-wavy-line-background-design-wave-curve-abstract-background-for-business-landing-page-flyers-website-banner-and-presentation-free-vector.jpg"
        ></Image>
      </div>
      <div className="col-span-1 w-full p-6 space-y-10 bg-white shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Look Who&apos;s Back
          </h1>
          <p className="mb-4">Signin to see what messages came your way!</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} name="email" />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    {...field}
                    name="password"
                    autoComplete="off"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-1">
          <p>
            Not a member?{" "}
            <Link href="/signup" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
