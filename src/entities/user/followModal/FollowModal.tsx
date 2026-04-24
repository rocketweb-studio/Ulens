'use client'

import { useEffect, useMemo, useState } from 'react'
import { useFollowUserMutation, useUnfollowUserMutation } from '@/src/entities/user/api/userApi'
import { Modal } from '@/src/shared/ui/Modal/Modal'
import s from './FollowModal.module.scss'
import { useAvatarMap } from '@/src/shared/hooks/useAvatarMap'
import { FollowUserItem } from '@/src/widgets/FollowModal/ui/FollowUserItem'

type Props = {
  isOpen: boolean
  onClose: () => void
  title: string
  data: {
    id: string
    userName: string
    firstName: string
    lastName: string
    aboutMe: string
  }[]
  followingsIds?: string[]
}

export const FollowModal = ({ isOpen, onClose, title, data, followingsIds }: Props) => {
  const [search, setSearch] = useState('')
  const avatarMap = useAvatarMap()

  const [follow] = useFollowUserMutation()
  const [unfollow] = useUnfollowUserMutation()

  useEffect(() => {
    if (!isOpen) setSearch('')
  }, [isOpen])

  const filtered = useMemo(() => {
    if (!search.trim()) return data

    const term = search.toLowerCase()
    return data.filter(
      (u) =>
        u.userName.toLowerCase().includes(term) ||
        u.firstName.toLowerCase().includes(term) ||
        u.lastName.toLowerCase().includes(term),
    )
  }, [search, data])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      modalTitle={title}
      onOverlayClick={onClose}
      withoutPadding
      hideDefaultButton
    >
      <div className={s.container}>
        <input
          className={s.search}
          placeholder='Search'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClick={(e) => e.stopPropagation()}
        />

        <div className={s.list}>
          {filtered.map((u) => {
            const isFollowing = followingsIds?.includes(u.id)
            const avatar = avatarMap[u.id] ?? null

            return (
              <FollowUserItem
                key={u.id}
                user={u}
                avatar={avatar}
                isFollowing={!!isFollowing}
                onFollow={() => follow({ userId: u.id })}
                onUnfollow={() => unfollow({ userId: u.id })}
                onClose={onClose}
              />
            )
          })}
        </div>
      </div>
    </Modal>
  )
}
