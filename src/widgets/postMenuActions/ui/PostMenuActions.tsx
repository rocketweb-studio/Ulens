'use client'

import { useEffect, useRef, useState } from 'react'
import s from './postMenuActions.module.scss'
import { IconEdit2, IconTrash } from '@rocketweb-studio/ulens-ui-kit'
import { useGetMeQuery } from '@/src/entities/auth/api/authApi'
import { PostDeleteModal } from '@/src/features/post/postDelete'

type Props = {
  postOwnerId?: string
  postId: string
  userId: string
  className?: string
  onPostDeleted?: () => void
  handleSetEditMode?: () => void
}

export const PostMenuActions = ({
  postOwnerId,
  postId,
  userId,
  className,
  onPostDeleted,
  handleSetEditMode = () => {},
}: Props) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  //const [editOpen, setEditOpen] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)

  const { data: meData, isSuccess } = useGetMeQuery()
  const isAuth = !!meData?.id && isSuccess
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
          {isAuth && meData?.id === postOwnerId ?
            <div className={s.menu}>
              <button
                className={s.menuItem}
                onClick={() => {
                  setMenuOpen(false)
                  handleSetEditMode()
                }}
              >
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
      {/*{editOpen && (*/}
      {/*  <PostEditModal*/}
      {/*    postId={postId}*/}
      {/*    initialDescription={description}*/}
      {/*    isOpen={editOpen}*/}
      {/*    onClose={() => setEditOpen(false)}*/}
      {/*    onUpdated={onDescriptionUpdated}*/}
      {/*  />*/}
      {/*)}*/}
      {deleteModalOpen && (
        <PostDeleteModal
          postId={postId}
          userId={userId}
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false)
            if (onPostDeleted) onPostDeleted()
          }}
        />
      )}
    </div>
  )
}
