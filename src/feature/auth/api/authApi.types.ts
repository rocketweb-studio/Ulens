import { z } from 'zod'
import { loginSchema } from '@/src/feature/auth/lib/schemas/loginSchema'

export type UserType = {
  id: number
  email: string
  name: string
  createdAt: string
}

export type LoginRequestParams = z.infer<typeof loginSchema>
export type LoginResponse = { accessToken: string }
export type getMeResponse = {
  id: string
  userName: string
  email: string
}
