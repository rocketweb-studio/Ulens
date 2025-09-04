import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react"

export const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    (typeof error.status === "number" || error.status === "FETCH_ERROR" || error.status === "PARSING_ERROR")
  )
}
