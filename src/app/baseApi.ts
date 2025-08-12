import {fetchBaseQuery, createApi} from "@reduxjs/toolkit/query/react";


export const baseApi = createApi({
  reducerPath: "Ulens",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL
  }),
  endpoints: () => ({}),
})