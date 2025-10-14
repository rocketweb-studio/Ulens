'use client'

import { Modal } from '@/src/shared/ui/Modal/Modal'
import { useModal } from '@/src/shared/hooks/useModal'

export const ModalSuccesfullPayment = () => {
  const { isOpen, closeModal } = useModal(true)
  const onCloseModalHandler = () => {
    closeModal()
  }
  return (
    <Modal modalTitle={'Success'} onClose={onCloseModalHandler} isOpen={isOpen}>
      <p>Payment was successful!</p>
    </Modal>
  )
}
