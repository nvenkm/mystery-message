import { z } from "zod";

export const verifySchema = z
  .string()
  .min(6, { message: "Verification code should be atleast 6 characters!" });
