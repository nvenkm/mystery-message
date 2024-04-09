import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(4, "Username must be atleast 4 characters!")
  .max(20, "Username must not be more than 20 characters!")
  .regex(/[^a-zA-Z0-9]+/, "Special characters not allowed!");

export const signupSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email Address!" }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 letters long!" }),
});
