'use client'

import { useDeletePostMutation } from '@/src/feature/Posts/api/postsApi'
import { useRouter } from 'next/navigation'
import { Path } from '@/src/shared/constants/Path'
import { Modal } from '@/src/shared/components/Modal/Modal'
import { Button } from '@rocketweb-studio/ulens-ui-kit'
import s from './postDeleteModal.module.scss'

type Props = {
  postId: string
  isOpen: boolean
  onClose: () => void
}

export const PostDeleteModal = ({ postId, isOpen, onClose }: Props) => {
  const [deletePost, { isLoading }] = useDeletePostMutation()
  const router = useRouter()

  const handleDelete = async () => {
    try {
      await deletePost(postId).unwrap()
      onClose()
      router.push(Path.Profile)
    } catch (error) {
      console.error('Error deleting the post', error)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} modalTitle={'Delete Post'} hideDefaultButton>
      <p>Are you sure you want to delete this post?</p>
      <div className={s.modalButtons}>
        <Button onClick={handleDelete} disabled={isLoading}>
          Yes
        </Button>
        <Button onClick={onClose} disabled={isLoading}>
          No
        </Button>
      </div>
    </Modal>
  )
}
