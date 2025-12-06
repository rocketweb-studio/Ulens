import { Modal } from '@/src/shared/ui/Modal/Modal'
import { Button } from '@/src/shared/ui'
import s from './PostCreateModal.module.scss'

type Props = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export const ConfirmCloseModal = ({ isOpen, onClose, onConfirm }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} modalTitle={'Сlose'} hideDefaultButton>
      <p className={s.accessCloseModalText}>
        Do you really want to close the creation of a publication? If you close everything will be deleted
      </p>
      <div className={s.accessCloseModalButtons}>
        <Button variant={'outline'} onClick={onClose}>
          Discard
        </Button>
        <Button variant={'primary'} onClick={onConfirm}>
          Yes
        </Button>
      </div>
    </Modal>
  )
}
