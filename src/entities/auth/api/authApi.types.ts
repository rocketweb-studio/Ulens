import { z } from 'zod'
import { loginSchema } from '@/src/entities/auth/model/schemas/loginSchema'

export type LoginRequestParams = z.infer<typeof loginSchema>
export type LoginResponse = { accessToken: string }
export type getMeResponse = {
  id: string
  userName: string
  email: string
}
