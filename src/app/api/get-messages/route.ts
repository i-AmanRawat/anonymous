import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/modal/users";
import mongoose from "mongoose";

export async function GET(request: Request) {
  dbConnect();

  try {
    const session = await auth();
    if (!session || !session.user) {
      return Response.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = session.user;
    //inside authorize function: user._id has been stored as typeof string: this thing will result in error{while setting up aggregation pipe line}: so need to change type of user._id back to: typically what mongoose has type for _id
    const userId = new mongoose.Types.ObjectId(user._id);

    const _user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]).exec();

    if (!user || user.length === 0) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, messages: _user[0].messages },
      { status: 200 }
    );
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
