import dbConnect from "@/lib/dbConnect";
import UserModel from "@/modal/users";
import { usernameValidationSchema } from "@/zodValidators/signUpSchema";

export async function GET(request: Request) {
  await dbConnect();

  try {
    //extract user name from query params
    const { searchParams } = new URL(request.url);

    // const username = { username: searchParams.get("username") };
    const username = searchParams.get("username");

    //validate username using zod
    const { success, error } = usernameValidationSchema.safeParse({
      username,
    });

    if (!success) {
      // throw new Error("Invalid username");   //zod also returns error array in which it keeps pushing errors so here rather then throwing our own error message we are leveraging zod's error message
      const usernameError = error.format()._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameError.length > 0
              ? usernameError.join(", ")
              : "Invalid usernmae",
        },
        {
          status: 400,
        }
      );
    }

    //match username with existing users for verified users : return usename is taken
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        {
          status: 409,
        }
      );
    }
    //else username is unique
    return Response.json(
      {
        success: true,
        message: "Username is unique",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error checking username:", error);
    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
