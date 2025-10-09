'use client'
import { Button } from '@/src/shared/ui/Button'
import s from './MakePayment.module.scss'
import { IconPaypal, IconStripe } from '@rocketweb-studio/ulens-ui-kit'
import { useMakePaymentMutation } from '@/src/entities/payments'
import { HTMLAttributes } from 'react'
import { FlexContainer } from '@/src/shared/ui'

type Props = HTMLAttributes<HTMLDivElement>

export const MakePayment = ({ ...Props }: Props) => {
  const [makePayment, { data: payment }] = useMakePaymentMutation()

  return (
    <FlexContainer align={'center'} gap={'54px'} wrap>
      <Button>
        Paypal
        {/*<IconPaypal className={s.icon} />*/}
      </Button>
      <span>or</span>
      <Button>
        Stripe
        {/*<IconStripe className={s.icon} />*/}
      </Button>
    </FlexContainer>
  )
}
