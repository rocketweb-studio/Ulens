import { UserProfile } from '@/src/entities/userProfile/model/profileSchema'
import { ImageSizeType } from '@/src/entities/post/api/postsApi.types'

export type GetProfileByUserIdResponse = {
  userName: string
  id: string
  firstName: string
  lastName: string
  city: string
  country: string
  region: string
  dateOfBirth: string
  aboutMe: string
  createdAt: string
  avatars: {
    small: Omit<ImageSizeType, 'uploadId'>
    medium: Omit<ImageSizeType, 'uploadId'>
  }
  publicationsCount: number
  followers: number
  following: number
}

export type UserProfileResponse = UserProfile & {
  id: string
}
