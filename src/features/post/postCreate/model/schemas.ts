import { z } from 'zod/v4'

export const publicationSchema = z.object({
  description: z
    .string()
    .min(1, { message: 'Must be filled' })
    .max(500, { message: 'Must be more than 500 characters' }),
})
