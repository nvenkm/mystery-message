import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { MessageInterface } from "@/models/User";
import axios from "axios";
import { useToast } from "./ui/use-toast";

type MessageCardProps = {
  message: MessageInterface;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  console.log(message);
  const { toast } = useToast();
  const date = new Date(message.createdAt);
  async function handleDeleteMessage() {
    const response = await axios.delete(`/api/delete-message/${message._id}`);
    toast({
      title: response.data.message,
    });
    onMessageDelete(message._id);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{message.content}</CardTitle>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteMessage}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardFooter>
        <p>{date.toLocaleString()}</p>
      </CardFooter>
    </Card>
  );
};

export default MessageCard;
