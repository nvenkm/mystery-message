import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signupSchema";
import dayjs from "dayjs";

//it needs an object with username inside (can be added more)
const usernameQuerySchema = z.object({
  username: usernameValidation,
});

//to check is username is available or not!
export async function GET(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  try {
    const username = searchParams.get("username");

    //validate the username with zod
    const result = usernameQuerySchema.safeParse({ username });

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

    const existingUser = await UserModel.findOne({
      username: successUsername,
    });

    if (existingUser) {
      console.log(
        dayjs(new Date()).isBefore(dayjs(existingUser.verifyCodeExpiry))
      );
      console.log(existingUser);
      console.log(dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"));
      console.log(
        dayjs(existingUser.verifyCodeExpiry).format("YYYY-MM-DD HH:mm:ss")
      );

      if (
        existingUser.isVerified ||
        dayjs(new Date()).isBefore(dayjs(existingUser.verifyCodeExpiry))
      ) {
        return Response.json({
          success: false,
          message: "Username is already taken!",
        });
      }
    }
    return Response.json({
      success: true,
      message: "Username is available!",
      username: successUsername,
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
