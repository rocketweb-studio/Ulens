'use client'

import { Tabs } from 'src/widgets/Tabs'
import { redirect, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Path } from '@/src/shared/router/Path'

import { useGetMeQuery } from '@/src/entities/auth/api/authApi'
import { GeneralInformation } from '@/src/pages/generalInformation'

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
  const part = params?.get('part')

  if (!part || !allowedParts.includes(part)) {
    redirect(Path.Settings('info'))
  }

  return (
    <div>
      <Tabs />
      {part === 'info' && <GeneralInformation />}
      {part === 'devices' && <p>Текущий раздел: {part}</p>}
      {part === 'subscriptions' && <p>Текущий раздел: {part}</p>}
      {part === 'payments' && <p>Текущий раздел: {part}</p>}
    </div>
  )
}

export default SettingsContent
