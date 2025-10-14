'use client'
import { ShowPayments } from '@/src/features/payments/showPayments'
import { FlexContainer } from '@/src/shared/ui'
import s from './MyPaymentsPage.module.scss'

export const MyPaymentsPage = () => {
  return (
    <FlexContainer className={s.container}>
      <ShowPayments className={s.table}></ShowPayments>
    </FlexContainer>
  )
}
