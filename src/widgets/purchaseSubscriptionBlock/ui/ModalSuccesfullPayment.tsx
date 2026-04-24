'use client'

import { Modal } from '@/src/shared/ui/Modal/Modal'
import { useModal } from '@/src/shared/hooks/useModal'
import { updateSearchParams } from '@/src/shared/utils'
import { useRouter } from 'next/navigation'
import { Button } from '@/src/shared/ui'

export const ModalSuccesfullPayment = () => {
  const { isOpen, closeModal } = useModal(true)
  const router = useRouter()

  const onCloseModalHandler = () => {
    updateSearchParams({ payment: '' }, router)
    closeModal()
  }
  return (
    <Modal modalTitle={'Success'} onClose={onCloseModalHandler} isOpen={isOpen} hideDefaultButton>
      <p>Payment was successful!</p>
      <Button variant={'primary'} onClick={onCloseModalHandler} fullWidth>
        OK
      </Button>
    </Modal>
  )
}
