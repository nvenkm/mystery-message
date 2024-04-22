import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponseInterface } from "@/types/ApiResponse";
import nodemailer from "nodemailer";

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
        user: "7naveennn@gmail.com",
        pass: process.env.APP_PASS,
      },
    });

    var mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Sending Email using Node.js",
      html: `<div>
              <h4>Hi, ${username}</h4>
              <p>Thankyou for registering with us,</p>
              <p>
                Here&apos;s your OTP: <strong>${verifyCode}</strong>
              </p>
            </div>`,
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
