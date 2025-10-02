'use client'

import { useDeletePostMutation } from '@/src/feature/Posts/api/postsApi'
import { Modal } from '@/src/shared/components/Modal/Modal'
import s from './postDeleteModal.module.scss'
import { toast } from 'react-toastify'

type Props = {
  postId: string
  userId: string
  isOpen: boolean
  onClose: () => void
}

export const PostDeleteModal = ({ postId, isOpen, onClose, userId }: Props) => {
  const [deletePost, { isLoading }] = useDeletePostMutation()

  const handleDelete = async () => {
    try {
      await deletePost({ postId, userId }).unwrap()
      onClose()
    } catch (error) {
      console.error('Error deleting the post', error)
      toast.error('Error deleting the post')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} modalTitle={'Delete Post'} hideDefaultButton>
      <p>Are you sure you want to delete this post?</p>
      <div className={s.modalButtons}>
        <button type='button' className={s.yesBtn} onClick={handleDelete} disabled={isLoading}>
          Yes
        </button>
        <button type='button' className={s.noBtn} onClick={onClose} disabled={isLoading}>
          No
        </button>
      </div>
    </Modal>
  )
}
