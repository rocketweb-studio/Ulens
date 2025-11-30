import { baseApi } from '@/src/store/baseApi'
import {
  CreateRoomResponce,
  GetMessagesByRoomResponce,
  GetRoomsResponce,
} from '@/src/entities/messenger/api/messengerApi.type'

export const messengerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getRooms: build.query<GetRoomsResponce, void>({
      query: () => 'messenger/rooms',
      providesTags: ['GetRooms'],
    }),
    getMessagesByRoomId: build.query<GetMessagesByRoomResponce, { roomId: number }>({
      query: ({ roomId }) => `messenger/rooms/${roomId}/messages`,
      providesTags: ['GetMessagesByRoomId'],
    }),
    createRoom: build.mutation<CreateRoomResponce, { targetUserId: string }>({
      query: (body) => ({
        method: 'POST',
        url: 'messenger/rooms',
        body,
      }),
      invalidatesTags: ['GetRooms'],
    }),
  }),
})

export const { useGetRoomsQuery, useCreateRoomMutation } = messengerApi
