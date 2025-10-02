'use client'

import { useEffect, useRef, useState } from 'react'
import s from './postMenuActions.module.scss'
import { PostDeleteModal } from '@/src/feature/Posts/ui/postDeleteModal'
import { IconEdit2, IconTrash } from '@rocketweb-studio/ulens-ui-kit'
import { PostEditModal } from '@/src/feature/Posts/ui/postEditModal'
import { useGetMeQuery } from '@/src/feature/auth/api/authApi'

type Props = {
  postOwnerId?: string
  postId: string
  userId: string
  description: string
  className?: string
  onPostDeleted?: () => void
}

export const PostMenuActions = ({ postOwnerId, postId, userId, description, className, onPostDeleted }: Props) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)

  const { data: meData } = useGetMeQuery()

  useEffect(() => {
    if (!menuOpen) return

    const handlerClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handlerClickOutside)
    return () => {
      document.removeEventListener('mousedown', handlerClickOutside)
    }
  }, [menuOpen])

  return (
    <div className={`${s.container} ${className || ''}`} ref={containerRef}>
      <button className={s.dotsButton} onClick={() => setMenuOpen((prev) => !prev)}>
        <span />
        <span />
        <span />
      </button>

      {menuOpen && (
        <>
          {meData?.id === postOwnerId ?
            <div className={s.menu}>
              <button className={s.menuItem} onClick={() => setEditOpen(true)}>
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
          : <div className={s.menu}>
              <button className={s.menuItem}>Follow/Unfollow</button>
              <button className={s.menuItem}>CopyLink</button>
            </div>
          }
        </>
      )}

      <PostEditModal
        postId={postId}
        initialDescription={description}
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
      />
      <PostDeleteModal
        postId={postId}
        userId={userId}
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          if (onPostDeleted) onPostDeleted()
        }}
      />
    </div>
  )
}
