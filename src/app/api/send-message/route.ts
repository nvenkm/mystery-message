import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import { dbConnect } from "@/lib/dbConnect";
import UserModel, { MessageInterface } from "@/models/User";
import mongoose from "mongoose";
export async function POST(req: Request) {
  await dbConnect();

  const { username, content } = await req.json();

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found!",
        },
        {
          status: 404,
        }
      );
    }

    if (!user.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages currently.",
        },
        {
          status: 400,
        }
      );
    }

    const newMessage = {
      content: content,
      createdAt: new Date(),
    };

    //assertion ( mujhe jada pta h ts se )
    user.messages.push(newMessage as MessageInterface);

    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message sent successfully!",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Failed to send message!", error);
    return Response.json(
      {
        success: false,
        message: "Failed to send message!",
      },
      {
        status: 500,
      }
    );
  }
}
