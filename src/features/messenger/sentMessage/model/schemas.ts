import { z } from 'zod/v4'

export type MessageInput = z.infer<typeof messageSchema>

export const messageSchema = z.object({
  message: z.string().optional(),
  // media: z.file().array().nullable().optional(),
})
