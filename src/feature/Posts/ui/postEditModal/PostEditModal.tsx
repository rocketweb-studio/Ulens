import { useEffect, useState } from 'react'
import { useUpdatePostMutation } from '@/src/feature/Posts/api/postsApi'
import { toast } from 'react-toastify'
import { Modal } from '@/src/shared/components/Modal/Modal'
import s from './postEditModal.module.scss'
import { Button } from '@/src/shared/components/Button/Button'
import { IconArrowIosBackOutline } from '@rocketweb-studio/ulens-ui-kit'
import { CustomSwiper } from '@/src/shared/components/CustomSwiper'
import Image from 'next/image'
import { Controller } from 'react-hook-form'
import { TextArea } from '@/src/shared/components/TextArea/TextArea'

type Props = {
  postId: string
  initialDescription: string
  isOpen: boolean
  onClose: () => void
}

export const PostEditModal = ({ postId, initialDescription, isOpen, onClose }: Props) => {
  const [description, setDescription] = useState(initialDescription ?? '')
  const [showConfirmExit, setShowConfirmExit] = useState(false)
  const [updatePost, { isLoading }] = useUpdatePostMutation()

  useEffect(() => {
    if (isOpen) {
      setDescription(initialDescription)
      setShowConfirmExit(false)
    }
  }, [isOpen, initialDescription])

  const handleSave = async () => {
    try {
      await updatePost({ postId, description }).unwrap()
      onClose()
    } catch (error) {
      console.error('Update failed', error)
      toast.error('Update failed')
    }
  }

  const handleConfirmClose = () => {
    if (description !== initialDescription) {
      setShowConfirmExit(true)
    } else {
      onClose()
    }
  }

  return (
    <>
      {/*<Modal isOpen={isOpen} onClose={handleConfirmClose} modalTitle={'Edit Post'} hideDefaultButton>*/}
      {/*  <p>Add publication descriptions</p>*/}
      {/*  <textarea*/}
      {/*    className={s.textarea}*/}
      {/*    value={description}*/}
      {/*    onChange={(e) => setDescription(e.target.value)}*/}
      {/*    maxLength={500}*/}
      {/*  />*/}
      {/*  <div className={s.counter}>{description?.length ?? 0}/500</div>*/}
      {/*  <div className={s.actions}>*/}
      {/*    <button disabled={isLoading} onClick={handleSave}>*/}
      {/*      Save Changes*/}
      {/*    </button>*/}
      {/*  </div>*/}
      {/*</Modal>*/}

      <Modal isOpen={isOpen} onClose={handleConfirmClose} modalTitle='Edit Post' hideDefaultButton>
        <div className={s.wrapper}>
          {/* Левая колонка с картинкой */}
          <div className={s.imageColumn}>
            <Image src='/post-example.png' alt='Post image' width={600} height={600} className={s.postImage} />
          </div>

          {/* Правая колонка */}
          <div className={s.contentColumn}>
            <div className={s.profile}>
              <Image src='/avatar/avatar_mini.png' alt='Avatar' width={36} height={36} className={s.avatar} />
              <p className={s.userName}>UserName</p>
            </div>

            <label className={s.label}>Add publication descriptions</label>

            <div className={s.textareaWrapper}>
              <textarea
                id='description'
                className={s.textarea}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                rows={5}
              />
              <span className={s.counter}>{description?.length ?? 0}/500</span>
            </div>

            <div className={s.footer}>
              <button disabled={isLoading} className={s.saveButton} onClick={handleSave}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showConfirmExit}
        onClose={() => setShowConfirmExit(false)}
        modalTitle={'Unsaved changes'}
        hideDefaultButton
      >
        <p>Do you really want to finish editing? If you close the changes you have made will not be saved</p>
        <div className={s.actions}>
          <button
            onClick={() => {
              setShowConfirmExit(false)
              onClose()
            }}
          >
            Yes
          </button>
          <button onClick={() => setShowConfirmExit(false)}>No</button>
        </div>
      </Modal>
    </>
  )
}
