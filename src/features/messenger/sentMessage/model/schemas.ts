import { z } from 'zod/v4'

export type MessageInput = z.infer<typeof messageSchema>

export const messageSchema = z.object({
  message: z.string().min(1, { error: 'Enter message' }),
  // media: z.file().array().nullable().optional(),
})
