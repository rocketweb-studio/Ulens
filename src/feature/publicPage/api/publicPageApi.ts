import { baseApi } from '@/src/store/baseApi'
import {GetPostByIdResponse} from "@/src/feature/Posts/api/postsApi.types";

export const publicPageApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getLastPosts: build.query<GetPostByIdResponse[], void>({
      query: () => `${process.env.NEXT_PUBLIC_BASE_URL}posts/last`,

    }),


  }),
})

export const {
useGetLastPostsQuery
} = publicPageApi
