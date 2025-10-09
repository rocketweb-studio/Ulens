'use client'

import s from '@/src/widgets/ViewPostModal/ui/ViewPostModal.module.scss'
import { AppLoader } from '@/src/shared/ui/AppLoader/AppLoader'
import { Modal } from '@/src/shared/ui/Modal/Modal'
import { useEffect, useState } from 'react'

export default function Loading() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 100)
    return () => clearTimeout(timer)
  }, [])

  if (!show) return null

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
