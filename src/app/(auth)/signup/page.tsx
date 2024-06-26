"use client";

import { ApiResponseInterface } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import * as z from "zod";

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
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { usernameValidation, signupSchema } from "@/schemas/signupSchema";
import Image from "next/image";

export default function SignUpForm() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debouncedUsername, setDebouncedUsername] = useDebounceValue(
    username,
    800
  );

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    (async () => {
      if (!debouncedUsername) {
        return;
      }
      setIsCheckingUsername(true);
      setUsernameMessage("");
      try {
        const response = await axios.get(
          `/api/unique-username-verification?username=${debouncedUsername}`
        );
        setUsername(response.data.username);
        setUsernameMessage(response.data.message);
      } catch (error) {
        console.error("Error during username verification:", error);
        const axiosError = error as AxiosError<ApiResponseInterface>;
        setUsernameMessage(
          axiosError.response?.data.message || "Error checking username!"
        );
      } finally {
        setIsCheckingUsername(false);
      }
    })();
  }, [debouncedUsername]);

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponseInterface>(
        "/api/signup",
        data
      );

      toast({
        title: "Success",
        description: response.data.message,
      });

      router.replace(`/verify/${username}`);

      setIsSubmitting(false);
    } catch (error) {
      console.error("Error during sign-up:", error);

      const axiosError = error as AxiosError<ApiResponseInterface>;

      // Default error message
      let errorMessage = axiosError.response?.data.message;
      ("There was a problem with your sign-up. Please try again.");

      toast({
        title: "Sign Up Failed",
        description: errorMessage,
        variant: "destructive",
      });

      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-7 my-20 md:m-0 grid grid-cols-1 md:grid-cols-2">
      <div className="col-span-1 hidden md:block relative">
        <h2 className="text-white text-4xl font-extrabold tracking-tight absolute top-8 left-6">
          Welcome ❤️
        </h2>
        <Image
          className="w-full h-full object-cover"
          priority
          width={1080}
          alt="Form"
          height={1350}
          src="https://static.vecteezy.com/system/resources/previews/013/545/880/non_2x/modern-colorful-wavy-line-background-design-wave-curve-abstract-background-for-business-landing-page-flyers-website-banner-and-presentation-free-vector.jpg"
        ></Image>
      </div>
      <div className="col-span-1 w-full px-6 py-4 space-y-8 bg-white shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-3">
            Join Get-Responses
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input
                    autoComplete="off"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setUsername(e.target.value);
                    }}
                  />
                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage === "Username is available!"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} name="email" />
                  <p className="text-gray-500 text-sm">
                    We will send you a verification code
                  </p>
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
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-1">
          <p>
            Already a member?{" "}
            <Link href="/signin" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
