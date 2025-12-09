'use client'

import React, { useEffect, useRef, useState } from 'react'
import s from './postMenuActions.module.scss'
import { IconDoneAllOutline, IconEdit2, IconTrash } from '@rocketweb-studio/ulens-ui-kit'
import { useGetMeQuery } from '@/src/entities/auth/api/authApi'
import { PostDeleteModal } from '@/src/features/post/postDelete'
import { useFollowUserMutation, useGetFollowingsQuery, useUnfollowUserMutation } from '@/src/entities/user/api/userApi'
import { AnimatePresence, motion } from 'framer-motion'

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

  const { data: followingsData } = useGetFollowingsQuery()

  const followStatus = followingsData?.items.find((user) => user.id === userId)

  const [follow, { isLoading: followIsLoading }] = useFollowUserMutation()
  const [unfollow, { isLoading: unfollowIsLoading }] = useUnfollowUserMutation()

  const handleFollow = () => follow({ userId })
  const handleUnfollow = () => unfollow({ userId })

  const containerRef = useRef<HTMLDivElement>(null)

  const { data: meData, isSuccess } = useGetMeQuery()
  const isAuth = !!meData?.id && isSuccess

  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    const url = window.location.href
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000) // Сброс через 2 секунды
      })
      .catch((err) => {
        console.error('Ошибка копирования: ', err)
      })
  }

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
              {isAuth && (
                <>
                  {followStatus ?
                    <button className={s.menuItem} onClick={handleUnfollow} disabled={unfollowIsLoading}>
                      Unfollow
                    </button>
                  : <button className={s.menuItem} onClick={handleFollow} disabled={followIsLoading}>
                      Follow
                    </button>
                  }
                </>
              )}
              <button className={s.menuItem} onClick={copyToClipboard}>
                CopyLink{' '}
                <AnimatePresence>
                  {copied && (
                    <motion.span
                      initial={{ opacity: 0, lineHeight: 0, x: '-7px' }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <IconDoneAllOutline width={17} height={17} color={'green'} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
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
