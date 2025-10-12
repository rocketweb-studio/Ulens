'use client'
import { Button } from '@/src/shared/ui/Button'
import { useMakePaymentMutation } from '@/src/entities/payments'
import { HTMLAttributes, useState } from 'react'
import { FlexContainer, Input } from '@/src/shared/ui'
import { Modal } from '@/src/shared/ui/Modal/Modal'
import { useModal } from '@/src/shared/hooks/useModal'
import s from './MakePayment.module.scss'
import { PaymentPlans } from '@/src/features/payments/makePayment/model/types'
import { redirectToExternalLink } from '@/src/shared/utils/redirectToExternalLink'

type Props = {
  planId: number
} & HTMLAttributes<HTMLDivElement>

export const MakePayment = ({ planId }: Props) => {
  const [makePayment, { data: payment }] = useMakePaymentMutation()
  const { isOpen, closeModal, openModal } = useModal()
  const [accessAutoRenevalCheckbox, setAccessAutoRenevalCheckbox] = useState<boolean>(false)
  const [currentPayment, setCurrentPayment] = useState<PaymentPlans | null>(null)

  const onCloseModalHandler = () => {
    closeModal()
    setAccessAutoRenevalCheckbox(false)
  }

  const onButtonPaymentClick = ({ payment }: { payment: PaymentPlans }) => {
    openModal()
    setCurrentPayment(payment)
  }

  const onButtonOkClick = async () => {
    try {
      if (currentPayment) {
        const paymentResponce = await makePayment({ planId, provider: currentPayment }).unwrap()
        onCloseModalHandler()
        redirectToExternalLink(paymentResponce.url)
      }
    } catch (err) {}
  }

  return (
    <FlexContainer align={'center'} gap={'54px'} wrap>
      <Button onClick={() => onButtonPaymentClick({ payment: 'PAYPAL' })}>
        Paypal
        {/*<IconPaypal className={s.icon} />*/}
      </Button>
      <span>or</span>
      <Button onClick={() => onButtonPaymentClick({ payment: 'STRIPE' })}>
        Stripe
        {/*<IconStripe className={s.icon} />*/}
      </Button>
      <Modal
        className={s.modalAccessAutoRenewal}
        isOpen={isOpen}
        onClose={onCloseModalHandler}
        modalTitle={'Create payment'}
        hideDefaultButton
      >
        <p>Auto-renewal will be enabled with this payment. You can disable it anytime in your profile settings</p>
        <FlexContainer align={'center'}>
          <Input
            className={s.accessAutoRenevalInput}
            type={'checkbox'}
            label={'I agree'}
            onChange={(e) =>
              e.target.checked ? setAccessAutoRenevalCheckbox(true) : setAccessAutoRenevalCheckbox(false)
            }
          />
          <Button
            className={s.buttonModalOk}
            size={'large'}
            disabled={!accessAutoRenevalCheckbox}
            onClick={onButtonOkClick}
          >
            OK
          </Button>
        </FlexContainer>
      </Modal>
    </FlexContainer>
  )
}
