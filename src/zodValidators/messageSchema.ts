import { z } from "zod";

export const messageValidationSchema = z.object({
  content: z
    .string()
    .min(2, { message: "content must be atleast 2 characters" })
    .max(300, { message: "content must not exceed 300 characters" }),
});
