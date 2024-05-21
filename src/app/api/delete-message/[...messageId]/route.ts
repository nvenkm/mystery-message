import { dbConnect } from "@/lib/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User, getServerSession } from "next-auth";
import UserModel from "@/models/User";

export async function DELETE(
  req: Request,
  { params }: { params: { messageId: string } }
) {
  const { messageId } = params;
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
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
  try {
    const updatedResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } },
      { new: true }
    );

    console.log(updatedResult, messageId, user._id);

    if (updatedResult.modifiedCount === 0) {
      return Response.json(
        {
          success: false,
          message: "Message not found or already deleted!",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message deleted successfully",
        data: updatedResult,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error deleting message!", error);
    return Response.json(
      {
        success: false,
        message: "Error deleting message!",
      },
      {
        status: 500,
      }
    );
  }
}
