import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signupSchema";

//to verify the OTP!
export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();

    console.log(username, code);

    const user = await UserModel.findOne({ username: username });

    console.log("user", user);
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

    // if the expiry date is less than the date currently
    // then the code is expired
    const isCodeExpired = new Date(user.verifyCodeExpiry) < new Date();

    if (isCodeExpired) {
      return Response.json(
        {
          success: false,
          message: "Verification code has been expired!",
        },
        {
          status: 400,
        }
      );
    }

    console.log(
      "User code, recieved code, isCodeExpired",
      user.verifyCode,
      ",",
      code,
      ",",
      isCodeExpired
    );

    if (user.verifyCode === code && !isCodeExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "User verified successfully!",
        },
        { status: 200 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect code, Please check the code!",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log("Error verifying user!:", error);

    return Response.json(
      {
        success: false,
        message: "Error verifying user!",
      },
      {
        status: 400,
      }
    );
  }
}
