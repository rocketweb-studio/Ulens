import { isErrorWithMessage } from './isErrorWithMessage'
import { BaseQueryApi, FetchBaseQueryError, FetchBaseQueryMeta, QueryReturnValue } from '@reduxjs/toolkit/query/react'
import type { ThunkDispatch } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

interface CustomBaseQueryApi extends BaseQueryApi {
  dispatch: ThunkDispatch<any, any, any>
}

export const handleError = async (
  api: CustomBaseQueryApi,
  result: QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>,
) => {
  let error = 'Some error occurred'

  if (result.error) {
    switch (result.error.status) {
      case 'FETCH_ERROR':
      case 'TIMEOUT_ERROR':
      case 'CUSTOM_ERROR':
        error = result.error.error
        break
      case 'PARSING_ERROR':
        error = 'Ошибка парсинга. Свяжетесь с тех поддержкой'
        break
      case 400:
        if (isErrorWithMessage(result.error.data)) {
          error = result.error.data.message
        } else {
          error = '400 Bad Request'
        }
        break
      case 401:
        if (isErrorWithMessage(result.error.data)) {
          error = result.error.data.message
        } else {
          error = '401 Unauthorized. Session expired'
        }
        break
      case 403:
        error = '403 Forbidden Error. Check API-KEY'
        break
      case 404:
        if (isErrorWithMessage(result.error.data)) {
          if (result.error.data.message === 'Subscription not found') return
        }
        break
      case 500:
        if (isErrorWithMessage(result.error.data)) {
          error = result.error.data.message
        } else {
          error = JSON.stringify(result.error.data)
        }
        break
      default:
        error = JSON.stringify(result.error)
        break
    }
    if (api.endpoint !== 'getMe' || result.error.status !== 401) toast.error(error)
  }
}
