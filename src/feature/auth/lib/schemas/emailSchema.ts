import {z} from "zod/v4";

export const emailSchema = z.object({
  email: z.email({error: 'Incorrect email address'}),
  // ReCAPTCHA: z.boolean({error: 'pass the captcha'})
  ReCAPTCHA: z.boolean()
    .refine((val) => val === true, {
      message: 'Please pass the captcha'
    })
})