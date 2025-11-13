import { baseApi } from '@/src/store/baseApi'
import { NotificationResponse } from '@/src/entities/notification/api/notificationApi.types'

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getNotifications: build.query<NotificationResponse, void>({
      query: () => 'notifications',
      providesTags: ['Notifications'],
    }),

    readNotifications: build.mutation<string, { id: number | string }>({
      query: ({ id }) => ({
        method: 'put',
        url: 'notifications/read',
        body: {
          notificationId: id,
        },
      }),
      invalidatesTags: ['Notifications'],
    }),
  }),
})

export const { useGetNotificationsQuery, useReadNotificationsMutation } = notificationsApi
