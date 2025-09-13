'use client'

import { useState } from 'react'
import s from './postMenuActions.module.scss'
import { PostDeleteModal } from '@/src/feature/Posts/ui/postDeleteModal'
import { IconEdit2, IconTrash } from '@rocketweb-studio/ulens-ui-kit'

type Props = {
  postId: string
}

export const PostMenuActions = ({ postId }: Props) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

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
            <IconEdit2 width={16} height={16} />
            Edit Post
          </button>
          <button
            className={s.menuItem}
            onClick={() => {
              setMenuOpen(false)
              setDeleteModalOpen(true)
            }}
          >
            <IconTrash width={16} height={16} />
            Delete Post
          </button>
        </div>
      )}

      <PostDeleteModal postId={postId} isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} />
    </div>
  )
}
