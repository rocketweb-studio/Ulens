import {fetchBaseQuery, createApi} from "@reduxjs/toolkit/query/react";



console.log('process.env.NEXT_PUBLIC_BASE_URL', process.env.NEXT_PUBLIC_BASE_URL)

export const baseApi = createApi({
  reducerPath: "Ulens",
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://ulens.org/api/v1/',
    credentials: 'include',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json')
      headers.set('Accept', 'application/json')
      return headers
    },
  }),
  endpoints: () => ({

  }),
})