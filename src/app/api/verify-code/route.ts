import dbConnect from "@/lib/dbConnect";
import UserModel from "@/modal/users";
import { verficationValidationSchema } from "@/zodValidators/verficationSchema";

export async function POST(requet: Request) {
  dbConnect();

  try {
    const { username, code } = await requet.json();
    const decodedUsername = decodeURIComponent(username);

    //validate using zod
    const { success, error } = verficationValidationSchema.safeParse(
      username,
      code
    );

    if (!success) {
      const validationError = error.format()._errors || [];
      return Response.json({
        success: false,
        message:
          validationError.length > 0
            ? validationError.join(", ")
            : "Invalid information",
      });
    }

    //check user
    const user = await UserModel.findOne({
      username: decodedUsername,
    });

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    //check code matches
    const codeValid = user.verificationCode === code;

    //check expiry time
    const checkValidity = new Date(user.verificationCodeExpiry) > new Date();

    //if code and time both are ok then make user verified
    //else
    //either time expired
    //or code is wrong
    if (codeValid && checkValidity) {
      user.isVerified = true;
      user.save();

      return Response.json(
        {
          success: true,
          message: "User verified successfully!",
        },
        { status: 200 }
      );
    } else if (!checkValidity) {
      return Response.json(
        { success: false, message: "Verification expired!" },
        { status: 400 }
      );
    } else {
      return Response.json(
        { success: false, message: "Invalid verification code!" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying user:", error);
    return Response.json(
      { success: false, message: "Error verifying user" },
      { status: 500 }
    );
  }
}
