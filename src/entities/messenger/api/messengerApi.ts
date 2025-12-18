import { baseApi } from '@/src/store/baseApi'
import {
  CreateRoomResponce,
  GetMessagesByRoomResponce,
  GetRoomsResponce,
  UploadImageResponse,
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
    uploadMessageImages: build.mutation<UploadImageResponse, { roomId: number; images: File[] | undefined }>({
      query: ({ roomId, images }) => {
        const formData = new FormData()
        if (images) {
          images.forEach((img) => formData.append('images', img))
        }
        return {
          method: 'POST',
          url: `messenger/rooms/${roomId}/images`,
          body: formData,
        }
      },
      // invalidatesTags: (result, error, { roomId }) => [
      //   { type: 'GetMessagesByRoomId', id: roomId }
      // ],
    }),
  }),
})

export const { useGetRoomsQuery, useCreateRoomMutation, useGetMessagesByRoomIdQuery, useUploadMessageImagesMutation } =
  messengerApi
