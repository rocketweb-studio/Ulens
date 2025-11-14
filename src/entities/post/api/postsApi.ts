import {baseApi} from '@/src/store/baseApi'
import {
  GetPostByIdResponse,
  GetPostsByUserIdResponse,
  UploadPostImageResponse,
} from '@/src/entities/post/api/postsApi.types'

export const postsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPostsByUsedId: build.query<GetPostsByUserIdResponse, { userId: string }>({
      query: ({userId}) => `posts/user/${userId}`,
      providesTags: ['GetPostsByUsedId'],
    }),
    getPostById: build.query<GetPostByIdResponse, { postId: string }>({
      query: ({postId}) => `posts/${postId}`,
    }),
    createPost: build.mutation<{ id: string }, { description: string }>({
      query: (body) => ({
        method: 'POST',
        url: 'posts',
        body,
      }),
    }),

    updatePost: build.mutation<void, { postId: string; description: string | undefined }>({
      query: ({postId, ...body}) => ({
        method: 'PUT',
        url: `posts/${postId}`,
        body,
      }),
      invalidatesTags: ['GetPostsByUsedId'],
    }),

    deletePost: build.mutation<void, { postId: string; userId: string }>({
      query: ({postId}) => ({
        method: 'DELETE',
        url: `posts/${postId}`,
      }),
      async onQueryStarted({postId, userId}, {dispatch, queryFulfilled}) {
        const patchResult = dispatch(
          postsApi.util.updateQueryData('getPostsByUsedId', {userId}, (draft) => {
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
      query: ({postId, images}) => {
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
        }
      },
      query: ({pageParam}) => ({
        method: 'get',
        url: `posts/followings`,
        params: {endCursorPostId: pageParam, pageSize: '1' },
      }),
    }),
    getLikePost: build.mutation<void, { postId: string | undefined }>({
      //убоать undefined когда Api будет готова
      query: ({postId}) => ({
        method: 'POST',
        url: `/posts/${postId}/like`,
      }),
      invalidatesTags: ['GetPostsByUsedId'],
      // (result, error, {postId}) => [{ type: 'Post', id: postId}],
    }),

    deleteLikePost: build.mutation<void, { postId: string | undefined }>({
      //убоать undefined когда Api будет готова
      query: ({postId}) => ({
        method: 'DELETE',
        url: `/posts/${postId}/unlike`,
      }),
      invalidatesTags: ['GetPostsByUsedId'],
      // (result, error, {postId}) => [{ type: 'Post', id: postId}],
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
  useGetLikePostMutation,
  useDeleteLikePostMutation,
} = postsApi
