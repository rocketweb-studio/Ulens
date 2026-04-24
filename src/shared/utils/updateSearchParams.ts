import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

export const updateSearchParams = (newParams: Record<string, string>, router: AppRouterInstance) => {
  const searchParams = new URLSearchParams(window.location.search)

  Object.entries(newParams).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value)
    } else {
      searchParams.delete(key)
    }
  })

  router.replace(`?${searchParams.toString()}`)
}
