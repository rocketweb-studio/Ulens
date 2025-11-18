import { baseApi } from '@/src/store/baseApi'
import { NotificationResponse } from '@/src/entities/notification/api/notificationApi.types'

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getNotifications: build.query<NotificationResponse, void>({
      query: () => 'notifications',
      providesTags: ['Notifications'],
    }),

    readNotifications: build.mutation<string, number[]>({
      query: (notificationIds) => ({
        method: 'put',
        url: 'notifications/read',
        body: {
          notificationIds,
        },
      }),
      invalidatesTags: ['Notifications'],
    }),
  }),
})

export const { useGetNotificationsQuery, useReadNotificationsMutation } = notificationsApi
