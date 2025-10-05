'use client'

import { redirect, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Path } from '@/src/shared/constants/Path'
import { Tabs } from '@/src/shared/components/Tabs'
import { useGetMeQuery } from '@/src/feature/auth/api/authApi'

const allowedParts = ['info', 'devices', 'subscriptions', 'payments']

function SettingsContent() {
  const { isError } = useGetMeQuery()

  if (isError) {
    redirect(Path.SignIn)
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SettingsPageContent />
    </Suspense>
  )
}

function SettingsPageContent() {
  const params = useSearchParams()
  const part = params.get('part')

  if (!part || !allowedParts.includes(part)) {
    redirect(Path.Settings('info'))
  }

  return (
    <div>
      <Tabs />
      {part === 'info' && <p>Текущий раздел: {part}</p>}
      {part === 'devices' && <p>Текущий раздел: {part}</p>}
      {part === 'subscriptions' && <p>Текущий раздел: {part}</p>}
      {part === 'payments' && <p>Текущий раздел: {part}</p>}
    </div>
  )
}

export default SettingsContent
