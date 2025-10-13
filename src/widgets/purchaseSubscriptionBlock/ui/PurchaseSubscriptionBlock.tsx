'use client'
import { useGetPlansQuery } from '@/src/entities/payments'
import s from './purchaseSubscriptionBlock.module.scss'
import { MakePayment } from '@/src/features/payments/makePayment'
import { Card, FlexContainer } from '@/src/shared/ui'
import { RadioButtonsGroup } from '@/src/shared/ui/RadioButtonsGroup/RadioButtonsGroup'
import { useState } from 'react'

type AccountType = 'personal' | 'business'
type SubscriptionVariant = '1' | '2' | '3'

export const PurchaseSubscriptionBlock = () => {
  const [accountType, setAccountType] = useState<AccountType>('personal')
  const [subscriptionVariant, setSubscriptionVariant] = useState<SubscriptionVariant>('1')
  const { data: plans } = useGetPlansQuery()
  const plansRadioButtons = plans ? plans.map((plan) => ({ value: plan.id.toString(), label: plan.title })) : []

  return (
    <FlexContainer direction={'column'} gap={'30px'}>
      <section>
        <h2 className={s.title}>Account type:</h2>
        <Card contentClass={s.accountTypeCardContent}>
          <RadioButtonsGroup
            name={'account-type'}
            value={accountType}
            onChange={(e) => setAccountType(e as AccountType)}
            options={[
              { value: 'personal', label: 'Personal' },
              { value: 'business', label: 'Business' },
            ]}
          ></RadioButtonsGroup>
        </Card>
      </section>
      {accountType === 'business' && (
        <section>
          <h2 className={s.title}>Your subscription costs:</h2>
          <Card contentClass={s.accountTypeCardContent}>
            <RadioButtonsGroup
              name={'subscription-variant'}
              value={subscriptionVariant}
              onChange={(e) => setSubscriptionVariant(e as SubscriptionVariant)}
              options={plansRadioButtons}
            ></RadioButtonsGroup>
          </Card>
          <FlexContainer className={s.paymentsButtonsGroup} justify={'end'}>
            <MakePayment planId={Number(subscriptionVariant)}></MakePayment>
          </FlexContainer>
        </section>
      )}
    </FlexContainer>
  )
}
