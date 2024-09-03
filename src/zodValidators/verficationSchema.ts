import { z } from "zod";
import { usernameValidationSchema } from "./signUpSchema";

export const verficationValidationSchema = z.object({
  username: usernameValidationSchema,
  code: z.string().length(6, "verification code must be 6 characters"),
});
