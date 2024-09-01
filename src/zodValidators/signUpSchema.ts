import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "username must be atleast 2 characters")
  .max(20, "username can't be more than 20 charaacters")
  .regex(/[^a-zA-Z0-9]/g, "speacial characters are not allowed");

export const signUpValidation = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, "password must be atleast 6 characters"),
});
