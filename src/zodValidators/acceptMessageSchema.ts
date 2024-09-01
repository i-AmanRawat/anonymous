import { z } from "zod";

export const acceptMessageValidation = z.object({
  accept: z.boolean(),
});
