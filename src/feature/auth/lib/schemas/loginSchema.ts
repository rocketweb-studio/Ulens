import {z} from "zod/v4";

export const loginSchema = z.object({
    email: z.email("The email must match the format Ulens@ulens.com"),
    password: z.string().min(1,"Please enter a valid password.")
})