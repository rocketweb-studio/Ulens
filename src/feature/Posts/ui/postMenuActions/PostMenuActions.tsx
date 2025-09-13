'use client'

import { useState } from 'react'
import { Modal } from '@/src/shared/components/Modal/Modal'
import { Button } from '@/src/shared/components/Button/Button'
import { useDeletePostMutation } from '@/src/feature/Posts/api/postsApi'
import { useRouter } from 'next/navigation'
import s from './postMenuActions.module.scss'
import Image from 'next/image'
import editIcon from '@/public/edit.svg'
import deleteIcon from '@/public/trash.svg'
import { Path } from '@/src/shared/constants/Path'

type Props = {
  postId: string
}

export const PostMenuActions = ({ postId }: Props) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [deletePost, { isLoading }] = useDeletePostMutation()
  const router = useRouter()

  const handleDelete = async () => {
    try {
      await deletePost(postId).unwrap()
      setIsOpen(false)
      router.push(Path.Profile)
    } catch (e) {
      console.error('Ошибка удаления поста', e)
    }
  }

  return (
    <div className={s.container}>
      <button className={s.dotsButton} onClick={() => setMenuOpen((prev) => !prev)}>
        <span />
        <span />
        <span />
      </button>

      {menuOpen && (
        <div className={s.menu}>
          <button className={s.menuItem} onClick={() => alert('Edit post clicked')}>
            <Image src={editIcon} alt='edit' width={16} height={16} />
            Edit Post
          </button>
          <button className={s.menuItem} onClick={() => setIsOpen(true)}>
            <Image src={deleteIcon} alt='delete' width={16} height={16} />
            Delete Post
          </button>
        </div>
      )}

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} modalTitle='Delete Post' hideDefaultButton>
        <p>Are you sure you want to delete this post?</p>
        <div className={s.modalButtons}>
          <Button onClick={() => setIsOpen(false)} disabled={isLoading}>
            No
          </Button>
          <Button onClick={handleDelete} disabled={isLoading}>
            Yes
          </Button>
        </div>
      </Modal>
    </div>
  )
}
