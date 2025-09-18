import { baseApi } from '@/src/store/baseApi'
import {
  GetPostByIdResponse,
  GetPostsByUserIdResponse,
  UploadPostImageResponse,
} from '@/src/feature/Posts/api/postsApi.types'

export const postsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPostsByUsedId: build.query<GetPostsByUserIdResponse, { userId: string | undefined }>({
      query: ({ userId }) => `posts/${userId}`,
      providesTags: ['getPostsByUsedId'],
    }),
    getPostById: build.query<GetPostByIdResponse, { postId: string | undefined }>({
      query: ({ postId }) => `posts/${postId}`,
    }),
    createPost: build.mutation<{ id: string }, { description: string }>({
      query: (body) => ({
        method: 'POST',
        url: 'posts',
        body,
      }),
    }),

    updatePost: build.mutation<void, { postId: string; description: string | undefined }>({
      query: ({ postId, ...body }) => ({
        method: 'PUT',
        url: `posts/${postId}`,
        body,
      }),
      invalidatesTags: ['getPostsByUsedId'],
    }),

    deletePost: build.mutation<void, { postId: string }>({
      query: ({ postId }) => ({
        method: 'DELETE',
        url: `posts/${postId}`,
      }),
      invalidatesTags: ['getPostsByUsedId'],
    }),

    uploadPostImages: build.mutation<
      UploadPostImageResponse[],
      { postId: string | undefined; images: File[] | undefined }
    >({
      query: ({ postId, images }) => {
        const formData = new FormData()
        if (images) {
          images.forEach((img) => formData.append('images', img))
        }
        return {
          method: 'POST',
          url: `posts/${postId}/images`,
          body: formData,
        }
      },
      invalidatesTags: ['getPostsByUsedId'],
    }),
  }),
})

export const {
  useGetPostsByUsedIdQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  useUpdatePostMutation,
  useUploadPostImagesMutation,
} = postsApi
