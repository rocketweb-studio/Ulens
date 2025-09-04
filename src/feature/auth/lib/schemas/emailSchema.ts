import { z } from "zod/v4"

export const emailSchema = z.object({
  email: z.email({ error: "Incorrect email address" }),
  recaptchaToken: z.string().min(1, { error: "Please pass the captcha" }),
})
