import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponseInterface } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponseInterface> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Mystery message verification email.",
      react: VerificationEmail({ username: username, otp: verifyCode }),
    });

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
