import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signupSchema";

//it needs an object with username inside (can be added more)
const usernameQuerySchema = z.object({
  username: usernameValidation,
});

//to check is username is available or not!
export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    //validate the username with zod
    const result = usernameQuerySchema.safeParse({ username });
    console.log("Result:::", result);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameters.",
        },
        {
          status: 400,
        }
      );
    }

    const successUsername = result.data.username;

    const existingVerifiedUser = await UserModel.findOne({
      username: successUsername,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json({
        success: false,
        message: "Username is already taken!",
      });
    }

    return Response.json({
      success: true,
      message: "Username is available!",
    });
  } catch (error) {
    console.log("ERROR:", error);

    return Response.json(
      {
        success: true,
        message: "Error checking username!",
      },
      {
        status: 400,
      }
    );
  }
}
