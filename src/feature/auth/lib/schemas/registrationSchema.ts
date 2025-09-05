import { z } from "zod/v4";

export type RegistrationInputs = z.infer<typeof registrationSchema>;

export const registrationSchema = z
  .object({
    userName: z
      .string()
      .trim()
      .min(6, { error: "Minimum number of characters 6" })
      .max(30, { error: "Maximum number of characters 30" })
      .regex(/^[0-9A-Za-z\_-]+$/, {
        error: "Username must contain 0-9, A-Z, a-z, _, -",
      }),
    email: z.email({
      error: "The email must match the format example@example.com",
    }),
    password: z
      .string()
      .trim()
      .min(6, { error: "Minimum number of characters 6" })
      .max(20, { error: "Maximum number of characters 20" })
      .regex(/^[0-9A-Za-z!\"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_{|}~]+$/, {
        error:
          "Password must contain 0-9, a-z, A-Z, ! \" # $ % & ' ( ) * + , - . / : ; < = > ? @ [ \\ ] ^ _ { | } ~",
      }),
    passwordConfirmation: z.string().trim(),
    agreePolitics: z.boolean().refine((val) => val === true, {
      message: "You have to accept the terms",
    }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords must match",
    path: ["passwordConfirmation"],
  });
