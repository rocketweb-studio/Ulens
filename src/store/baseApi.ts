import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '@/src/store/baseQueryWithReauth'

export const baseApi = createApi({
  reducerPath: 'Ulens',
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: [
    'Auth',
    'GetPostsByUsedId',
    'GetProfileByUsedId',
    'MySubscription',
    'Notifications',
    'Followers',
    'Followings',
    'GetPostById',
    'GetPostComments',
    'Sessions',
    'GetRooms',
    'GetMessagesByRoomId',
  ],
})
