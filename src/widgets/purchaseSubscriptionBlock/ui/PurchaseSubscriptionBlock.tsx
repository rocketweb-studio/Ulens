'use client'
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
              options={[
                { value: '1', label: '$10 per 1 Day' },
                { value: '2', label: '$50 per 7 Day' },
                { value: '3', label: '$100 per month' },
              ]}
            ></RadioButtonsGroup>
          </Card>
          <FlexContainer className={s.paymentsButtonsGroup} justify={'end'}>
            <MakePayment></MakePayment>
          </FlexContainer>
        </section>
      )}
    </FlexContainer>
  )
}
