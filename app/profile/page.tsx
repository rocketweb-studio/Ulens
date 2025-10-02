'use client'

import { redirect } from 'next/navigation'
import {useGetMeQuery} from "@/src/feature/auth/api/authApi";

export default function ProfilePage() {
  const {data, isSuccess} = useGetMeQuery()
  const isAuth = !!data?.id && isSuccess
  const userId = data?.id
  if (!isAuth) {
    redirect('/')
  } else {
    redirect(`/profile/${userId}`)
  }
}
