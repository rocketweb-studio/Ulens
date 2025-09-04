import { z } from "zod/v4"

export type EmailInput = z.infer<typeof emailConfirmationSchema>

export const emailConfirmationSchema = z.object({
  email: z.email({
    error: "The email must match the format example@example.com",
  }),
})
