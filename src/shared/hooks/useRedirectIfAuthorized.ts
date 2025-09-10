import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useGetMeQuery } from '@/src/feature/auth/api/authApi'
import {Path} from "@/src/shared/constants/Path";

export const useRedirectIfAuthorized = (redirectTo = Path.Profile) => {
  const router = useRouter()
  const { data, isLoading, error } = useGetMeQuery()

  useEffect(() => {
    if (data && !error) {
      router.push(redirectTo)
    }
  }, [data, error])

  return isLoading && !error
}
