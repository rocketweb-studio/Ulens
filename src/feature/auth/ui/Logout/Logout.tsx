'use client'

import { useEffect, useState } from 'react'
import { ConfirmLogout } from '@/src/feature/auth/ui/Logout/ConfirmLogout'
import styles from '@/src/feature/auth/ui/SignIn/SignIn.module.scss'
import { useGetMeQuery } from '@/src/feature/auth/api/authApi'
import { useRouter } from 'next/navigation'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { SerializedError } from '@reduxjs/toolkit'
import { Path } from '@/src/shared/constants/Path'

export const Logout = () => {
  const [isModalOpen, setIsModalOpen] = useState(true)
  const { data, isLoading, isError, error } = useGetMeQuery()
  const email = data?.email ?? ''
  const router = useRouter()

  const handleServerError = (error: FetchBaseQueryError | SerializedError | undefined) => {
    if (!error) return

    if ('status' in error) {
      if (error.status === 401) {
        router.push(Path.SignIn)
      }
    }
  }

  useEffect(() => {
    if (isError) {
      handleServerError(error)
    }
  }, [isError, error])

  if (isLoading) {
    return (
      <button disabled className={styles.submitBtn}>
        Loading...
      </button>
    )
  }

  return (
    <>
      <ConfirmLogout isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} email={email} />
    </>
  )
}
