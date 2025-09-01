import {fetchBaseQuery, createApi} from "@reduxjs/toolkit/query/react";
import {delay} from "@/src/common/utils";
import {handleError} from "@/src/common/utils/handleError";
import {setLoaderStatus} from "@/src/app/app-slice";

export const baseApi = createApi({
  reducerPath: "Ulens",

  baseQuery: async (args, api, extraOptions) => {
    api.dispatch(setLoaderStatus({ status: 'loading' }))
    if (args.url?.includes('auth/')) {
      await delay(1000)
    }
    try {
      const fetchResult = await fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
        credentials: "include",
        prepareHeaders: (headers) => {
          const token = localStorage.getItem('accessToken');
          if (token) {
            headers.set('Authorization', `Bearer ${token}`);
          }
          return headers;
        },
      })(args, api, extraOptions)

      await handleError(api, fetchResult)

      return fetchResult
    } finally {
      api.dispatch(setLoaderStatus({ status: 'idle' }))
    }

  },
  endpoints: () => ({

  }),
})
