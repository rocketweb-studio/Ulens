import { baseApi } from '@/src/store/baseApi'
import {
  GetPostByIdResponse,
  GetPostCommentsType,
  GetPostsByUserIdResponse,
  UploadPostImageResponse,
} from '@/src/entities/post/api/postsApi.types'

export const postsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPostsByUsedId: build.query<GetPostsByUserIdResponse, { userId: string }>({
      query: ({ userId }) => `posts/user/${userId}`,
      providesTags: ['GetPostsByUsedId'],
    }),
    getPostById: build.query<GetPostByIdResponse, { postId: string }>({
      query: ({ postId }) => `posts/${postId}`,
      providesTags: ['GetPostById'],
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
      invalidatesTags: ['GetPostById'],
    }),

    deletePost: build.mutation<void, { postId: string; userId: string }>({
      query: ({ postId }) => ({
        method: 'DELETE',
        url: `posts/${postId}`,
      }),
      async onQueryStarted({ postId, userId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          postsApi.util.updateQueryData('getPostsByUsedId', { userId }, (draft) => {
            if (draft?.items) {
              draft.items = draft.items.filter((post) => post.id !== postId)
            }
          }),
        )

        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
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
      invalidatesTags: ['GetPostsByUsedId'],
    }),
    getFollowingsPosts: build.infiniteQuery<GetPostsByUserIdResponse, void, string | undefined>({
      infiniteQueryOptions: {
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => {
          return lastPage.pageInfo.endCursorPostId
        },
      },
      query: ({ pageParam }) => ({
        method: 'GET',
        url: `posts/followings`,
        params: { endCursorPostId: pageParam, pageSize: '1' },
      }),
    }),
    toggleLikePost: build.mutation<void, { likedItemId: string; like: boolean; likedItemType: 'POST' | 'COMMENT' }>({
      query: ({ likedItemId, like, likedItemType }) => ({
        method: 'POST',
        url: `/posts/like`,
        body: {
          likedItemType,
          likedItemId,
          like,
        },
      }),
      // async onQueryStarted({ likedItemId, like }, { dispatch, queryFulfilled }) {
      //   const patchPost = dispatch(
      //     postsApi.util.updateQueryData('getPostById', { postId }, (draft: GetPostByIdResponse) => {
      //       if (!draft) return
      //       draft.isLiked = like
      //       draft.likeCount += like ? 1 : -1
      //     }),
      //   )
      //   try {
      //     await queryFulfilled
      //   } catch {
      //     patchPost.undo()
      //   }
      // },
      invalidatesTags: ['GetPostById', 'GetPostsByUsedId'],
    }),
    getPostComments: build.query<GetPostCommentsType, { postId: string }>({
      query: ({ postId }) => `posts/${postId}/comments`,
      providesTags: ['GetPostComments'],
      keepUnusedDataFor: 10,
    }),
    createComment: build.mutation<void, { postId: string; content: string }>({
      query: ({ postId, ...body }) => ({
        method: 'POST',
        url: `/posts/${postId}/comments`,
        body,
      }),
      invalidatesTags: ['GetPostComments'],
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
  useGetFollowingsPostsInfiniteQuery,
  useToggleLikePostMutation,
  useCreateCommentMutation,
  useGetPostCommentsQuery,
} = postsApi
