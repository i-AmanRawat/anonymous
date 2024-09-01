import { z } from "zod";

export const signInValidation = z.object({
  identifier: z.string(), //could be username or email
  password: z.string().min(6, "password must be atleast 6 characters"),
});
