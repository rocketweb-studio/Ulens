import { useGetUsersInfiniteQuery } from '@/src/entities/user/api/userApi'
import { useMemo } from 'react'

export const useAvatarMap = () => {
  const { data } = useGetUsersInfiniteQuery({ search: '' })

  return useMemo(() => {
    const map: Record<string, string | null> = {}

    data?.pages.forEach((page) => {
      page.items.forEach((user) => {
        map[user.id] = user.avatar ?? null
      })
    })

    return map
  }, [data])
}
