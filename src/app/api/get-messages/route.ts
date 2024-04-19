import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User";
import mongoose from "mongoose";

export async function GET(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  //type bta skte h yaha :User
  const user = session?.user;

  if (!session || !session.user) {
    //means user is not logged in
    return Response.json(
      {
        success: false,
        message: "User not authenticated!",
      },
      {
        status: 401,
      }
    );
  }

  const userId = new mongoose.Types.ObjectId(user?._id);

  try {
    //Aggregate pipelines for getting all user messages
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      {
        $unwind: "$messages",
      },
      {
        $sort: { "$messages.createdAt": -1 },
      },
      {
        $group: { _id: "$_id", messages: { $push: "$messages" } },
      },
    ]);

    if (!user || user.length === 0) {
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
    return Response.json(
      {
        success: true,
        messages: user[0].messages,
        // user,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Failed to get messages!", error);
    return Response.json(
      {
        success: false,
        message: "Failed to get messages!",
      },
      {
        status: 500,
      }
    );
  }
}
