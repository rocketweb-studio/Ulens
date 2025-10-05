import { baseApi } from '@/src/store/baseApi'
import { GetProfileByUserIdResponse, UserProfileResponse } from '@/src/entities/userProfile/api/userProfile.types'
import { UserProfile } from '@/src/entities/userProfile/model/profileSchema'

export const userProfileApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProfileByUsedId: build.query<GetProfileByUserIdResponse, { userId: string }>({
      query: ({ userId }) => `profile/${userId}`,
      providesTags: ['GetProfileByUsedId'],
    }),
    updateProfile: build.mutation<UserProfileResponse, UserProfile>({
      query: (body) => ({ method: 'put', url: 'profile', body }),
      invalidatesTags: ['GetProfileByUsedId'],
    }),
  }),
})

export const { useGetProfileByUsedIdQuery, useUpdateProfileMutation } = userProfileApi
