import {baseApi} from "@/src/store/baseApi";


export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    followUser: build.mutation<{ success: boolean }, { userId: string }>({
      query: (body) => ({method: 'post' ,url: `users/follow`, body }),

    }),
    unfollowUser: build.mutation<{ success: boolean },  { userId: string }>({
      query: (body) => ({method: 'post', url: 'users/unfollow', body}),

    }),
  })
})

export const { useFollowUserMutation , useUnfollowUserMutation } = userApi
