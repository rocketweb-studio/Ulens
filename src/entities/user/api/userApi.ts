import { baseApi } from '@/src/store/baseApi'
import { getFollowResponse, PaginatedUsersType } from '@/src/entities/user/api/user.types'

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
    getUsers: build.infiniteQuery<PaginatedUsersType, { search: string }, string | undefined>({
      infiniteQueryOptions: {
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => {
          return lastPage.pageInfo.endCursorUserId
        },
      },
      query: ({ pageParam, queryArg }) => {
        return {
          url: `users`,
          params: { endCursorUserId: pageParam, pageSize: '10', search: queryArg.search },
        }
      },
    }),
  }),
})

export const {
  useFollowUserMutation,
  useUnfollowUserMutation,
  useGetFollowersQuery,
  useGetFollowingsQuery,
  useGetUsersInfiniteQuery,
} = userApi
