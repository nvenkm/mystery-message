import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponseInterface } from "@/types/ApiResponse";
import nodemailer from "nodemailer";
import ejs from "ejs";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponseInterface> {
  try {
    // await resend.emails.send({
    //   from: "onboarding@resend.dev",
    //   to: email,
    //   subject: "Mystery message verification email.",
    //   react: VerificationEmail({ username: username, otp: verifyCode }),
    // });

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASS,
      },
    });

    console.log(
      `Verify page link : ${process.env.HOMEPAGE_URL}/verify/${username}`
    );
    //render the ejs template
    const html = await ejs.renderFile("emails/verificationEmail.ejs", {
      username: username,
      otp: verifyCode,
      link: `${process.env.HOMEPAGE_URL}/verify/${username}`,
    });

    var mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Sending Email using Node.js",
      html: html,
    };
    const sent = await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: "Verification email sent successfully!",
    };
  } catch (error) {
    console.error("Error sending verification email!", error);
    return {
      success: false,
      message: "Failed to send verification email!",
    };
  }
}
