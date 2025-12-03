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
      // async onCacheEntryAdded({ roomId }, { cacheDataLoaded, cacheEntryRemoved, updateCachedData }) {
      //   const token = localStorage.getItem('accessToken')
      //   await cacheDataLoaded
      //
      //   const socket = io(process.env.NEXT_PUBLIC_WS_URL, {
      //     auth: {
      //       token,
      //     },
      //     transports: ['websocket', 'polling'],
      //     withCredentials: true,
      //   })
      //   socket.on(ChatEvent.SubscribeChat, (message) => {
      //     updateCachedData((draft) => {
      //       draft.push(message)
      //     })
      //   })
      //
      //   await cacheEntryRemoved
      // },
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

export const { useGetRoomsQuery, useCreateRoomMutation, useGetMessagesByRoomIdQuery } = messengerApi
