import {fetchBaseQuery, createApi} from "@reduxjs/toolkit/query/react";



console.log('process.env.NEXT_PUBLIC_BASE_URL', process.env.NEXT_PUBLIC_BASE_URL)

export const baseApi = createApi({
  reducerPath: "Ulens",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token =localStorage.getItem('accessToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  endpoints: () => ({

  }),
})