import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useGetMeQuery } from '@/src/entities/auth/api/authApi'
import { Path } from '@/src/shared/router/Path'

export const useRedirectIfAuthorized = () => {
  const router = useRouter()
  const { data, isLoading, error } = useGetMeQuery()

  useEffect(() => {
    if (data && !error) {
      router.push(Path.UserProfile(data.id))
    }
  }, [data, error])

  return isLoading && !error
}
