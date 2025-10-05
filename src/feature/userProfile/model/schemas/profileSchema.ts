import {z} from 'zod/v4'

// export const profileSchema = z.object({
//   userName: z.string().min(1, { error: 'Please pass the captcha' }),
//   firstName: z.string().min(1, { error: 'Please pass the captcha' }),
//   lastName: z.string().min(1, { error: 'Please pass the captcha' }),
//   city: z.string(),
//   country: z.string(),
//   region: z.string(),
//   dateOfBirth: z.string(),
//   aboutMe: z.string().max(200, { error: 'Please pass the captcha' }),
// })


const usernameRegex = /^[A-Za-z0-9_-]+$/;
const nameRegex = /^[A-Za-z\u0400-\u04FF]+$/u; // латиница + кириллица (включая ё/Ё и прочие кириллические буквы)
// const dobFormatRegex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(19|20)\d{2}$/;

export const profileSchema = z.object({
  userName: z
    .string()
    .min(6, {message: 'Username должен быть минимум 6 символов'})
    .max(30, {message: 'Username должен быть максимум 30 символов'})
    .regex(usernameRegex, {message: 'Username может содержать только латинские буквы, цифры, _ и -'}),

  firstName: z
    .string()
    .min(1, {message: 'First Name обязателен'})
    .max(50, {message: 'First Name должен быть максимум 50 символов'})
    .regex(nameRegex, {message: 'First Name может содержать только латинские и русские буквы'})
    .nullable(),

  lastName: z
    .string()
    .min(1, {message: 'Last Name обязателен'})
    .max(50, {message: 'Last Name должен быть максимум 50 символов'})
    .regex(nameRegex, {message: 'Last Name может содержать только латинские и русские буквы'})
    .nullable(),

  city: z.string().nullable(),
  country: z.string().nullable(),
  region: z.string().nullable(),

  dateOfBirth: z
    .string()
    .refine((s) => {
      if (!s) return true;
      const [dd, mm, yyyy] = s.split('.').map(Number);
      const birthDate = new Date(yyyy, mm - 1, dd);
      const today = new Date();

      const age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      const isUnder13 =
        age < 13 || (age === 13 && (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())));

      return !isUnder13;
    }, { message: 'A user under 13 cannot create a profile. <u>Privacy Policy</u>' })
    .nullable(),

  aboutMe: z
    .string()
    .max(200, {message: 'About me не должен превышать 200 символов'})
    .nullable(),
});

export type UserProfile = z.infer<typeof profileSchema>;