import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/modal/users";
import { messageValidationSchema } from "@/zodValidators/messageSchema";
import { usernameValidationSchema } from "@/zodValidators/signUpSchema";
import z from "zod";

const sendMessageSchema = z.object({
  username: usernameValidationSchema,
  content: messageValidationSchema,
});

export async function POST(request: Request) {
  dbConnect();

  try {
    const { username, content } = await request.json();

    //validate using zod
    const { success, error } = sendMessageSchema.safeParse(username, content);

    if (!success) {
      const sendMessageError = error.format()._errors || [];
      return Response.json({
        success: false,
        message:
          sendMessageError.length > 0
            ? sendMessageError.join(", ")
            : "Invalid provided field",
      });
    }

    //check user exist
    const user = await UserModel.findOne({
      username,
    }).exec();

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User doesn't exist",
        },
        {
          status: 404,
        }
      );
    }

    //check acceptingMessage status of user
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "User not accepting message",
        },
        {
          status: 403, //forbidden
        }
      );
    }

    //build message object
    const newMessage = {
      content,
      createdAt: new Date(),
    };

    //push content to message array
    user.messages.push(newMessage as Message);
    await user.save();

    //send success response
    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log("Error sending message: ", error);
    return Response.json(
      {
        success: false,
        message: "Error sending message",
      },
      {
        status: 500,
      }
    );
  }
}
