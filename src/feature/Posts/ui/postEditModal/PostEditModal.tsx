import { useEffect, useState } from 'react'
import { useUpdatePostMutation } from '@/src/feature/Posts/api/postsApi'
import { toast } from 'react-toastify'
import { Modal } from '@/src/shared/components/Modal/Modal'
import s from './postEditModal.module.scss'
import Image from 'next/image'

type ImageType = {
  url: string
  width: number
  height: number
  size: 'small' | 'medium' | 'large'
}

type Props = {
  postId: string
  initialDescription: string
  images: ImageType[]
  isOpen: boolean
  onClose: () => void
}

export const PostEditModal = ({ postId, initialDescription, isOpen, onClose, images }: Props) => {
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

  const image = images.find((img) => img.size === 'medium') ?? images[0]

  const handleConfirmClose = () => {
    if (description !== initialDescription) {
      setShowConfirmExit(true)
    } else {
      onClose()
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleConfirmClose} modalTitle='Edit Post' hideDefaultButton>
        <div className={s.wrapper}>
          <div className={s.imageColumn}>
            {image && (
              <Image
                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${image.url}`}
                alt='Post image'
                width={image.width}
                height={image.height}
                className={s.postImage}
              />
            )}
          </div>

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
