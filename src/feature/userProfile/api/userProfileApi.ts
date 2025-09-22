import {baseApi} from '@/src/store/baseApi'
import {GetProfileByUserIdResponse} from "@/src/feature/userProfile/api/userProfile.types";


export const userProfileApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProfileByUsedId: build.query<GetProfileByUserIdResponse, { userId: string }>({
      query: ({ userId }) => `profile/${userId}`,
      providesTags: ['getProfileByUsedId'],
    }),
  }),
})

export const {
 useGetProfileByUsedIdQuery
} = userProfileApi
