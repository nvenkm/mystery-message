import { dbConnect } from "../../../lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dayjs from "dayjs";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email, username, password } = await request.json();

    //check if an unverified user already exists with the same username
    const existingUnverifiedUserByUsername = await UserModel.findOne({
      isVerified: false,
      username: username,
    });
    //if expired
    if (
      existingUnverifiedUserByUsername &&
      dayjs(new Date()).isAfter(
        dayjs(existingUnverifiedUserByUsername.verifyCodeExpiry)
      )
    ) {
      await UserModel.deleteOne({ username: username, isVerified: false });
    } else {
      return Response.json(
        {
          success: false,
          message: "Username is already taken!",
        },
        {
          status: 400,
        }
      );
    }

    //verified user already exists with the same username
    const existingVerifiedUserByUsername = await UserModel.findOne({
      isVerified: true,
      username: username,
    });

    if (existingVerifiedUserByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken!",
        },
        {
          status: 400,
        }
      );
    }

    const existingUserByEmail = await UserModel.findOne({
      email: email,
    });

    //6 Digit code generation
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    //if existing email user found
    if (existingUserByEmail) {
      //existing user is verified
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists!",
          },
          {
            status: 400,
          }
        );
      } else {
        const hashed = await bcrypt.hash(password, 10);

        //change the fields
        existingUserByEmail.password = hashed;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.username = username;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); //1Hr expiry

        await existingUserByEmail.save();
      }
    } else {
      const hashed = await bcrypt.hash(password, 10);

      //1 Hour expiry date
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username: username,
        email: email,
        password: hashed,
        verifyCode: verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });

      const savedNewUser = await newUser.save();
    }

    //send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        {
          status: 500,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Verification email sent!",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user.",
      },
      {
        status: 500,
      }
    );
  }
}
