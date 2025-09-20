import { useEffect, useState } from 'react'
import { useUpdatePostMutation } from '@/src/feature/Posts/api/postsApi'
import { toast } from 'react-toastify'
import { Modal } from '@/src/shared/components/Modal/Modal'
import s from './PostEditModal.module.scss'

type Props = {
  postId: string
  initialDescription: string
  isOpen: boolean
  onClose: () => void
}

export const PostEditModal = ({ postId, initialDescription, isOpen, onClose }: Props) => {
  const [description, setDescription] = useState(initialDescription)
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

  const handleConfirnClose = () => {
    if (description !== initialDescription) {
      setShowConfirmExit(true)
    } else {
      onClose()
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleConfirnClose} modalTitle={'Edit Post'} hideDefaultButton>
        <textarea className={s.textarea} value={description} onChange={(e) => setDescription(e.target.value)} />
        <div className={s.actions}>
          <button disabled={isLoading} onClick={handleSave}>
            Save Changes
          </button>
          <button onClick={handleConfirnClose}>Cancel</button>
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
