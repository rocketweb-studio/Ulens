import { baseApi } from '@/src/store/baseApi'
import { UserSessions } from '@/src/entities/session/api/sessionApi.types'

export const sessionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSessions: build.query<UserSessions, void>({
      query: () => 'sessions',
      providesTags: ['Sessions'],
    }),
    deleteAllSession: build.mutation<void, void>({
      query: () => ({
        url: `sessions`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Sessions'],
    }),
    deleteSessionById: build.mutation<void, { deviceId: string }>({
      query: ({ deviceId }) => ({
        url: `sessions/${deviceId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Sessions'],
    }),
  }),
})

export const { useGetSessionsQuery, useDeleteAllSessionMutation, useDeleteSessionByIdMutation } = sessionApi
