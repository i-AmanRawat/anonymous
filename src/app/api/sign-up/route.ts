import bcrypt from "bcryptjs";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/modal/users";
import SendVerificationEmail from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();
  const { username, email, password } = await request.json();

  try {
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    // username is occupied
    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is occupied",
        },
        {
          status: 400,
        }
      );
    }

    const existingUserByEmail = await UserModel.findOne({
      email,
    });
    const verificationCode = String(Math.floor(1000 + Math.random() * 9000));

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          { success: false, message: "User already exist with this email" },
          { status: 400 }
        );
      } else {
        //email is occupied by its not verified yet. since it's not verified yet update the fields user is providing
        const hashedPassword = await bcrypt.hash(password, 10);

        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verificationCode = verificationCode;
        existingUserByEmail.verificationCodeExpiry = new Date(
          Date.now() + 3600000
        );
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 1); //addding 1 hour

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verificationCode: verificationCode,
        verificationCodeExpiry: expiry,
        messages: [],
      });

      await newUser.save();

      //send verification email
      const emailResponse = await SendVerificationEmail(
        email,
        username,
        verificationCode
      );

      console.log("email response object : ", emailResponse);
      //incase: server fails to send mail
      if (!emailResponse.success) {
        return Response.json(
          {
            success: false,
            message: emailResponse.message,
          },
          { status: 500 }
        );
      }

      return Response.json(
        {
          success: true,
          message:
            "User created successfully. Please verify your account by looking at you mail",
        },
        {
          status: 201,
        }
      );
    }
  } catch (error) {
    console.error("Error in registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error in registering user",
      },
      {
        status: 500,
      }
    );
  }
}
