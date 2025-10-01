'use client'

import { Modal } from '@/src/shared/components/Modal/Modal'
import { Button } from '@/src/shared/components/Button/Button'
import s from './PostCreateModal.module.scss'

type Props = {
  isModalOpen: boolean
  onModalClose: () => void
  getRootProps: any
  getInputProps: any
  isDragActive: boolean
  dropError: string | null
}

export const AddStep = ({ isModalOpen, onModalClose, getRootProps, getInputProps, isDragActive, dropError }: Props) => {
  return (
    <Modal className={s.modal} isOpen={isModalOpen} onClose={onModalClose} modalTitle={'Add Photo'} hideDefaultButton>
      <div className={s.addStep}>
        <div {...getRootProps()} className={`${s.dropzone} ${isDragActive ? s.active : ''}`}>
          <input {...getInputProps()} />
          <div className={s.dropzoneContent}>
            <Button variant={'primary'}>Select from Computer</Button>
          </div>
        </div>
        {dropError && (
          <div className={s.dropError}>
            <p className={s.dropErrorText}>{dropError}</p>
          </div>
        )}
      </div>
    </Modal>
  )
}
