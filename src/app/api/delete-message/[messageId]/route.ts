import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/modal/users";
import mongoose from "mongoose";
import { User } from "next-auth";

export async function DELETE(requst: Request, params: { messageId: string }) {
  const { messageId } = params;

  dbConnect();

  try {
    const session = await auth();
    if (!session || !session.user) {
      return Response.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const user: User = session.user;

    const result = await UserModel.updateOne(
      {
        _id: user._id,
      },
      {
        $pull: { messages: { _id: messageId } },
      }
    );

    if (result.modifiedCount === 0) {
      return Response.json(
        {
          success: false,
          message: "Message not found or maybe already deleted",
        },
        { status: 404 }
      );
    }

    return Response.json(
      { message: "Message deleted", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting message:", error);
    return Response.json(
      { success: false, message: "Error deleting message" },
      { status: 500 }
    );
  }
}
