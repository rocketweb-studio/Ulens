'use client'

import { Modal } from '@/src/shared/ui/Modal/Modal'
import { useModal } from '@/src/shared/hooks/useModal'
import { useRouter } from 'next/navigation'
import { updateSearchParams } from '@/src/shared/utils'
import { Button } from '@/src/shared/ui'

export const ModalFailedPayment = () => {
  const { isOpen, closeModal } = useModal(true)
  const router = useRouter()

  const onCloseModalHandler = () => {
    updateSearchParams({ payment: '' }, router)
    closeModal()
  }
  return (
    <Modal modalTitle={'Error'} onClose={onCloseModalHandler} isOpen={isOpen} hideDefaultButton>
      <p>Transaction failed. Please, write to support</p>
      <Button variant={'primary'} onClick={onCloseModalHandler} fullWidth>
        Back to payment
      </Button>
    </Modal>
  )
}
