import { z } from "zod";

export const messageSchema = z.object({
  message: z
    .string()
    .min(5, { message: "Message must be atleast 10 characters long!" })
    .max(200, {
      message: "Message must not be longer than 200 characters!   ",
    }),
});
