import { useEffect, useRef, useState } from 'react'
import { useGetPostByIdQuery, useUpdatePostMutation } from '@/src/feature/Posts/api/postsApi'
import { toast } from 'react-toastify'
import { Modal } from '@/src/shared/components/Modal/Modal'
import s from './postEditModal.module.scss'
import Image from 'next/image'

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

  const { data: postInfo } = useGetPostByIdQuery({ postId }, { skip: !isOpen })

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    if (isOpen && postInfo && textareaRef.current) {
      setDescription(postInfo.description ?? '')
      setShowConfirmExit(false)

      const textarea = textareaRef.current
      textarea.focus()
      textarea.selectionStart = textarea.selectionEnd = textarea.value.length
    }
  }, [isOpen, postInfo])

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

  const firstImage = postInfo?.images?.medium?.[0]

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleConfirmClose} modalTitle='Edit Post' hideDefaultButton>
        <div className={s.wrapper}>
          <div className={s.imageColumn}>
            {firstImage && (
              <Image
                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${firstImage.url}`}
                alt='Post image'
                width={firstImage.width}
                height={firstImage.height}
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
                ref={textareaRef}
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
        <div className={s.modalButtons}>
          <button
            className={s.yesBtn}
            onClick={() => {
              setShowConfirmExit(false)
              onClose()
            }}
          >
            Yes
          </button>
          <button className={s.noBtn} onClick={() => setShowConfirmExit(false)}>
            No
          </button>
        </div>
      </Modal>
    </>
  )
}
