import {fetchBaseQuery, createApi} from "@reduxjs/toolkit/query/react";
import {delay} from "@/src/common/utils";
import {handleError} from "@/src/common/utils/handleError";

export const baseApi = createApi({
  reducerPath: "Ulens",

  baseQuery: async (args, api, extraOptions) => {
    if (args.url?.startsWith('auth/') || args === 'auth/me') {
      await delay(1000)
    }
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
  },
  endpoints: () => ({

  }),
})
