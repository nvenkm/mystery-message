"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { MessageInterface, UserInterface } from "@/models/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { isLoadingAtom } from "@/state-machine/Atoms";
import { ApiResponseInterface } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import dayjs from "dayjs";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";

const Dashboard = () => {
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  // const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useRecoilState(isLoadingAtom);
  const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { data: session } = useSession();

  const handleDeleteMessage = async (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const res = await axios.get("/api/accept-messages");
      setValue("acceptMessages", res.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponseInterface>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to fetch message setting!",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
      setIsLoading(false);
    }
  }, [acceptMessages, setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(true);
      try {
        const res = await axios.get("/api/get-messages");
        setMessages(res.data.messages || []);

        if (refresh) {
          toast({
            title: "Refreshed",
            description: "Messages refreshed successfully",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponseInterface>;
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message || "Failed to fetch messages!",
          variant: "destructive",
        });
      } finally {
        setIsSwitchLoading(false);
        setIsLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session, setValue, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      await axios.post("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: "Success",
        description: "Message setting updated successfully",
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponseInterface>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to update message setting!",
        variant: "destructive",
      });
    }
  };
  if (!session || !session.user) return null;

  const { username } = session?.user as UserInterface;

  const profileUrl = `${window.location.origin}/u/${username}`;

  function copyToClipboard() {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Copied",
      description: "Profile URL copied to clipboard",
    });
  }

  return (
    <main className="bg-gray-50 pb-6">
      <div className="px-8 lg:mx-auto pt-32  rounded max-w-6xl min-h-screen">
        <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
          <div className="flex items-center shadow-sm bg-slate-100">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="input input-bordered w-full p-2 mr-2"
            />
            <Button className="rounded-l-none" onClick={copyToClipboard}>
              Copy
            </Button>
          </div>
        </div>

        <div className="mb-4 flex">
          <Switch
            {...register("acceptMessages")}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span className="ml-2">
            Accept Messages: {acceptMessages ? "On" : "Off"}
          </span>
        </div>
        <Separator />

        <Button
          className="mt-4"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
        </Button>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.length > 0 ? (
            messages
              .sort(
                (a: any, b: any) =>
                  new Date(b.createdAt) - new Date(a.createdAt)
              )
              .map((message, index) => (
                <MessageCard
                  key={message._id}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))
          ) : (
            <p>No messages to display.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
