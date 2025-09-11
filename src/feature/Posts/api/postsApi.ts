import {baseApi} from '@/src/store/baseApi'
import {
  CreatePostResponse,
  GetPostsByUserIdResponse,
  UploadPostImageResponse
} from "@/src/feature/Posts/api/postsApi.types";

export const postsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPostsByUsedId: build.query<GetPostsByUserIdResponse, string | undefined>({
      query: (userId) => `posts/${userId}`,
    }),

    createPost: build.mutation<CreatePostResponse, { description: string }>(
      {
        query: (body) => ({
          method: 'POST',
          url: 'posts',
          body,
        }),
      }
    ),

    updatePost: build.mutation<void, { postId: string, description: string }>(
      {
        query: ({ postId, ...body }) => ({
          method: 'PUT',
          url: `posts/${postId}`,
          body,
        }),
      }
    ),

    deletePost: build.mutation<void, string>({
      query: (postId) => ({
        method: 'DELETE',
        url: `posts/${postId}`,
      }),
    }),

    uploadPostImages: build.mutation<UploadPostImageResponse[], { postId: string; images: File[] }>(
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
