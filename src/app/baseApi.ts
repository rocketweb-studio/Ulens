import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '@/src/app/baseQueryWithReauth'

export const baseApi = createApi({
  reducerPath: 'Ulens',
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: ['Auth', 'User'],
})
