import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User";

export async function POST(req: Request) {
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

  //if user is logged in

  const userId = user?._id;

  const { acceptMessages } = await req.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      { _id: userId },
      { isAcceptingMessages: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to update accepting status!",
        },
        {
          status: 401,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Status updated successfully!",
        updatedUser,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Failed to update accepting status!", error);
    return Response.json(
      {
        success: false,
        message: "Failed to update accepting status!",
      },
      {
        status: 500,
      }
    );
  }
}

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
  const userId = user?._id;

  try {
    const user = await UserModel.findById(userId);
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

    return Response.json(
      {
        success: true,
        isAcceptingMessages: user.isAcceptingMessages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Failed to get accepting status!", error);
    return Response.json(
      {
        success: false,
        message: "Failed to get accepting status!",
      },
      {
        status: 500,
      }
    );
  }
}
