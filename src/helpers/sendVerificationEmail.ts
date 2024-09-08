import { resend } from "@/lib/resend";

import VerificationEmail from "@/components/emailTemplate/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export default async function SendVerificationEmail(
  email: string,
  username: string,
  verificationCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Say Anonymous!! | Verification code ",
      react: VerificationEmail({ username, otp: verificationCode }),
    });

    return { success: true, message: "Verification email send successfully" };
  } catch (emailError) {
    console.log("Error in sending verification Email", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}
