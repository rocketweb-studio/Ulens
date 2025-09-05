import { z } from "zod/v4";

export const passwordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Minimum number of characters 6" })
      .max(20, { message: "Maximum number of characters 20" })
      .regex(
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~])/,
        {
          message:
            "Password must contain 0-9, a-z, A-Z, ! \" # $ % & ' ( ) * + , - . / : ; < = > ? @ [ \\ ] ^ _ { | } ~",
        },
      ),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords must match",
    path: ["passwordConfirmation"],
  });
