import {Mutex} from 'async-mutex'
import {BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError} from '@reduxjs/toolkit/query/react'
import {handleError} from '@/src/shared/utils/handleError'

const mutex = new Mutex()

const baseQueryWithAccessToken = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
})

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {

  const isLogoutRequest = typeof args === 'object' && args.url === 'auth/logout'

  if (!isLogoutRequest) {
    await mutex.waitForUnlock()
  }

  try {
    // if (typeof args === 'object' && args.url?.includes('auth/')) {
    //     api.dispatch(setLoaderStatus({ status: 'loading' }))
    // }

    let result = await baseQueryWithAccessToken(args, api, extraOptions)

    const isRefreshRequest = typeof args === 'object' && args.url === 'auth/refresh'

    if (result.error?.status === 401 && !isRefreshRequest) {
      if (!mutex.isLocked()) {
        const release = await mutex.acquire()
        try {
          const refreshResult = await baseQueryWithAccessToken(
            {
              url: 'auth/refresh',
              method: 'post',
              credentials: 'include',
            },
            api,
            extraOptions,
          )

          if (refreshResult.data) {
            // @ts-expect-error accessToken
            localStorage.setItem('accessToken', refreshResult.data.accessToken)
            result = await baseQueryWithAccessToken(args, api, extraOptions)
          } else {
            localStorage.removeItem('accessToken')
            //api.dispatch(logout());
          }
        } finally {
          release()
        }
      } else {
        await mutex.waitForUnlock()
        result = await baseQueryWithAccessToken(args, api, extraOptions)
      }
    }

    await handleError(api, result)

    return result
  } finally {
    // if (typeof args === 'object' && args.url?.includes('auth/')) {
    //   api.dispatch(setLoaderStatus({ status: 'idle' }))
    // }
  }
}
