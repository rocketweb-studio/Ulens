import { baseApi } from '@/src/store/baseApi'
import { GetRoomsResponce } from '@/src/entities/messenger/api/messengerApi.type'

export const messengerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getRooms: build.query<GetRoomsResponce, void>({
      query: () => 'messenger/rooms',
    }),
    createRoom: build.mutation<GetRoomsResponce, { targetUserId: string }>({
      query: (body) => ({
        method: 'POST',
        url: 'messenger/rooms',
        body,
      }),
    }),
  }),
})

export const { useGetRoomsQuery, useCreateRoomMutation } = messengerApi
