import {baseApi} from '@/src/store/baseApi'
import {
  GetPostsByUserIdResponse,
  UploadPostImageResponse
} from "@/src/feature/Posts/api/postsApi.types";

export const postsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPostsByUsedId: build.query<GetPostsByUserIdResponse, { userId: string | undefined }>({
      query: ({userId}) => `posts/${userId}`,
      providesTags: ["getPostsByUsedId"]
    }),

    createPost: build.mutation<{id: string}, { description: string }>(
      {
        query: (body) => ({
          method: 'POST',
          url: 'posts',
          body,
        }),
      }
    ),

    updatePost: build.mutation<void, { postId: string, description: string | undefined }>(
      {
        query: ({ postId, ...body }) => ({
          method: 'PUT',
          url: `posts/${postId}`,
          body,
        }),
        invalidatesTags: ["getPostsByUsedId"]
      }
    ),

    deletePost: build.mutation<void, {postId: string}>({
      query: ({postId}) => ({
        method: 'DELETE',
        url: `posts/${postId}`,
      }),
      invalidatesTags: ["getPostsByUsedId"]
    }),

    uploadPostImages: build.mutation<UploadPostImageResponse[], { postId: string | undefined; images: File[] }>(
      {
        query: ({ postId, images }) => {
          const formData = new FormData()
          images.forEach((img) => formData.append('images', img))
          return {
            method: 'POST',
            url: `posts/${postId}/images`,
            body: formData,
          }
        },
        invalidatesTags: ["getPostsByUsedId"]
      }
    ),
  }),
})

export const {
  useGetPostsByUsedIdQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  useUpdatePostMutation,
  useUploadPostImagesMutation
} = postsApi
