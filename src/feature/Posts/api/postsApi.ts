import {baseApi} from '@/src/store/baseApi'
import {PostImageType} from "@/src/feature/Posts/api/postsApi.types";

export const postsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPosts: build.query<any, string>({
      query: (userId) => `/api/v1/posts/${userId}`,
    }),

    createPost: build.mutation<void, { description: string }>(
      {
        query: (body) => ({
          method: 'POST',
          url: '/api/v1/posts',
          body,
        }),
      }
    ),

    updatePost: build.mutation<void, { postId: string, description: string }>(
      {
        query: ({ postId, ...body }) => ({
          method: 'PUT',
          url: `/api/v1/posts/${postId}`,
          body,
        }),
      }
    ),

    deletePost: build.mutation<void, string>({
      query: (postId) => ({
        method: 'DELETE',
        url: `/api/v1/posts/${postId}`,
      }),
    }),

    uploadPostImages: build.mutation<PostImageType[], { postId: string; images: File[] }>(
      {
        query: ({ postId, images }) => {
          const formData = new FormData()
          images.forEach((img) => formData.append('images', img))
          return {
            method: 'POST',
            url: `/api/v1/posts/${postId}/images`,
            body: formData,
          }
        },
      }
    ),
  }),
})

export const {
  useGetPostsQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  useUpdatePostMutation,
  useUploadPostImagesMutation
} = postsApi
