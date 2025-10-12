'use client'

import s from '@/src/widgets/ViewPostModal/ui/ViewPostModal.module.scss'
import { AppLoader } from '@/src/shared/ui/AppLoader/AppLoader'
import { Modal } from '@/src/shared/ui/Modal/Modal'

export default function Loading() {
  return (
    <Modal
      className={`${s.modal} ${s.viewPostModal}`}
      isOpen={true}
      onClose={() => {}}
      onOverlayClick={() => {}}
      modalTitle={''}
      withoutPadding
      hideCloseButton
      hideDefaultButton
    >
      <div className={s.publication} style={{ height: '661px' }}>
        <AppLoader forceMode={true} />
      </div>
    </Modal>
  )
}
