import dbConnect from "@/lib/dbConnect";
import UserModel from "@/modal/users";
import { User } from "next-auth";
import { auth } from "@/auth";

//return message accepting status
export async function GET(request: Request) {
  dbConnect();

  const session = await auth();

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      {
        status: 401,
      }
    );
  }

  const userId = session.user._id;

  try {
    const userFound = await UserModel.findById({
      userId,
    });

    if (!userFound) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 401,
        }
      );
    }

    //returning user message acceptance status
    return Response.json(
      {
        success: true,
        message: "User acceptance status found successfully",
        isAcceptingMessage: userFound.isAcceptingMessage,
      },
      {
        status: 401,
      }
    );
  } catch (error) {
    console.log("Error retrieving message acceptance status: ", error);
    return Response.json(
      {
        success: false,
        message: "Error retrieving message acceptance status",
      },
      {
        status: 500,
      }
    );
  }
}

//update message accepting status
export async function POST(request: Request) {
  const session = await auth();

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      {
        status: 401,
      }
    );
  }

  const userId = session.user._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "unable to update accept message status",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Successfully updated accept message status",
        updatedUser,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error updating message acceptance status: ", error);
    return Response.json(
      {
        success: false,
        message: "Error updating message acceptance status",
      },
      {
        status: 500,
      }
    );
  }
}
