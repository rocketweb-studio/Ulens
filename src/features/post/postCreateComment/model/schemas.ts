import { z } from 'zod/v4'

export type CreateCommentInput = z.infer<typeof createCommentSchema>

export const createCommentSchema = z.object({
  content: z.string().min(1, { message: 'Must be filled' }).max(300, { message: 'Must be more than 300 characters' }),
})
