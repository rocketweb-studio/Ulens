'use client'

import { Tabs } from 'src/widgets/Tabs'
import { redirect, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Path } from '@/src/shared/router/Path'

import { useGetMeQuery } from '@/src/entities/auth/api/authApi'
import { GeneralInformation } from '@/src/pages/generalInformation'
import { AccountManagementPage } from '@/src/pages/accountManagementPage'
import { ModalFailedPayment, ModalSuccesfullPayment } from '@/src/widgets/purchaseSubscriptionBlock'
import { MyPaymentsPage } from '@/src/pages/myPaymentsPage'

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
  const payment = params?.get('payment')
  if (!part || !allowedParts.includes(part)) {
    redirect(Path.Settings('info'))
  }

  return (
    <div>
      <Tabs />
      {part === 'info' && <GeneralInformation />}
      {part === 'devices' && <p>Текущий раздел: {part}</p>}
      {part === 'subscriptions' && <AccountManagementPage />}
      {part === 'subscriptions' && payment === 'success' && <ModalSuccesfullPayment />}
      {part === 'subscriptions' && payment === 'failed' && <ModalFailedPayment />}
      {part === 'payments' && <MyPaymentsPage />}
    </div>
  )
}

export default SettingsContent
