'use client'

import {redirect, useSearchParams} from 'next/navigation'
import {Path} from "@/src/shared/constants/Path";
import {Tabs} from "@/src/shared/components/Tabs";
import {useGetMeQuery} from "@/src/feature/auth/api/authApi";

const allowedParts = ['info', 'devices', 'subscriptions', 'payments']

export default function SettingsPage() {
  const params = useSearchParams()
  const {data: meData} = useGetMeQuery()
  const part = params.get('part')

  if (!meData) {
    redirect(Path.SignIn)
  }

  if (!part || !allowedParts.includes(part)) {
    redirect(Path.Settings('info'))
  }

  return (
    <div>
      <Tabs/>
      {part === 'info' && <p>Текущий раздел: {part}</p>}
      {part === 'devices' && <p>Текущий раздел: {part}</p>}
      {part === 'subscriptions' && <p>Текущий раздел: {part}</p>}
      {part === 'payments' && <p>Текущий раздел: {part}</p>}
    </div>
  )
}
