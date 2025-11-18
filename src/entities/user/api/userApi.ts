import { baseApi } from '@/src/store/baseApi'
import { getFollowResponse } from '@/src/entities/user/api/user.types'

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getFollowers: build.query<getFollowResponse, void>({
      query: () => `users/followers`,
      providesTags: ['Followers'],
    }),
    getFollowings: build.query<getFollowResponse, void>({
      query: () => `users/followings`,
      providesTags: ['Followings'],
    }),
    followUser: build.mutation<{ success: boolean }, { userId: string }>({
      query: (body) => ({ method: 'POST', url: `users/follow`, body }),
      invalidatesTags: ['Followings', 'GetProfileByUsedId'],
    }),
    unfollowUser: build.mutation<{ success: boolean }, { userId: string }>({
      query: (body) => ({ method: 'POST', url: 'users/unfollow', body }),
      invalidatesTags: ['Followings', 'GetProfileByUsedId'],
    }),
  }),
})

export const { useFollowUserMutation, useUnfollowUserMutation, useGetFollowersQuery, useGetFollowingsQuery } = userApi
